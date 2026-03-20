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
    },

    phone: {
      type: DataTypes.STRING(20),
    },

    username: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    vehicle_type: {
      type: DataTypes.STRING(50),
    },

    vehicle_number: {
      type: DataTypes.STRING(50),
    },

    status: {
      type: DataTypes.ENUM("offline", "available", "busy"),
      defaultValue: "offline",
    },

    latitude: {
      type: DataTypes.DECIMAL(10, 8),
    },

    longitude: {
      type: DataTypes.DECIMAL(11, 8),
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