const {
  AddCategory,
  GetAllCategories,
  GetCategoryById,
  UpdateCategory,
  DeleteCategory,
} = require("../services/categoryServices");

const AddCategoryController = async (req, res) => {
  try {
    const { name, partner_id } = req.body;
    const category = await AddCategory(name, partner_id);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const GetAllCategoriesController = async (req, res) => {
  const { userLat, userLng } = req.body;
  try {
    const categories = await GetAllCategories(userLat, userLng);

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const GetCategoryByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const { userLat, userLng } = req.body;
    const category = await GetCategoryById(id, userLat, userLng);
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const UpdateCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const { partner_id, name } = req.body;
    const category = await UpdateCategory(id, partner_id, name);
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const DeleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const { partner_id } = req.body;
    await DeleteCategory(id, partner_id);
    res.status(200).json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  AddCategoryController,
  GetAllCategoriesController,
  GetCategoryByIdController,
  UpdateCategoryController,
  DeleteCategoryController,
};
