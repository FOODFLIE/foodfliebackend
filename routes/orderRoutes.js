const express = require("express");
const router = express.Router();
const { customerAuth } = require("../middleware/customerAuth");
const { PlaceOrderController, GetCustomerOrdersController, GetOrderByIdController, SubmitPaymentController } = require("../controllers/orderController");

router.post("/place", customerAuth, PlaceOrderController);
// Phase 2: Transmit 4-digit transaction reference token
router.post("/:orderId/submit-payment", customerAuth, SubmitPaymentController);
router.get("/", customerAuth, GetCustomerOrdersController);
router.get("/:id", customerAuth, GetOrderByIdController);

module.exports = router;
