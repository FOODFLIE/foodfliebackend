const Order = require("../../models/order");

const verifyOrderPayment = async (orderId) => {
  try {
    const order = await Order.findByPk(orderId);

    if (!order) {
      const error = new Error("Order not found");
      error.statusCode = 404;
      throw error;
    }

    if (order.payment_status !== "PENDING_VERIFICATION") {
      const error = new Error("Order is not in pending verification status");
      error.statusCode = 400;
      throw error;
    }

    order.payment_status = "completed";
    await order.save();

    return {
      success: true,
      message: "Payment successfully verified and completed",
      order,
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  verifyOrderPayment,
};
