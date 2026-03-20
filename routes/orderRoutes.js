const express = require("express");
const router = express.Router();
const { customerAuth } = require("../middleware/customerAuth");
const { PlaceOrderController, GetCustomerOrdersController, GetOrderByIdController } = require("../controllers/orderController");

router.post("/place", customerAuth, PlaceOrderController);
router.get("/", customerAuth, GetCustomerOrdersController);
router.get("/:id", customerAuth, GetOrderByIdController);

module.exports = router;
