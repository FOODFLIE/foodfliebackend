const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Coupon = sequelize.define(
  "coupons",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },

    discount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    min_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    usage_limit: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },

    used_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    user_limit: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "flie_coupons",
    timestamps: false,
  },
);

module.exports = Coupon;