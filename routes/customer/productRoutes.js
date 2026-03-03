const express = require("express");
const router = express.Router();
const {
  GetPartnersByCategoryController,
  GetProductsByPartnerController,
  GetProductBySKUController,
} = require("../../controllers/customer/productController");

router.get("/by-category", GetPartnersByCategoryController);
router.get("/by-partner", GetProductsByPartnerController);
router.get("/sku/:sku", GetProductBySKUController);

module.exports = router;
