const express = require("express");
const {
  AddProductController,
  GetAllProductsController,
  GetProductByIdController,
  UpdateProductController,
  DeleteProductController,
  GetAllCategoriesController,
  GetSellerCategoryProductsController,
} = require("../../controllers/parnter/partnerMenuController");

const router = express.Router();

// Product routes
router.post("/add", AddProductController);
router.get("/", GetAllProductsController);
router.get("/:id", GetProductByIdController);
router.put("/:id", UpdateProductController);
router.delete("/:id", DeleteProductController);

// Category routes
router.get("/categories/all", GetAllCategoriesController);
router.get("/:sellerId/category/:categoryId", GetSellerCategoryProductsController);

module.exports = router;
