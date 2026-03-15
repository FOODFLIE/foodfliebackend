const express = require("express");
const router = express.Router();
const { SendOTPController, VerifyOTPController, RegisterSellerController } = require("../controllers/parnter/partnerController");

router.post("/send-otp", SendOTPController);
router.post("/verify-otp", VerifyOTPController);
router.post("/register", RegisterSellerController);

module.exports = router;
