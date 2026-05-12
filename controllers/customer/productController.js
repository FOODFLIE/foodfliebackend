const {
  GetPartnersByCategory,
  GetProductsByPartner,
  GetProductBySKU,
  GetAllStores,
} = require("../../services/customer/productServices");

const GetPartnersByCategoryController = async (req, res) => {
  try {
    const category_id = req.params.category_id || req.query.category_id;
    const { userLat, userLng } = req.body;
    
    if (!category_id) {
      return res.status(400).json({ message: "category_id is required" });
    }
    
    const products = await GetPartnersByCategory(category_id, parseFloat(userLat), parseFloat(userLng));
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

const GetAllStoresController = async (req, res) => {
  try {
    const { userLat, userLng } = req.body;
    const stores = await GetAllStores(parseFloat(userLat), parseFloat(userLng));
    res.status(200).json(stores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  GetPartnersByCategoryController,
  GetProductsByPartnerController,
  GetProductBySKUController,
  GetAllStoresController,
};
