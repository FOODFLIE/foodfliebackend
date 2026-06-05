const { PlaceOrder, GetCustomerOrders, GetOrderById, verifyAndLinkPayment } = require("../services/orderServices");

const PlaceOrderController = async (req, res) => {
  try {
    const { address, payment_method, cooking_instructions } = req.body;
    const customer_id = req.customer.id;
    const result = await PlaceOrder(customer_id, address, payment_method, cooking_instructions);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Handles incoming UTR validation checking
const SubmitPaymentController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { utr } = req.body;
    const customer_id = req.customer.id;
    console.log("cus",customer_id)

    // Reject formats that aren't exactly a 4-digit number string
    if (!utr || utr.trim().length !== 4 || !/^\d+$/.test(utr)) {
      return res.status(400).json({ message: "Invalid payment token. Please supply exactly 4 digits." });
    }

    const result = await verifyAndLinkPayment({
      orderId,
      customer_id,
      utr: utr.trim()
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message });
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

module.exports = { PlaceOrderController,SubmitPaymentController,  GetCustomerOrdersController, GetOrderByIdController };
