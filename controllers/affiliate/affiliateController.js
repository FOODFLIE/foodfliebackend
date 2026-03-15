const {
  AddAffiliate,
  GetAllAffiliates,
  GetAffiliateById,
  UpdateAffiliate,
  DeleteAffiliate,
} = require("../../services/affiliate/affiliateServices");

const AddAffiliateController = async (req, res) => {
  try {
    const affiliateData = req.body;
    const affiliate = await AddAffiliate(affiliateData);
    res.status(201).json(affiliate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const GetAllAffiliatesController = async (req, res) => {
  try {
    const affiliates = await GetAllAffiliates();
    res.status(200).json(affiliates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const GetAffiliateByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const affiliate = await GetAffiliateById(id);
    res.status(200).json(affiliate);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const UpdateAffiliateController = async (req, res) => {
  try {
    const { id } = req.params;
    const affiliateData = req.body;
    const affiliate = await UpdateAffiliate(id, affiliateData);
    res.status(200).json(affiliate);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const DeleteAffiliateController = async (req, res) => {
  try {
    const { id } = req.params;
    await DeleteAffiliate(id);
    res.status(200).json({ message: "Affiliate deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  AddAffiliateController,
  GetAllAffiliatesController,
  GetAffiliateByIdController,
  UpdateAffiliateController,
  DeleteAffiliateController,
};