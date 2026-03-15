const { SendOTPForSeller, VerifyOTPForSeller, RegisterSeller } = require("../../services/partner/partnerLoginServices");

const SendOTPController = async (req, res) => {
  try {
    const { phone } = req.body;
    const result = await SendOTPForSeller(phone);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const VerifyOTPController = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const result = await VerifyOTPForSeller(phone, otp);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

const RegisterSellerController = async (req, res) => {
  const data = req.body;
  try {
    const result = await RegisterSeller(data);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { SendOTPController, VerifyOTPController, RegisterSellerController };
