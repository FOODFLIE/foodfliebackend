const { PlaceOrder, GetCustomerOrders, GetOrderById } = require("../services/orderServices");

const PlaceOrderController = async (req, res) => {
  try {
    const { address, payment_method } = req.body;
    const customer_id = req.customer.id;
    const result = await PlaceOrder(customer_id, address, payment_method);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const GetCustomerOrdersController = async (req, res) => {
  try {
    const customer_id = req.customer.id;
    const orders = await GetCustomerOrders(customer_id);
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const GetOrderByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const customer_id = req.customer.id;
    const order = await GetOrderById(id, customer_id);
    res.status(200).json(order);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = { PlaceOrderController, GetCustomerOrdersController, GetOrderByIdController };
