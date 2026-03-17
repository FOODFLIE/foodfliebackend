const Fee = require("../../models/fee");
const { Op } = require("sequelize");

const AddFee = async (feeData) => {
  try {
    const { fee_name, fee_type, value, min_distance_km, max_distance_km, is_active } = feeData;
    
    const fee = await Fee.create({
      fee_name,
      fee_type,
      value: value ? parseFloat(value) : null,
      min_distance_km: min_distance_km ? parseFloat(min_distance_km) : null,
      max_distance_km: max_distance_km ? parseFloat(max_distance_km) : null,
      is_active: is_active !== undefined ? is_active : true
    });
    
    return fee;
  } catch (error) {
    throw new Error("Error adding fee: " + error.message);
  }
};

const GetAllFees = async (filters = {}) => {
  try {
    const whereClause = {};
    
    if (filters.is_active !== undefined) {
      whereClause.is_active = filters.is_active;
    }
    
    if (filters.fee_type) {
      whereClause.fee_type = { [Op.iLike]: `%${filters.fee_type}%` };
    }
    
    if (filters.search) {
      whereClause[Op.or] = [
        { fee_name: { [Op.iLike]: `%${filters.search}%` } },
        { fee_type: { [Op.iLike]: `%${filters.search}%` } }
      ];
    }

    const fees = await Fee.findAll({
      where: whereClause,
      order: [["fee_name", "ASC"]]
    });
    
    return fees;
  } catch (error) {
    throw new Error("Error fetching fees: " + error.message);
  }
};

const GetFeeById = async (id) => {
  try {
    const fee = await Fee.findByPk(id);
    if (!fee) {
      throw new Error("Fee not found");
    }
    return fee;
  } catch (error) {
    throw new Error("Error fetching fee: " + error.message);
  }
};

const UpdateFee = async (id, feeData) => {
  try {
    const fee = await Fee.findByPk(id);
    if (!fee) {
      throw new Error("Fee not found");
    }

    const { fee_name, fee_type, value, min_distance_km, max_distance_km, is_active } = feeData;
    
    const updateData = {};
    if (fee_name !== undefined) updateData.fee_name = fee_name;
    if (fee_type !== undefined) updateData.fee_type = fee_type;
    if (value !== undefined) updateData.value = value ? parseFloat(value) : null;
    if (min_distance_km !== undefined) updateData.min_distance_km = min_distance_km ? parseFloat(min_distance_km) : null;
    if (max_distance_km !== undefined) updateData.max_distance_km = max_distance_km ? parseFloat(max_distance_km) : null;
    if (is_active !== undefined) updateData.is_active = is_active;

    await fee.update(updateData);
    return fee;
  } catch (error) {
    throw new Error("Error updating fee: " + error.message);
  }
};

const DeleteFee = async (id) => {
  try {
    const fee = await Fee.findByPk(id);
    if (!fee) {
      throw new Error("Fee not found");
    }

    await fee.destroy();
    return { message: "Fee deleted successfully" };
  } catch (error) {
    throw new Error("Error deleting fee: " + error.message);
  }
};

// Calculate delivery fee based on distance
const CalculateDeliveryFee = async (distance_km) => {
  try {
    const deliveryFees = await Fee.findAll({
      where: {
        fee_type: 'delivery',
        is_active: true,
        [Op.or]: [
          {
            [Op.and]: [
              { min_distance_km: { [Op.lte]: distance_km } },
              { max_distance_km: { [Op.gte]: distance_km } }
            ]
          },
          {
            [Op.and]: [
              { min_distance_km: { [Op.is]: null } },
              { max_distance_km: { [Op.is]: null } }
            ]
          }
        ]
      },
      order: [["value", "ASC"]]
    });

    if (deliveryFees.length === 0) {
      return { fee: 0, fee_name: "No delivery fee" };
    }

    const applicableFee = deliveryFees[0];
    return {
      fee: parseFloat(applicableFee.value || 0),
      fee_name: applicableFee.fee_name,
      fee_id: applicableFee.id
    };
  } catch (error) {
    throw new Error("Error calculating delivery fee: " + error.message);
  }
};

module.exports = {
  AddFee,
  GetAllFees,
  GetFeeById,
  UpdateFee,
  DeleteFee,
  CalculateDeliveryFee
};