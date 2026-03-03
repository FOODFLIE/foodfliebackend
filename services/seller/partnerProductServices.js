const Product = require("../../models/product");

const AddProduct = async (
  name,
  description,
  price,
  category_id,
  partner_id,
) => {
  try {
    const product = await Product.create({
      name,
      description,
      price,
      category_id,
      partner_id,
    });
    return product;
  } catch (error) {
    throw error;
  }
};

const GetAllProducts = async (partner_id) => {
  try {
    const products = await Product.findAll({ where: { partner_id } });
    return products;
  } catch (error) {
    throw error;
  }
};

const GetProductById = async (id, partner_id) => {
  try {
    const product = await Product.findOne({ where: { id, partner_id } });
    return product;
  } catch (error) {
    throw error;
  }
};

const UpdateProduct = async (id, partner_id, data) => {
  try {
    await Product.update(data, { where: { id, partner_id } });
    return await Product.findOne({ where: { id, partner_id } });
  } catch (error) {
    throw error;
  }
};

const DeleteProduct = async (id, partner_id) => {
  try {
    await Product.destroy({ where: { id, partner_id } });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  AddProduct,
  GetAllProducts,
  GetProductById,
  UpdateProduct,
  DeleteProduct,
};
