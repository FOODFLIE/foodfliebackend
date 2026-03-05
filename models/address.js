const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Address = sequelize.define(
  "flie_user_addresses",
{
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  address_line1: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },

  city: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },

  pincode: {
    type: DataTypes.STRING(10),
  },

  latitude: {
    type: DataTypes.DECIMAL(10,8),
    allowNull: false,
  },

  longitude: {
    type: DataTypes.DECIMAL(11,8),
    allowNull: false,
  },

  address_type: {
    type: DataTypes.ENUM("home","work","other"),
  },

  is_default: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  }
},
  {
    tableName: "flie_user_addresses",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Address;