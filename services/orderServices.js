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
const { getDistance } = require("../utils/deliveryRadius");
const axios = require("axios");

const flies = getFoodflieoptions();

const return_url = flies.return_url;
const delivery_fee = flies.delivery_fee;
const max_delivery_fee = flies.max_delivery_fee;



/**
 * Phase 1 Service Logic: Initiates order shell securely in a holding state
 */
const PlaceOrder = async (
  customer_id,
  addressData,
  payment_method = "UPI",
  cooking_instructions = null,
) => {
  const t = await sequelize.transaction();

  try {
    const cart = await Cart.findOne({
      where: { customer_id, status: "active" },
      transaction: t,
    });

    if (!cart) throw new Error("Cart is empty");

    const partner = await Partner.findByPk(cart.partner_id, {
      attributes: ["id", "store_name", "phone", "latitude", "longitude"],
      transaction: t,
    });

    if (!partner) throw new Error("Partner not found");

    let calculatedDeliveryFee = delivery_fee;
    if (addressData.latitude && addressData.longitude && partner.latitude && partner.longitude) {
      const distance = getDistance(
        addressData.latitude,
        addressData.longitude,
        partner.latitude,
        partner.longitude
      );
      calculatedDeliveryFee = distance > 2 ? max_delivery_fee : delivery_fee;
    }

    const finalAmount = parseFloat(cart.subtotal) + parseFloat(calculatedDeliveryFee);

    const cartItems = await CartItem.findAll({
      where: { cart_id: cart.id },
      transaction: t,
    });

    if (cartItems.length === 0) {
      throw new Error("Cart is empty");
    }

    // Order sits strictly behind a holding state checkpoint
    const order = await Order.create(
      {
        customer_id,
        partner_id: cart.partner_id,
        total_amount: cart.subtotal,
        delivery_fee: calculatedDeliveryFee,
        final_amount: finalAmount,
        status: "payment_pending", // Holding status definition prevents early prep issues
        payment_method: "UPI",
        payment_status: "pending",
        address: addressData.fullAddress || addressData.coords?.address,
        customer_phone: addressData.customer_phone,
        latitude: addressData.latitude,
        longitude: addressData.longitude,
        delivery_instructions: cooking_instructions,
      },
      { transaction: t },
    );

    const orderItems = cartItems.map((item) => ({
      order_id: order.id,
      menu_item_id: item.product_id,
      item_name: item.product_name,
      quantity: item.quantity,
      price: item.price,
      variant: item.variant,
      total_price: item.total_price,
    }));

    await OrderItem.bulkCreate(orderItems, { transaction: t });

    await CartItem.destroy({ where: { cart_id: cart.id }, transaction: t });
    await cart.destroy({ transaction: t });

    await t.commit();

    // No operational webhooks or background worker automation are called here anymore.
    return {
      success: true,
      order_id: order.id,
      message: "Order initiated. Awaiting payment credentials tracking token.",
      redirect_url: return_url + `/${order.id}`,
    };
  } catch (error) {
    console.error("PlaceOrder - Error:", error.message);
    await t.rollback();
    throw error;
  }
};

/**
 * Phase 2 Service Logic: Attaches tracking parameters and triggers downstream operations
 */
const verifyAndLinkPayment = async ({ orderId, customer_id, utr }) => {
  // Pull transaction data with related elements to build outward data structures
  const order = await Order.findOne({
    where: { id: orderId, customer_id },
    include: [
      { model: OrderItem, as: 'items' }, 
      { model: Partner, as: 'partner' }
    ]
  });

  if (!order) {
    const error = new Error('Order record not found or access unauthorized.');
    error.statusCode = 404;
    throw error;
  }

  if (order.status !== 'payment_pending') {
    const error = new Error('This order has already moved out of the payment checkout process.');
    error.statusCode = 400;
    throw error;
  }

  // Update order definitions to update system terminals
  order.payment_status = 'PENDING_VERIFICATION';
  order.status = 'placed'; 
  order.payment_utr = utr;
  order.payment_verified_at = new Date();

  await order.save();

  // ==========================================
  // DISPATCH OPERATIONAL LIFECYCLE (Non-blocking background fires)
  // ==========================================

  // A. Fire n8n live kitchen terminal board monitor updates
  axios.post("https://n8n-service-ml5w.onrender.com/webhook/webhook/order", {
    orderId: order.id,
    items: order.items.map((item) => ({
      item_name: item.item_name,
      variant: item.variant || null,
      quantity: item.quantity,
      total_price: item.total_price,
    })),
    storeName: order.partner?.store_name || "Unknown Store",
    storePhone: order.partner?.phone || "N/A",
    amount: order.final_amount,
    customer: customer_id,
    phone: order.customer_phone,
    address: order.address,
  }).catch(err => console.error("Delayed n8n processing payload failed:", err.message));

  // B. Send Customer WhatsApp Notification Updates
  if (order.customer_phone) {
    sendOrderConfirmation(order.customer_phone, order.id)
      .catch(err => console.error("Delayed WhatsApp confirmation alert failed:", err.message));
  }



  return {
    success: true,
    order_id: order.id,
    status: order.status,
    message: "Payment details matched. Order passed to operations dashboard.",
  };
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

module.exports = { PlaceOrder, GetCustomerOrders, GetOrderById, verifyAndLinkPayment };
