const {
  getDailyCustomers,
  getWeeklyCustomers,
  getMonthlyCustomers,
  getTotalCustomers,
  getActiveCustomers,
  getCustomerGrowthStats,
  getCustomerAnalytics,
  getRecentCustomers
} = require("../../services/admin/customerAnalyticsService");

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

const getWeeklyCustomersController = async (req, res) => {
  try {
    const count = await getWeeklyCustomers();
    res.status(200).json({
      success: true,
      message: "Weekly customer registrations fetched successfully",
      data: {
        period: "Last 7 days",
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

const getMonthlyCustomersController = async (req, res) => {
  try {
    const count = await getMonthlyCustomers();
    res.status(200).json({
      success: true,
      message: "Monthly customer registrations fetched successfully",
      data: {
        period: "This month",
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

const getTotalCustomersController = async (req, res) => {
  try {
    const count = await getTotalCustomers();
    res.status(200).json({
      success: true,
      message: "Total customers fetched successfully",
      data: {
        total_customers: count
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getActiveCustomersController = async (req, res) => {
  try {
    const { days } = req.query;
    const count = await getActiveCustomers(parseInt(days) || 30);
    res.status(200).json({
      success: true,
      message: "Active customers fetched successfully",
      data: {
        period: `Last ${days || 30} days`,
        active_customers: count
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getCustomerGrowthStatsController = async (req, res) => {
  try {
    const stats = await getCustomerGrowthStats();
    res.status(200).json({
      success: true,
      message: "Customer growth stats fetched successfully",
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getCustomerAnalyticsController = async (req, res) => {
  try {
    const analytics = await getCustomerAnalytics();
    res.status(200).json({
      success: true,
      message: "Customer analytics fetched successfully",
      data: analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getRecentCustomersController = async (req, res) => {
  try {
    const { limit } = req.query;
    const customers = await getRecentCustomers(parseInt(limit) || 10);
    res.status(200).json({
      success: true,
      message: "Recent customers fetched successfully",
      data: {
        customers: customers,
        count: customers.length
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
  getDailyCustomersController,
  getWeeklyCustomersController,
  getMonthlyCustomersController,
  getTotalCustomersController,
  getActiveCustomersController,
  getCustomerGrowthStatsController,
  getCustomerAnalyticsController,
  getRecentCustomersController
};