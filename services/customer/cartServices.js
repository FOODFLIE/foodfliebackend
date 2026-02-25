const Cart = require("../../models/cart");
const CartItem = require("../../models/cartItems");
const Product = require("../../models/product");
const sequelize = require("../../config/sequelize");



const AddToCart = async (customer_id, sku, quantity = 1) => {
  // Validate input
  if (!customer_id || !sku) throw new Error("Invalid request");
  if (quantity <= 0) throw new Error("Invalid quantity");

  const t = await sequelize.transaction();

  try {
    // Fetch product by SKU and check availability
    const product = await Product.findOne({ where: { sku }, transaction: t });
    if (!product || !product.is_available) {
      throw new Error("Product unavailable");
    }

    // Find active cart for customer with lock to prevent race conditions
    let cart = await Cart.findOne({
      where: { customer_id, status: "active" },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    // Enforce single restaurant cart rule
    if (cart && cart.partner_id !== product.partner_id) {
      throw new Error("You can order from only one restaurant at a time");
    }

    // Create new cart if doesn't exist
    if (!cart) {
      cart = await Cart.create(
        { customer_id, partner_id: product.partner_id, delivery_fee: 20 },
        { transaction: t },
      );
    }

    // Check if product already in cart by SKU
    let cartItem = await CartItem.findOne({
      where: { cart_id: cart.id, sku },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    let priceChange = 0;

    if (cartItem) {
      // Update existing cart item
      const oldTotal = Number(cartItem.total_price);
      cartItem.quantity += quantity;
      cartItem.total_price = cartItem.quantity * cartItem.price;
      priceChange = cartItem.total_price - oldTotal;
      await cartItem.save({ transaction: t });
    } else {
      // Create new cart item
      const total_price = product.price * quantity;
      cartItem = await CartItem.create(
        {
          cart_id: cart.id,
          sku,
          product_name: product.name,
          price: product.price,
          quantity,
          total_price,
        },
        { transaction: t },
      );
      priceChange = total_price;
    }

    // Update cart totals efficiently without fetching all items
    cart.subtotal = Number(cart.subtotal) + Number(priceChange);
    cart.total = Number(cart.subtotal) + Number(cart.delivery_fee);
    await cart.save({ transaction: t });

    await t.commit();
    return { cart, cartItem };
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

const GetCart = async (customer_id) => {
  try {
    const cart = await Cart.findOne({
      where: { customer_id, status: "active" }
    });
    
    if (!cart) return null;
    
    const items = await CartItem.findAll({
      where: { cart_id: cart.id }
    });
    
    return { ...cart.toJSON(), items };
  } catch (error) {
    throw error;
  }
};

const UpdateCartItem = async (cart_item_id, quantity) => {
  const t = await sequelize.transaction();

  try {
    // Find cart item
    const cartItem = await CartItem.findByPk(cart_item_id);
    if (!cartItem) throw new Error("Cart item not found");

    // Update quantity and total price
    cartItem.quantity = quantity;
    cartItem.total_price = cartItem.price * quantity;
    await cartItem.save({ transaction: t });

    // Recalculate cart totals
    const cart = await Cart.findByPk(cartItem.cart_id);
    const items = await CartItem.findAll({ where: { cart_id: cart.id } });
    cart.subtotal = items.reduce(
      (sum, item) => sum + Number(item.total_price),
      0,
    );
    cart.total = Number(cart.subtotal) + Number(cart.delivery_fee);
    await cart.save({ transaction: t });

    await t.commit();
    return { cart, cartItem };
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

const RemoveFromCart = async (cart_item_id) => {
  const t = await sequelize.transaction();

  try {
    // Find and delete cart item
    const cartItem = await CartItem.findByPk(cart_item_id);
    if (!cartItem) throw new Error("Cart item not found");

    const cart_id = cartItem.cart_id;
    await cartItem.destroy({ transaction: t });

    // Check remaining items
    const cart = await Cart.findByPk(cart_id);
    const items = await CartItem.findAll({ where: { cart_id } });

    if (items.length === 0) {
      // Delete cart if empty
      await cart.destroy({ transaction: t });
    } else {
      // Recalculate cart totals
      cart.subtotal = items.reduce(
        (sum, item) => sum + Number(item.total_price),
        0,
      );
      cart.total = Number(cart.subtotal) + Number(cart.delivery_fee);
      await cart.save({ transaction: t });
    }

    await t.commit();
    return { message: "Item removed from cart" };
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

module.exports = { AddToCart, GetCart, UpdateCartItem, RemoveFromCart };
