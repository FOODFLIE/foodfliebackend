const Order = require("../../models/order");
const { Customer, Partner } = require("../../models/index");
const { Op } = require("sequelize");

const getOrders = async () => {
  const orders = await Order.findAll({
    include: [
      {
        model: Customer,
        as: "customer",
        attributes: ["id", "name", "email", "phone"],
      },
      {
        model: Partner,
        as: "partner",
        attributes: ["id", "store_name", "address"],
      },
    ],
    order: [["created_at", "DESC"]],
  });
  return orders;
};
const getDailyCustomers = async () => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

    const count = await Customer.count({
      where: {
        created_at: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
    });
    
    return count;
  } catch (error) {
    console.error("Error fetching daily customers:", error);
    throw error;
  }
};

module.exports = { getOrders,getDailyCustomers };
