const { verifyOrderPayment } = require("../../services/admin/adminPaymentServices");

const verifyOrderPaymentController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await verifyOrderPayment(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

module.exports = {
  verifyOrderPaymentController,
};
