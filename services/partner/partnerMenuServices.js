const Product = require("../../models/product");
const Category = require("../../models/category");
const Partner = require("../../models/partner");
const { Op } = require("sequelize");

// Import models to ensure associations are loaded
require("../../models");

// Generate SKU function
const generateSKU = (partnerId, productName) => {
  const timestamp = Date.now().toString().slice(-6);
  const namePrefix = productName.replace(/[^a-zA-Z0-9]/g, '').substring(0, 3).toUpperCase();
  return `${partnerId}-${namePrefix}-${timestamp}`;
};

const AddProduct = async (partner_id, productData) => {
  try {
    const sku = generateSKU(partner_id, productData.name);
    
    const product = await Product.create({
      partner_id,
      name: productData.name,
      description: productData.description,
      price: productData.price,
      category_id: productData.category_id,
      image: productData.image,
      sku: sku,
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

// Get all categories
const GetAllCategories = async () => {
  try {
    const categories = await Category.findAll({
      where: { is_active: true },
      order: [["name", "ASC"]],
      attributes: ["id", "name", "image"]
    });
    return categories;
  } catch (error) {
    throw new Error("Error fetching categories: " + error.message);
  }
};

// Get products by category for specific seller
const GetSellerCategoryProducts = async (sellerId, categoryId, filters = {}) => {
  try {
    // Validate seller exists
    const seller = await Partner.findByPk(sellerId);
    if (!seller) {
      throw new Error("Seller not found");
    }

    // Validate category exists
    const category = await Category.findByPk(categoryId);
    if (!category) {
      throw new Error("Category not found");
    }

    const whereClause = {
      partner_id: sellerId,
      category_id: categoryId
    };

    // Apply filters
    if (filters.is_available !== undefined) {
      whereClause.is_available = filters.is_available === 'true';
    }

    if (filters.is_veg !== undefined) {
      whereClause.is_veg = filters.is_veg === 'true';
    }

    if (filters.search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${filters.search}%` } },
        { description: { [Op.iLike]: `%${filters.search}%` } }
      ];
    }

    if (filters.min_price) {
      whereClause.price = { [Op.gte]: parseFloat(filters.min_price) };
    }

    if (filters.max_price) {
      if (whereClause.price) {
        whereClause.price = {
          ...whereClause.price,
          [Op.lte]: parseFloat(filters.max_price)
        };
      } else {
        whereClause.price = { [Op.lte]: parseFloat(filters.max_price) };
      }
    }

    const products = await Product.findAll({
      where: whereClause,
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"]
        }
      ],
      order: [["name", "ASC"]],
      attributes: [
        "id", "name", "description", "price", "image", 
        "is_veg", "preparation_time", "is_available"
      ]
    });

    return {
      seller: {
        id: seller.id,
        name: seller.name,
        address: seller.address
      },
      category: {
        id: category.id,
        name: category.name,
        description: category.description
      },
      products: products,
      total_products: products.length
    };
  } catch (error) {
    throw new Error("Error fetching seller category products: " + error.message);
  }
};

module.exports = {
  AddProduct,
  GetAllProducts,
  GetProductById,
  UpdateProduct,
  DeleteProduct,
  GetAllCategories,
  GetSellerCategoryProducts,
};
