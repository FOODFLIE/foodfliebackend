const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const CartItem = sequelize.define("flie_cart_items", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  cart_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  product_name: {
    type: DataTypes.STRING,
  },

  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },

  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },

  total_price: {
    type: DataTypes.DECIMAL(10, 2),
  },
}, {
  tableName: "flie_cart_items",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
});

module.exports = CartItem;