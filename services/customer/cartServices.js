const Cart = require("../../models/cart");
const CartItem = require("../../models/cartItems");
const Product = require("../../models/product");
const sequelize = require("../../config/sequelize");
const { getFoodflieoptions } = require("../../utils/foodlieutils");
const ProductVariant = require("../../models/productVariant");

const flies = getFoodflieoptions();
const delivery_fee = flies.delivery_fee ;


const AddToCart = async (customer_id, sku, quantity = 1) => {
  if (!customer_id || !sku) throw new Error("Invalid request");
  if (quantity <= 0) throw new Error("Invalid quantity");

  const t = await sequelize.transaction();

  try {
    // 1️⃣ Try to find product directly
    let product = await Product.findOne({
      where: { sku, is_available: true },
      attributes: ["id", "name", "price", "partner_id"],
      transaction: t
    });

    let variant = null;

    // 2️⃣ If not found → check variant
    if (!product) {
      variant = await ProductVariant.findOne({
        where: { sku, is_available: true },
        attributes: ["id", "product_id", "price", "name"],
        transaction: t
      });

      if (!variant) throw new Error("Product unavailable");

      // Fetch parent product
      product = await Product.findByPk(variant.product_id, {
        attributes: ["id", "name", "partner_id"],
        transaction: t
      });
    }

    // 3️⃣ Final values
    const finalProductId = product.id;
    const finalVariantId = variant ? variant.id : null;
    const finalPrice = variant ? variant.price : product.price;
    const finalName = product.name;

    // 4️⃣ Find cart
    let cart = await Cart.findOne({
      where: { customer_id, status: "active" },
      transaction: t
    });

    if (!cart) {
      cart = await Cart.create({
        customer_id,
        partner_id: product.partner_id,
        delivery_fee,
        subtotal: 0,
        total: 0
      }, { transaction: t });
    }

    // 5️⃣ Enforce single restaurant - but allow replacement
    if (cart.partner_id !== product.partner_id) {
      // Clear existing cart items
      await CartItem.destroy({
        where: { cart_id: cart.id },
        transaction: t
      });
      
      // Update cart to new restaurant
      cart.partner_id = product.partner_id;
      cart.subtotal = 0;
      cart.total = 0;
      await cart.save({ transaction: t });
    }

    // 6️⃣ Find cart item (product + variant aware)
    let cartItem = await CartItem.findOne({
      where: {
        cart_id: cart.id,
        product_id: finalProductId,
        // variant_id: finalVariantId
      },
      transaction: t
    });

    const addedAmount = finalPrice * quantity;
    let cartItemId = null;

    if (!cartItem) {
      cartItem = await CartItem.create({
        cart_id: cart.id,
        product_id: finalProductId,
        // variant_id: finalVariantId,
        product_name: finalName,
        price: finalPrice,
        quantity,
        total_price: addedAmount
      }, { transaction: t });
      cartItemId = cartItem.id;
    } else {
      cartItem.quantity += quantity;
      cartItem.total_price += addedAmount;
      await cartItem.save({ transaction: t });
      cartItemId = cartItem.id;
    }

    // 7️⃣ Incremental cart update (NO aggregation)
    cart.subtotal += addedAmount;
    cart.delivery_fee = delivery_fee;
    cart.total = cart.subtotal + Number(cart.delivery_fee);

    await cart.save({ transaction: t });

    await t.commit();

    return {
      message: "Item added to cart successfully",
      cart_id: cart.id,
      cart_item_id: cartItemId
    };

  } catch (error) {
    if (!t.finished) {
      await t.rollback();
    }
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
    console.log("Fetched cart:", JSON.stringify(cart, null, 2));
    if (!cart) return null;
    
    // Recalculate totals if they seem incorrect
    if (cart.items && cart.items.length > 0) {
      const calculatedSubtotal = cart.items.reduce((sum, item) => {
        return sum + parseFloat(item.total_price || 0);
      }, 0);
      
      // If subtotal doesn't match, update it
      if (parseFloat(cart.subtotal) !== calculatedSubtotal) {
        cart.subtotal = calculatedSubtotal;
        cart.total = calculatedSubtotal + parseFloat(cart.delivery_fee || 0);
        await cart.save();
      }
    }
    
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
    if (!t.finished) {
      await t.rollback();
    }
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
    if (!t.finished) {
      await t.rollback();
    }
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
      if (!t.finished) {
        await t.rollback();
      }
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
