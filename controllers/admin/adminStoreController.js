const { toggleStoreStatusService, getAllStores } = require("../../services/admin/adminStoreServices");


const toggleStoreStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;
    
    if (typeof is_active !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: "is_active must be a boolean value"
      });
    }
    
    const updatedPartner = await toggleStoreStatusService(id, is_active);
    
    res.status(200).json({
      success: true,
      message: `Store ${is_active ? 'activated' : 'deactivated'} successfully`,
      data: updatedPartner
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update store status",
      error: error.message
    });
  }
};

const fetchAllStores = async (req, res) => {
  try {
    const stores = await getAllStores();
    
    res.status(200).json({
      success: true,
      message: "Stores fetched successfully",
      data: stores
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch stores",
      error: error.message
    });
  }
};

module.exports = { toggleStoreStatus, fetchAllStores };
