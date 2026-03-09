const { getRiderOrders, updateOrderStatus } = require("../../services/rider/riderOrderServices");

const GetRiderOrdersController = async (req, res) => {
  try {
    const rider_id = req.rider.id;
    const orders = await getRiderOrders(rider_id);
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const UpdateOrderStatusController = async (req, res) => {
  try {
    const rider_id = req.rider.id;
    const { order_id, status } = req.body;
    const result = await updateOrderStatus(order_id, rider_id, status);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { GetRiderOrdersController, UpdateOrderStatusController };
