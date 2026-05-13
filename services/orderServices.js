const Order = require("../models/order");
const OrderItem = require("../models/order_item");
const Cart = require("../models/cart");
const CartItem = require("../models/cartItems");
const Partner = require("../models/partner");
const sequelize = require("../config/sequelize");
const Address = require("../models/address");
const { getFoodflieoptions } = require("../utils/foodlieutils");
const { autoAssignOrder } = require("./rider/riderOrderServices");
const { sendOrderConfirmation } = require("../utils/twilioService");
const axios = require("axios");

const flies = getFoodflieoptions();

const return_url = flies.return_url;
//  Place order from cart

const PlaceOrder = async (
  customer_id,
  addressData,
  payment_method = "COD",
  cooking_instructions = null,
) => {
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

    if (cartItems.length === 0) {
      throw new Error("Cart is empty");
    }

    // Create order
    const order = await Order.create(
      {
        customer_id,
        partner_id: cart.partner_id,
        total_amount: cart.subtotal,
        delivery_fee: cart.delivery_fee,
        final_amount: cart.total,
        status: "placed",
        payment_method,
        payment_status: "pending",
        address:
          addressData.fullAddress ||
          addressData.coords?.address,
        customer_phone: addressData.customer_phone,
        latitude: addressData.latitude,
        longitude: addressData.longitude,
        delivery_instructions: cooking_instructions,
      },
      { transaction: t },
    );

    // Create order items
    const orderItems = cartItems.map((item) => ({
      order_id: order.id,
      menu_item_id: item.product_id,
      item_name: item.product_name,
      quantity: item.quantity,
      price: item.price,
      total_price: item.total_price,
    }));

    await OrderItem.bulkCreate(orderItems, {
      transaction: t,
    });

    // Delete cart items
    await CartItem.destroy({
      where: { cart_id: cart.id },
      transaction: t,
    });

    // Delete cart
    await cart.destroy({
      transaction: t,
    });

    // Fetch partner/store details
    const partner = await Partner.findByPk(
      cart.partner_id,
      {
        attributes: ["id", "store_name", "phone"],
        transaction: t,
      }
    );

    // Commit transaction early
    await t.commit();

    // Send n8n webhook (non-blocking)
    axios
      .post(
        "https://n8n-service-ml5w.onrender.com/webhook-test/webhook/order",
        {
          orderId: order.id,
          itemName: orderItems
            .map((item) => item.item_name)
            .join(", "),
          quantity: orderItems.reduce(
            (sum, item) => sum + item.quantity,
            0
          ),
          storeName:
            partner?.store_name || "Unknown Store",
          storePhone: partner?.phone || "N/A",
          amount: order.final_amount,
          customer: customer_id,
          phone: addressData.customer_phone,
          address: order.address,
        }
      )
      .catch((err) => {
        console.error(
          "n8n webhook failed:",
          err.message
        );
      });

    // WhatsApp notification (non-blocking)
    if (addressData.receiverNumber) {
      sendOrderConfirmation(
        addressData.receiverNumber,
        order.id
      ).catch((err) => {
        console.error(
          "WhatsApp notification failed:",
          err.message
        );
      });
    }

    // Rider assignment (non-blocking)
    autoAssignOrder(order.id).catch((err) => {
      console.error(
        "Rider assignment failed:",
        err.message
      );
    });

    return {
      success: true,
      order_id: order.id,
      message: "Order placed successfully",
      redirect_url: return_url + `/${order.id}`,
    };
  } catch (error) {
    console.error(
      "PlaceOrder - Error:",
      error.message
    );

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
