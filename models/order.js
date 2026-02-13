const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Order = sequelize.define(
  "flie_orders",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    partner_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    status: {
      type: DataTypes.STRING(50),
      defaultValue: "placed",
    },

    payment_method: {
      type: DataTypes.STRING(50),
      defaultValue: "COD",
    },

    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "flie_orders",
    timestamps: false, // because DB already handles created_at
  }
);

module.exports = Order;
