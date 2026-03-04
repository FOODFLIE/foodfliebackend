const express = require("express");
const router = express.Router();
const {
  GetPartnersByCategoryController,
  GetProductsByPartnerController,
  GetProductBySKUController,
  GetAllStoresController,
} = require("../../controllers/customer/productController");

router.post("/stores", GetAllStoresController);
router.get("/by-category", GetPartnersByCategoryController);
router.get("/by-partner", GetProductsByPartnerController);
router.get("/sku/:sku", GetProductBySKUController);

module.exports = router;
