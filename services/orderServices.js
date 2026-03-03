const Order = require("../models/order");
const OrderItem = require("../models/order_item");
const Cart = require("../models/cart");
const CartItem = require("../models/cartItems");
const sequelize = require("../config/sequelize");

/**
 * Place order from cart
 */
const PlaceOrder = async (customer_id, address, payment_method = "COD") => {
  const t = await sequelize.transaction();

  try {
    // Get active cart
    const cart = await Cart.findOne({
      where: { customer_id, status: "active" },
      transaction: t,
    });

    if (!cart) throw new Error("Cart is empty");

    // Get cart items
    const cartItems = await CartItem.findAll({
      where: { cart_id: cart.id },
      transaction: t,
    });

    if (cartItems.length === 0) throw new Error("Cart is empty");

    // Create order
    const order = await Order.create(
      {
        customer_id,
        partner_id: cart.partner_id,
        total_amount: cart.total,
        status: "placed",
        payment_method,
        address,
      },
      { transaction: t }
    );

    // Create order items from cart items
    const orderItems = cartItems.map((item) => ({
      order_id: order.id,
      menu_item_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }));

    await OrderItem.bulkCreate(orderItems, { transaction: t });

    // Mark cart as converted
    cart.status = "converted";
    await cart.save({ transaction: t });

    await t.commit();
    return { order, items: orderItems };
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

/**
 * Get customer orders
 */
const GetCustomerOrders = async (customer_id) => {
  try {
    const orders = await Order.findAll({
      where: { customer_id },
      order: [["created_at", "DESC"]],
    });
    return orders;
  } catch (error) {
    throw error;
  }
};

/**
 * Get order by ID
 */
const GetOrderById = async (order_id, customer_id) => {
  try {
    const order = await Order.findOne({
      where: { id: order_id, customer_id },
    });

    if (!order) throw new Error("Order not found");

    const items = await OrderItem.findAll({
      where: { order_id },
    });

    return { ...order.toJSON(), items };
  } catch (error) {
    throw error;
  }
};

module.exports = { PlaceOrder, GetCustomerOrders, GetOrderById };
