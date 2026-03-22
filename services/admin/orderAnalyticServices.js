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
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const customers = await Customer.findAll({
      where: {
        created_at: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
    });
    return customers.length;
  } catch (error) {
    console.error("Error fetching daily customers:", error);
    throw error;
  }
};

module.exports = { getOrders,getDailyCustomers };
