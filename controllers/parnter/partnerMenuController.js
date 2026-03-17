const {
  AddProduct,
  GetAllProducts,
  GetProductById,
  UpdateProduct,
  DeleteProduct,
  GetAllCategories,
  GetSellerCategoryProducts,
} = require("../../services/partner/partnerMenuServices");

const AddProductController = async (req, res) => {
  try {
    const { partner_id, ...productData } = req.body;
    const product = await AddProduct(partner_id, productData);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const GetAllProductsController = async (req, res) => {
  try {
    const { partner_id } = req.query;
    const products = await GetAllProducts(partner_id);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const GetProductByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const { partner_id } = req.query;
    const product = await GetProductById(id, partner_id);
    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const UpdateProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const { partner_id, ...productData } = req.body;
    const product = await UpdateProduct(id, partner_id, productData);
    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const DeleteProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const { partner_id } = req.body;
    await DeleteProduct(id, partner_id);
    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Get all categories
const GetAllCategoriesController = async (req, res) => {
  try {
    const categories = await GetAllCategories();
    res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: categories,
      count: categories.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get products by category for specific seller
const GetSellerCategoryProductsController = async (req, res) => {
  try {
    const sellerId = req.params.sellerId;
    const { categoryId } = req.params;
    const { is_available, is_veg, search, min_price, max_price } = req.query;

    const filters = {
      is_available,
      is_veg,
      search,
      min_price,
      max_price,
    };

    const result = await GetSellerCategoryProducts(
      sellerId,
      categoryId,
      filters,
    );

    res.status(200).json({
      success: true,
      message: "Seller category products fetched successfully",
      data: result,
    });
  } catch (error) {
    if (error.message.includes("not found")) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  AddProductController,
  GetAllProductsController,
  GetProductByIdController,
  UpdateProductController,
  DeleteProductController,
  GetAllCategoriesController,
  GetSellerCategoryProductsController,
};
