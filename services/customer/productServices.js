const { Product, Partner } = require("../../models/index");
const sequelize = require("../../config/sequelize");

/**
 * Get partners by category
 */
const GetPartnersByCategory = async (category_id) => {
  console.log("Fetching partners for category_id:", category_id);
  try {
    const products = await Product.findAll({
      where: { category_id, is_available: true },
      include: [
        {
          model: Partner,
          as: "partner",

          attributes: ["id", "store_name", "address", "area","image"],
        },
      ],
      attributes: [],
    });

    // Extract unique partners
    const uniquePartners = [];
    const partnerIds = new Set();

    products.forEach((product) => {
      if (product.partner && !partnerIds.has(product.partner.id)) {
        partnerIds.add(product.partner.id);
        uniquePartners.push(product.partner);
      }
    });

    return uniquePartners;
  } catch (error) {
    throw error;
  }
};

/**
 * Get products by partner
 */
const GetProductsByPartner = async (partner_id) => {
  try {
    const partner = await Partner.findByPk(partner_id, {
      attributes: ["id", "store_name", "address", "area", "image"],
      include: [
        {
          model: Product,
          as: "products",
          where: { is_available: true },
          attributes: ["id", "name", "image", "price", "sku", "category_id"],
          required: false,
        },
      ],
    });
    return partner;
  } catch (error) {
    throw error;
  }
};

/**
 * Get product by SKU
 */
const GetProductBySKU = async (sku) => {
  try {
    const product = await Product.findOne({
      where: { sku, is_available: true },
    });
    return product;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  GetPartnersByCategory,
  GetProductsByPartner,
  GetProductBySKU,
};
