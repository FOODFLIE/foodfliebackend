const express = require("express");
const router = express.Router();
const { AddCategoryController, GetAllCategoriesController, GetCategoryByIdController, UpdateCategoryController, DeleteCategoryController } = require("../controllers/categoryController");

router.post("/add", AddCategoryController);
router.post("/", GetAllCategoriesController);
router.get("/:id", GetCategoryByIdController);
router.put("/:id", UpdateCategoryController);
router.delete("/:id", DeleteCategoryController);

module.exports = router;