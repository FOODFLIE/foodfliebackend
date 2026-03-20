const Cart = require("../../models/cart");
const CartItem = require("../../models/cartItems");
const Product = require("../../models/product");
const sequelize = require("../../config/sequelize");
const { getFoodflieoptions } = require("../../utils/foodlieutils");

const flies = getFoodflieoptions();
const delivery_fee = flies.delivery_fee ;


const AddToCart = async (customer_id, sku, quantity = 1) => {
  if (!customer_id || !sku) throw new Error("Invalid request");
  if (quantity <= 0) throw new Error("Invalid quantity");

  const t = await sequelize.transaction();

  try {
    // Single query to get product with availability check
    const product = await Product.findOne({ 
      where: { sku, is_available: true }, 
      attributes: ["id", "name", "price", "partner_id"],
      transaction: t 
    });
    if (!product) throw new Error("Product unavailable");

    // Find or create cart
    let [cart, created] = await Cart.findOrCreate({
      where: { customer_id, status: "active" },
      defaults: { 
        customer_id, 
        partner_id: product.partner_id, 
        delivery_fee: delivery_fee,
        subtotal: 0,
        total: 0
      },
      transaction: t
    });

    // Enforce single restaurant rule
    if (!created && cart.partner_id !== product.partner_id) {
      throw new Error("You can order from only one restaurant at a time");
    }

    // Update delivery fee every time
    if (!created) {
      cart.delivery_fee = delivery_fee;
      await cart.save({ transaction: t });
    }

    // Upsert cart item
    const [cartItem, itemCreated] = await CartItem.findOrCreate({
      where: { cart_id: cart.id, product_id: product.id },
      defaults: {
        cart_id: cart.id,
        product_id: product.id,
        product_name: product.name,
        price: product.price,
        quantity,
        total_price: product.price * quantity
      },
      transaction: t
    });

    if (!itemCreated) {
      cartItem.quantity += quantity;
      cartItem.total_price = cartItem.quantity * cartItem.price;
      await cartItem.save({ transaction: t });
    }

    // Recalculate cart totals using Sequelize aggregation
    const totalResult = await CartItem.sum('total_price', {
      where: { cart_id: cart.id },
      transaction: t
    });
    
    cart.subtotal = totalResult || 0;
    cart.total = cart.subtotal + Number(cart.delivery_fee);
    await cart.save({ transaction: t });

    await t.commit();
    return { message: "Item added to cart successfully" };
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

const GetCart = async (customer_id) => {
  try {
    const cart = await Cart.findOne({
      where: { customer_id, status: "active" },
      include: [
        {
          model: CartItem,
          as: "items",
          attributes: ["id", "product_id", "product_name", "price", "quantity", "total_price"]
        }
      ],
      attributes: ["id", "customer_id", "partner_id", "subtotal", "delivery_fee", "total", "status"]
    });
    
    if (!cart) return null;
    
    return cart;
  } catch (error) {
    throw error;
  }
};

const UpdateCartItem = async (cart_item_id, quantity) => {
  const t = await sequelize.transaction();

  try {
    const cartItem = await CartItem.findByPk(cart_item_id, { transaction: t });
    if (!cartItem) throw new Error("Cart item not found");

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      await cartItem.destroy({ transaction: t });
      
      // Check if cart is empty
      const remainingCount = await CartItem.count({ 
        where: { cart_id: cartItem.cart_id }, 
        transaction: t 
      });
      
      if (remainingCount === 0) {
        await Cart.destroy({ where: { id: cartItem.cart_id }, transaction: t });
        await t.commit();
        return { message: "Cart is now empty and has been deleted" };
      }
    } else {
      // Update quantity
      cartItem.quantity = quantity;
      cartItem.total_price = cartItem.price * quantity;
      await cartItem.save({ transaction: t });
    }

    // Recalculate cart totals using Sequelize aggregation
    const cart = await Cart.findByPk(cartItem.cart_id, { transaction: t });
    const totalResult = await CartItem.sum('total_price', {
      where: { cart_id: cartItem.cart_id },
      transaction: t
    });
    
    cart.subtotal = totalResult || 0;
    cart.total = cart.subtotal + Number(cart.delivery_fee);
    await cart.save({ transaction: t });

    await t.commit();
    return { message: "Cart item updated successfully" };
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

const RemoveFromCart = async (cart_item_id) => {
  const t = await sequelize.transaction();

  try {
    const cartItem = await CartItem.findByPk(cart_item_id, { transaction: t });
    if (!cartItem) throw new Error("Cart item not found");

    const cart_id = cartItem.cart_id;
    await cartItem.destroy({ transaction: t });

    // Check if cart is empty using count
    const remainingCount = await CartItem.count({ 
      where: { cart_id }, 
      transaction: t 
    });

    if (remainingCount === 0) {
      await Cart.destroy({ where: { id: cart_id }, transaction: t });
      await t.commit();
      return { message: "Item removed. Cart is now empty and has been deleted." };
    }

    // Recalculate cart totals using Sequelize aggregation
    const cart = await Cart.findByPk(cart_id, { transaction: t });
    const totalResult = await CartItem.sum('total_price', {
      where: { cart_id },
      transaction: t
    });
    
    cart.subtotal = totalResult || 0;
    cart.total = cart.subtotal + Number(cart.delivery_fee);
    await cart.save({ transaction: t });

    await t.commit();
    return { message: "Item removed from cart" };
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

const SyncGuestCart = async (customer_id, guestItems) => {
  if (!customer_id) throw new Error("Invalid request");
  if (!Array.isArray(guestItems) || guestItems.length === 0) {
    throw new Error("Guest cart items must be a non-empty array");
  }

  const synced = [];
  const skipped = [];
  let finalCart = null;

  for (const { sku, quantity = 1 } of guestItems) {
    // Basic validation per item
    if (!sku || quantity <= 0) {
      skipped.push({ sku, reason: "Invalid sku or quantity" });
      continue;
    }

    const t = await sequelize.transaction();
    try {
      // Fetch product by SKU and check availability
      const product = await Product.findOne({ where: { sku }, transaction: t });
      if (!product || !product.is_available) {
        await t.rollback();
        skipped.push({ sku, reason: "Product unavailable" });
        continue;
      }

      // Find active cart for customer with lock
      let cart = await Cart.findOne({
        where: { customer_id, status: "active" },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      // Enforce single restaurant rule
      if (cart && cart.partner_id !== product.partner_id) {
        await t.rollback();
        skipped.push({ sku, reason: "Different restaurant — cart already active for another restaurant" });
        continue;
      }

      // Create cart if it doesn't exist
      if (!cart) {
        cart = await Cart.create(
          { customer_id, partner_id: product.partner_id, delivery_fee: 20 },
          { transaction: t }
        );
      }

      // Upsert cart item
      let cartItem = await CartItem.findOne({
        where: { cart_id: cart.id, product_id: product.id },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      let priceChange = 0;

      if (cartItem) {
        const oldTotal = Number(cartItem.total_price);
        cartItem.quantity += quantity;
        cartItem.total_price = cartItem.quantity * cartItem.price;
        priceChange = cartItem.total_price - oldTotal;
        await cartItem.save({ transaction: t });
      } else {
        const total_price = product.price * quantity;
        cartItem = await CartItem.create(
          {
            cart_id: cart.id,
            product_id: product.id,
            product_name: product.name,
            price: product.price,
            quantity,
            total_price,
          },
          { transaction: t }
        );
        priceChange = total_price;
      }

      // Update cart totals
      cart.subtotal = Number(cart.subtotal) + Number(priceChange);
      cart.total = Number(cart.subtotal) + Number(cart.delivery_fee);
      await cart.save({ transaction: t });

      await t.commit();
      finalCart = cart;
      synced.push({ sku, quantity });
    } catch (error) {
      await t.rollback();
      skipped.push({ sku, reason: error.message });
    }
  }

  // Return the latest cart state if anything was synced
  if (finalCart) {
    finalCart = await GetCart(customer_id);
  }

  return { synced, skipped, cart: finalCart };
};

module.exports = { AddToCart, GetCart, UpdateCartItem, RemoveFromCart, SyncGuestCart };
