const express = require("express");
const router = express.Router();
const { SendOTPController, VerifyOTPController, RegisterSellerController, LoginSellerController } = require("../controllers/parnter/partnerController");

router.post("/send-otp", SendOTPController);
router.post("/verify-otp", VerifyOTPController);
router.post("/register", RegisterSellerController);
router.post("/login", LoginSellerController);

module.exports = router;
