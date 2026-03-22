const { getOrders, getDailyCustomers } = require("../../services/admin/orderAnalyticServices");

const { Op } = require("sequelize");

const getOrdersController = async (req, res) => {
  try {
    const orders = await getOrders();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getDailyCustomersController = async (req, res) => {
  try {
    const count = await getDailyCustomers();
    res.status(200).json({
      success: true,
      message: "Daily customer registrations fetched successfully",
      data: {
        date: new Date().toISOString().split('T')[0],
        registrations: count
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
  getOrdersController,
  getDailyCustomersController
};