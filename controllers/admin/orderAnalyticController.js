const { getOrders } = require("../../services/admin/orderAnalyticServices");

const getOrdersController = async (req, res) => {
  try {
    const orders = await getOrders();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getOrdersController };
