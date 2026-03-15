const Partner = require("../../models/partner");
const PartnerDocument = require("../../models/partnerDocuments");
const sequelize = require("../../config/sequelize");
const jwt = require("jsonwebtoken");

const otpStore = new Map();

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const SendOTPForSeller = async (phone) => {
  try {
    const otp = generateOTP();
    otpStore.set(phone, { otp, expires: Date.now() + 300000 });
    console.log(`OTP for ${phone}: ${otp}`);
    return { message: "OTP sent successfully" };
  } catch (error) {
    throw error;
  }
};

const VerifyOTPForSeller = async (phone, otp) => {
  try {
    const stored = otpStore.get(phone);
    if (!stored || stored.otp !== otp || stored.expires < Date.now()) {
      throw new Error("Invalid or expired OTP");
    }

    otpStore.delete(phone);

    const seller = await Partner.findOne({ where: { phone } });
    
    if (!seller) {
      return { isNewUser: true };
    }

    const token = jwt.sign(
      { id: seller.id, phone: seller.phone, role: "seller" },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    return { token, seller, isNewUser: false };
  } catch (error) {
    throw error;
  }
};

const RegisterSeller = async (data) => {
  console.log("RegisterSeller data:", data);
  const t = await sequelize.transaction();

  try {
    if (!data || !data.phone) {
      throw new Error("Phone number is required");
    }

    const existing = await Partner.findOne({ where: { phone: data.phone } });
    if (existing) throw new Error("Seller already exists");

    const seller = await Partner.create(
      {
        phone: data.phone,
        name: data.name,
        email: data.email,
        store_name: data.store_name,
        outlet_type: data.outlet_type,
        address: data.address,
        area: data.area,
        opening_time: data.opening_time,
        closing_time: data.closing_time,
        working_days: data.working_days,
        approved: false,
        is_active: false,
      },
      { transaction: t }
    );

    await PartnerDocument.create(
      {
        partner_id: seller.id,
        pan_number: data.pan_number,
        gst_number: data.gst_number,
        fssai_number: data.fssai_number,
        bank_account_holder_name: data.bank_account_holder_name,
        bank_account_number: data.bank_account_number,
        bank_ifsc: data.bank_ifsc,
      },
      { transaction: t }
    );

    await t.commit();

    const sellerToken = jwt.sign(
      { id: seller.id, role: "seller" },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    return { sellerToken, seller };
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

module.exports = { SendOTPForSeller, VerifyOTPForSeller, RegisterSeller };
