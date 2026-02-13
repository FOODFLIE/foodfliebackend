const express =  require("express");
const { SendOTPForRegisterController, VerifyOTPRegisterController, SendOTPForLoginController, VerifyOTPLoginController } = require("../../controllers/customer/loginController");
const router = express.Router();

router.post("/register/send-otp", SendOTPForRegisterController);
router.post("/register/verify-otp", VerifyOTPRegisterController);
router.post("/login/send-otp", SendOTPForLoginController);
router.post("/login/verify-otp", VerifyOTPLoginController);

module.exports = router;