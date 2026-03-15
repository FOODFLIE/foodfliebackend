const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Cart = sequelize.define("flie_cart", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  partner_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  status: {
    type: DataTypes.ENUM("active", "converted"),
    defaultValue: "active",
  },

  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },

  delivery_fee: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },

  total: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
}, {
  tableName: "flie_cart",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  indexes: [
    {
      unique: true,
      fields: ["customer_id", "partner_id", "status"],
    },
  ],
});

module.exports = Cart;