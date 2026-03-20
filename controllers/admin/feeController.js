const {
  AddFee,
  GetAllFees,
  GetFeeById,
  UpdateFee,
  DeleteFee,
  CalculateDeliveryFee
} = require("../../services/admin/feeServices");

const AddFeeController = async (req, res) => {
  try {
    const feeData = req.body;
    const fee = await AddFee(feeData);
    res.status(201).json({
      success: true,
      message: "Fee created successfully",
      data: fee
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const GetAllFeesController = async (req, res) => {
  try {
    const { is_active, fee_type, search } = req.query;
    const filters = {};
    
    if (is_active !== undefined) {
      filters.is_active = is_active === 'true';
    }
    
    if (fee_type) filters.fee_type = fee_type;
    if (search) filters.search = search;
    
    const fees = await GetAllFees(filters);
    res.status(200).json({
      success: true,
      message: "Fees fetched successfully",
      data: fees,
      count: fees.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const GetFeeByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const fee = await GetFeeById(id);
    res.status(200).json({
      success: true,
      message: "Fee fetched successfully",
      data: fee
    });
  } catch (error) {
    if (error.message === "Fee not found") {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const UpdateFeeController = async (req, res) => {
  try {
    const { id } = req.params;
    const feeData = req.body;
    
    if (Object.keys(feeData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No data provided for update"
      });
    }
    
    const fee = await UpdateFee(id, feeData);
    res.status(200).json({
      success: true,
      message: "Fee updated successfully",
      data: fee
    });
  } catch (error) {
    if (error.message === "Fee not found") {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const DeleteFeeController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await DeleteFee(id);
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    if (error.message === "Fee not found") {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const CalculateDeliveryFeeController = async (req, res) => {
  try {
    const { distance_km } = req.body;
    
    if (!distance_km) {
      return res.status(400).json({
        success: false,
        message: "Distance in kilometers is required"
      });
    }
    
    const distance = parseFloat(distance_km);
    if (isNaN(distance) || distance < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid distance value"
      });
    }
    
    const deliveryFee = await CalculateDeliveryFee(distance);
    res.status(200).json({
      success: true,
      message: "Delivery fee calculated successfully",
      data: {
        distance_km: distance,
        ...deliveryFee
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  AddFeeController,
  GetAllFeesController,
  GetFeeByIdController,
  UpdateFeeController,
  DeleteFeeController,
  CalculateDeliveryFeeController
};