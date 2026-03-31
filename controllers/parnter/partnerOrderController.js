const {
  getPartnerOrders,
  getPickedOrders,
} = require("../../services/partner/partnerOrderService");

const getordersController = async (req, res) => {
  const partner_id = req.seller.id;

  try {
    const getOrders = await getPartnerOrders({ partner_id });
    res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      data: getOrders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving orders",
      data: null,
    });
  }
};

const getPickedOrdersController = async (req, res) => {
  const partner_id = req.seller.id;
  try {
    const response = await getPickedOrders({ partner_id });
    res.status(200).json({
      success: true,
      message: "Picked orders retrieved successfully",
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving picked orders",
      data: null,
    });
  }
};
module.exports = {
  getordersController,
  getPickedOrdersController,
};
