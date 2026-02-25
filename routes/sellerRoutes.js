const express = require("express");
const router = express.Router();
const { SendOTPController, VerifyOTPController, RegisterSellerController } = require("../controllers/seller/sellerController");

router.post("/send-otp", SendOTPController);
router.post("/verify-otp", VerifyOTPController);
router.post("/register", RegisterSellerController);

module.exports = router;
