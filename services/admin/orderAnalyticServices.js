const Order = require("../../models/order");
const { Customer, Partner } = require("../../models/index");

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

module.exports = { getOrders };