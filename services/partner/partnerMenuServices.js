const Product = require("../../models/product");

const AddProduct = async (partner_id, productData) => {
  try {
    const product = await Product.create({
      partner_id,
      name: productData.name,
      description: productData.description,
      price: productData.price,
      category_id: productData.category_id,
      image: productData.image,
      is_veg: productData.is_veg,
      preparation_time: productData.preparation_time,
      is_available: productData.is_available !== undefined ? productData.is_available : true,
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
    if (!product) {
      throw new Error("Product not found or you don't have permission to access it");
    }
    return product;
  } catch (error) {
    throw error;
  }
};

const UpdateProduct = async (id, partner_id, productData) => {
  try {
    const product = await Product.findOne({ where: { id, partner_id } });
    
    if (!product) {
      throw new Error("Product not found or you don't have permission to update it");
    }
    
    await product.update({
      name: productData.name,
      description: productData.description,
      price: productData.price,
      category_id: productData.category_id,
      image: productData.image,
      is_veg: productData.is_veg,
      preparation_time: productData.preparation_time,
      is_available: productData.is_available,
    });
    
    return product;
  } catch (error) {
    throw error;
  }
};

const DeleteProduct = async (id, partner_id) => {
  try {
    const product = await Product.findOne({ where: { id, partner_id } });
    
    if (!product) {
      throw new Error("Product not found or you don't have permission to delete it");
    }
    
    await product.destroy();
    return { message: "Product deleted successfully" };
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
