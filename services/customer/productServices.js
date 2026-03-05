const { Product, Partner } = require("../../models/index");
const sequelize = require("../../config/sequelize");

/**
 * Get partners by category
 */
const GetPartnersByCategory = async (category_id) => {
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

/**
 * Get all stores
 */
const GetAllStores = async (userLat, userLng) => {
  try {
    
    const stores = await Partner.findAll({
      attributes: [
        "id",
        "store_name",
        "address",
        "area",
        "image",
        "latitude",
        "longitude",
      ],
      raw: true,
    });
  

    // Haversine formula
    const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
      const R = 6371;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    const filteredStores = stores.filter(store => {
      const distance = calculateDistanceKm(
        userLat,
        userLng,
        store.latitude,
        store.longitude
      );
      return distance <= 1.5;
    });

    return filteredStores;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  GetPartnersByCategory,
  GetProductsByPartner,
  GetProductBySKU,
  GetAllStores,
};
