const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Fee = sequelize.define(
  "flie_fees",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    fee_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },

    fee_type: {
      type: DataTypes.STRING(20),
      allowNull: false
    },

    value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },

    min_distance_km: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true
    },

    max_distance_km: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }

  }, {
    tableName: "flie_fees",
    timestamps: false
  });

module.exports = Fee;