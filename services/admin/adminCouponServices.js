const Coupon = require("../../models/coupon");

const createCoupon = async (couponData) => {
  const { code, discount, min_order, usage_limit, user_limit, is_active } =
    couponData;
  try {
    // Check if a coupon with the same code already exists
    const existing = await Coupon.findOne({ where: { code } });
    if (existing) {
      throw new error("Coupon already exists");
    }

    const coupon = await Coupon.create({
      code,
      discount,
      min_order,
      usage_limit,
      user_limit,
      is_active,
    });
    return coupon;
  } catch (error) {
    throw error;
  }
};
const getAllCoupons = async () => {
  try {
    const coupons = await Coupon.findAll();
    return coupons;
  } catch (error) {
    console.error("Error fetching coupons:", error);
  }
};

module.exports = {
  createCoupon,
  getAllCoupons,
};
