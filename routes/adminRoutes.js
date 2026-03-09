const express = require("express");
const router = express.Router();
const {
  AdminLoginController,
} = require("../controllers/admin/adminController");
const { getOrdersController } = require("../controllers/admin/orderAnalyticController");
const { AddRiderController, GetRidersController } = require("../controllers/admin/adminRiderController");
const { adminAuth } = require("../middleware/adminAuth");

router.post("/login", AdminLoginController);
router.get("/orders", adminAuth,getOrdersController);
router.post("/riders/add", adminAuth,AddRiderController);
router.get("/riders", adminAuth,GetRidersController);

module.exports = router;
