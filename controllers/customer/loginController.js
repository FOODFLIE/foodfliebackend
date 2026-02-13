const { SendOTPForRegister, VerifyOTPAndRegister, SendOTPForLogin, VerifyOTPAndLogin } = require("../../services/customer/customerLoginServices");

const SendOTPForRegisterController = async (req, res) => {
  try {
    const { phone, name, email } = req.body;
    const result = await SendOTPForRegister(phone, name, email);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const VerifyOTPRegisterController = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const result = await VerifyOTPAndRegister(phone, otp);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const SendOTPForLoginController = async (req, res) => {
  try {
    const { phone } = req.body;
    const result = await SendOTPForLogin(phone);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const VerifyOTPLoginController = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const result = await VerifyOTPAndLogin(phone, otp);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

module.exports = { SendOTPForRegisterController, VerifyOTPRegisterController, SendOTPForLoginController, VerifyOTPLoginController };