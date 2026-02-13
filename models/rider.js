const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Rider = sequelize.define(
  "flie_riders",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },

    vehicle_type: {
      type: DataTypes.STRING(50),
      allowNull: true,
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
    tableName: "flie_riders",
    timestamps: false,
  }
);

module.exports = Rider;
