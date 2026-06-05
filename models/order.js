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
    customer_phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },

    delivery_instructions: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    partner_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    rider_id: {
      type: DataTypes.INTEGER,
    },

    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    delivery_fee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },

    discount_amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },

    final_amount: {
      type: DataTypes.DECIMAL(10, 2),
    },

    status: {
      type: DataTypes.STRING(50),
      defaultValue: "placed",
    },

    payment_method: {
      type: DataTypes.STRING(50),
      defaultValue: "COD",
    },

    payment_status: {
      type: DataTypes.STRING(20),
      defaultValue: "pending",
    },
    payment_utr: {
      type: DataTypes.STRING(12),
      allowNull: true,
    },

    payment_verified_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    latitude: {
      type: DataTypes.DECIMAL(10, 8),
    },

    longitude: {
      type: DataTypes.DECIMAL(11, 8),
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    accepted_at: {
      type: DataTypes.DATE,
    },

    picked_up_at: {
      type: DataTypes.DATE,
    },

    delivered_at: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "flie_orders",
    timestamps: false, // because DB already handles created_at
  },
);

module.exports = Order;
