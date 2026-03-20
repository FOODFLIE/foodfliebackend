const { Product, Partner } = require("../../models/index");
const { Op } = require("sequelize");

const SearchProducts = async (query) => {
  try {
    const products = await Product.findAll({
      where: {
        name: { [Op.iLike]: `%${query}%` },
        is_available: true,
      },
      attributes: ["id", "name", "image", "price", "sku", "category_id", "partner_id"],
      include: [
        {
          model: Partner,
          as: "partner",
          attributes: ["id", "store_name", "address", "area", "image"],
        },
      ],
      limit: 20,
    });
    return products;
  } catch (error) {
    throw error;
  }
};

const SearchPartners = async (query) => {
  try {
    const partners = await Partner.findAll({
      where: {
        store_name: { [Op.iLike]: `%${query}%` },
      },
      attributes: ["id", "store_name", "address", "area", "image"],
      limit: 20,
    });
    return partners;
  } catch (error) {
    throw error;
  }
};

const GlobalSearch = async (query) => {
  try {
    const [products, partners] = await Promise.all([
      SearchProducts(query),
      SearchPartners(query),
    ]);
    
    return {
      products,
      partners,
    };
  } catch (error) {
    throw error;
  }
};

module.exports = { SearchProducts, SearchPartners, GlobalSearch };
