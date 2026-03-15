const express = require("express");
const {
  AddProductController,
  GetAllProductsController,
  GetProductByIdController,
  UpdateProductController,
  DeleteProductController,
} = require("../../controllers/parnter/partnerMenuController");

const router = express.Router();

router.post("/add", AddProductController);
router.get("/", GetAllProductsController);
router.get("/:id", GetProductByIdController);
router.put("/:id", UpdateProductController);
router.delete("/:id", DeleteProductController);

module.exports = router;
