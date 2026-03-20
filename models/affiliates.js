const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Affiliate = sequelize.define(
  "flie_affiliates",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    type: {
      type: DataTypes.STRING(50),
    },

    phone: {
      type: DataTypes.STRING(20),
    },

    address: {
      type: DataTypes.TEXT,
    },

    commission_type: {
      type: DataTypes.STRING(20),
      defaultValue: "fixed",
    },

    commission_value: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 10,
    },
    qr_code_url: {
      type: DataTypes.STRING(255),
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
    tableName: "flie_affiliates",
    timestamps: false,
  }
);

module.exports = Affiliate;