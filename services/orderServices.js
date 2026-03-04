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
    console.log("PlaceOrder - Input:", { customer_id, address, payment_method });
    
    // Get active cart
    const cart = await Cart.findOne({
      where: { customer_id, status: "active" },
      transaction: t,
    });
    console.log("PlaceOrder - Cart found:", cart ? { id: cart.id, partner_id: cart.partner_id, total: cart.total } : null);

    if (!cart) throw new Error("Cart is empty");

    // Get cart items
    const cartItems = await CartItem.findAll({
      where: { cart_id: cart.id },
      transaction: t,
    });
    console.log("PlaceOrder - Cart items count:", cartItems.length);

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
    console.log("PlaceOrder - Order created:", { order_id: order.id, total_amount: order.total_amount });

    // Create order items from cart items
    const orderItems = cartItems.map((item) => ({
      order_id: order.id,
      menu_item_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }));

    await OrderItem.bulkCreate(orderItems, { transaction: t });
    console.log("PlaceOrder - Order items created:", orderItems.length);

    // Delete cart items
    await CartItem.destroy({ where: { cart_id: cart.id }, transaction: t });
    console.log("PlaceOrder - Cart items deleted");

    // Delete cart
    await cart.destroy({ transaction: t });
    console.log("PlaceOrder - Cart deleted");

    await t.commit();
    console.log("PlaceOrder - Transaction committed successfully");
    return { order, items: orderItems };
  } catch (error) {
    console.error("PlaceOrder - Error:", error.message);
    console.error("PlaceOrder - Error details:", error);
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
