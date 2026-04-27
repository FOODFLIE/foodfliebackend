const { Product, Partner } = require("../../models/index");
const sequelize = require("../../config/sequelize");
const { getFoodflieoptions } = require("../../utils/foodlieutils");
const { getDistance } = require("../../utils/deliveryRadius");
const ProductVariant = require("../../models/productVariant");

const flies = getFoodflieoptions();
const allowedRadiusKm = flies.allowed_distance;

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

          attributes: [
            "id",
            "store_name",
            "address",
            "area",
            "image",
            "is_active",
          ],
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
          required: false,
          attributes: [
            "id",
            "name",
            "image",
            "price",
            "has_variants",
            "sku",
            "category_id",
            "rating",
            "description",
            "is_veg",
            "subcategory",
          ],
          include: [
            {
              model: ProductVariant,
              as: "variants",
              attributes: ["id", "name", "price", "is_available"],
              required: false,
              where: { is_available: true },
              separate: true,
              order: [["price", "ASC"]]
            },
          ],
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
    if (!userLat || !userLng) {
      throw new Error("User location required");
    }

    const stores = await Partner.findAll({
      attributes: [
        "id",
        "store_name",
        "address",
        "area",
        "image",
        "latitude",
        "longitude",
        "is_active",
      ],

      raw: true,
    });

    const nearbyStores = stores
      .map((store) => {
        const distance = getDistance(
          userLat,
          userLng,
          parseFloat(store.latitude),
          parseFloat(store.longitude),
        );

        return {
          ...store,
          distance, // ✅ add distance
        };
      })
      .filter((store) => store.distance <= allowedRadiusKm)
      .sort((a, b) => a.distance - b.distance); // ✅ nearest first

    return nearbyStores;
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
