const {
  AddProduct,
  GetAllProducts,
  GetProductById,
  UpdateProduct,
  DeleteProduct,
} = require("../services/seller/partnerProductServices");

const AddProductController = async (req, res) => {
  try {
    const { name, description, price, category_id, partner_id } = req.body;
    const product = await AddProduct(
      name,
      description,
      price,
      category_id,
      partner_id,
    );
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
    res.status(500).json({ message: error.message });
  }
};

const UpdateProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const { partner_id, ...data } = req.body;
    const product = await UpdateProduct(id, partner_id, data);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const DeleteProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const { partner_id } = req.body;
    await DeleteProduct(id, partner_id);
    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  AddProductController,
  GetAllProductsController,
  GetProductByIdController,
  UpdateProductController,
  DeleteProductController,
};
