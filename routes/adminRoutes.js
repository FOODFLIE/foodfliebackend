const express = require("express");
const router = express.Router();
const {
  AdminLoginController,
} = require("../controllers/admin/adminController");
const { getOrdersController } = require("../controllers/admin/orderAnalyticController");
const { AddRiderController, GetRidersController } = require("../controllers/admin/adminRiderController");
const { adminAuth } = require("../middleware/adminAuth");
const { AddAffiliateController, GetAllAffiliatesController, GetAffiliateByIdController, UpdateAffiliateController, DeleteAffiliateController } = require("../controllers/affiliate/affiliateController");

router.post("/login", AdminLoginController);
router.get("/orders", adminAuth,getOrdersController);
router.post("/riders/add", adminAuth,AddRiderController);
router.get("/riders", adminAuth,GetRidersController);
router.post("/affiliates/add",adminAuth, AddAffiliateController);
router.get("/affiliates",adminAuth, GetAllAffiliatesController);
router.get("/affiliates/:id",adminAuth, GetAffiliateByIdController);
router.put("/affiliates/:id",adminAuth, UpdateAffiliateController);
router.delete("/affiliates/:id",adminAuth, DeleteAffiliateController);

module.exports = router;
