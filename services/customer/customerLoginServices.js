const Customer = require("../../models/customer");
const jwt = require("jsonwebtoken");
const { sendOTP } = require("../../utils/twilioService");

const otpStore = new Map();

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const SendOTPForRegister = async (phone, name, email) => {
  try {
    const existingCustomer = await Customer.findOne({ where: { phone } });
    if (existingCustomer) {
      throw new Error("Customer already exists");
    }

    const otp = generateOTP();
    otpStore.set(phone, { otp, name, email, expires: Date.now() + 300000 });

    await sendOTP(phone, otp);

    return { message: "OTP sent successfully" };
  } catch (error) {
    throw error;
  }
};

const VerifyOTPAndRegister = async (phone, otp) => {
  try {
    const stored = otpStore.get(phone);
    if (!stored || stored.otp !== otp || stored.expires < Date.now()) {
      throw new Error("Invalid or expired OTP");
    }

    const customer = await Customer.create({
      name: stored.name,
      phone,
      email: stored.email,
    });
    otpStore.delete(phone);

    const token = jwt.sign(
      { id: customer.id, phone: customer.phone, role: "customer" },
      process.env.JWT_SECRET,
      { expiresIn: "30d" },
    );
    return { token, customer };
  } catch (error) {
    throw error;
  }
};

const SendOTPForLogin = async (phone) => {
  try {
    const customer = await Customer.findOne({ where: { phone } });
    if (!customer) {
      throw new Error("Customer not found. Please register first.");
    }

    const otp = generateOTP();
    otpStore.set(phone, { otp, expires: Date.now() + 300000 });

    await sendOTP(phone, otp);

    return { message: "OTP sent successfully" };
  } catch (error) {
    throw error;
  }
};

const VerifyOTPAndLogin = async (phone, otp) => {
  try {
    const stored = otpStore.get(phone);
    if (!stored || stored.otp !== otp || stored.expires < Date.now()) {
      throw new Error("Invalid or expired OTP");
    }

    const customer = await Customer.findOne({ where: { phone } });
    otpStore.delete(phone);

    const token = jwt.sign(
      { id: customer.id, phone: customer.phone, role: "customer" },
      process.env.JWT_SECRET,
      { expiresIn: "30d" },
    );
    return { token, customer };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  SendOTPForRegister,
  VerifyOTPAndRegister,
  SendOTPForLogin,
  VerifyOTPAndLogin,
};
