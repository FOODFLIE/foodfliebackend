const { createCoupon, getAllCoupons } = require("../../services/admin/adminCouponServices");

const createCouponController = async(req, res) => {
    const couponData = req.body;
    try {
        const coupon = await createCoupon(couponData);
        res.status(201).json({ message: "Coupon created successfully", coupon });

    }catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const getAllCouponsController = async (req, res) => {
    try {
        const coupons = await getAllCoupons();
        res.status(200).json({ message: "Coupons fetched successfully", coupons });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createCouponController,
    getAllCouponsController
}