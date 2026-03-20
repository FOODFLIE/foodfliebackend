const express = require("express");
const router = express.Router();
const {
  AdminLoginController,
} = require("../controllers/admin/adminController");
const { getOrdersController } = require("../controllers/admin/orderAnalyticController");
const { AddRiderController, GetRidersController } = require("../controllers/admin/adminRiderController");
const { adminAuth } = require("../middleware/adminAuth");
const { AddAffiliateController, GetAllAffiliatesController, GetAffiliateByIdController, UpdateAffiliateController, DeleteAffiliateController } = require("../controllers/affiliate/affiliateController");
const {
  AddFeeController,
  GetAllFeesController,
  GetFeeByIdController,
  UpdateFeeController,
  DeleteFeeController,
  CalculateDeliveryFeeController
} = require("../controllers/admin/feeController");

router.post("/login", AdminLoginController);
router.get("/orders", adminAuth,getOrdersController);
router.post("/riders/add", adminAuth,AddRiderController);
router.get("/riders", adminAuth,GetRidersController);
router.post("/affiliates/add",adminAuth, AddAffiliateController);
router.get("/affiliates",adminAuth, GetAllAffiliatesController);
router.get("/affiliates/:id",adminAuth, GetAffiliateByIdController);
router.put("/affiliates/:id",adminAuth, UpdateAffiliateController);
router.delete("/affiliates/:id",adminAuth, DeleteAffiliateController);

// Fee management routes
router.post("/fees/add", adminAuth, AddFeeController);
router.get("/fees", adminAuth, GetAllFeesController);
router.get("/fees/:id", adminAuth, GetFeeByIdController);
router.put("/fees/:id", adminAuth, UpdateFeeController);
router.delete("/fees/:id", adminAuth, DeleteFeeController);
router.post("/fees/calculate-delivery", CalculateDeliveryFeeController);

module.exports = router;
