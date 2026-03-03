const {
  GetPartnersByCategory,
  GetProductsByPartner,
  GetProductBySKU,
} = require("../../services/customer/productServices");

const GetPartnersByCategoryController = async (req, res) => {
  try {
    const { category_id } = req.query;
    const products = await GetPartnersByCategory(category_id);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const GetProductsByPartnerController = async (req, res) => {
  try {
    const { partner_id } = req.query;
    const products = await GetProductsByPartner(partner_id);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const GetProductBySKUController = async (req, res) => {
  try {
    const { sku } = req.params;
    const product = await GetProductBySKU(sku);
    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  GetPartnersByCategoryController,
  GetProductsByPartnerController,
  GetProductBySKUController,
};
