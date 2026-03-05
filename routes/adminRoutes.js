const express = require("express");
const router = express.Router();
const {
  AdminLoginController,
} = require("../controllers/admin/adminController");
const { getOrdersController } = require("../controllers/admin/orderAnalyticController");

router.post("/login", AdminLoginController);
router.get("/orders", getOrdersController);

module.exports = router;
