const { Op } = require("sequelize");
const Order = require("../../models/order");
const OrderItem = require("../../models/order_item");

const getPartnerOrders = async ({ partner_id, status }) => {
  try {
    const order = await Order.findAll({
      where: {
        partner_id,
        status: {
          [Op.in]:["placed","assigned","picked_up","delivered"],
        },
      },
      include: [
        {
          model: OrderItem,
          as: "items",
        },
      ],
      order: [["created_at", "DESC"]],
    
    });
    
    return order;
  } catch (error) {
    console.error("GetPartnerOrders - Error:", error.message);
    throw error;
  }
};
const getPickedOrders = async ({ partner_id }) => {
  try {
    const orders = await Order.findAll({
      where: {
        partner_id,
        status: {
          [Op.in]: ["picked","delivered"],
        }
       
      },
      include: [
        {
          model: OrderItem,
          as: "items",
        },
      ],
      order: [["created_at", "DESC"]],
    });
    return orders;

  }catch (error) {
    console.error("GetPickedOrders - Error:", error.message);
    throw error;
  }
}

module.exports = {getPartnerOrders, getPickedOrders}; 