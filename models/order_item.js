const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const OrderItem = sequelize.define(
  "flie_order_items",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    menu_item_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: "flie_order_items",
    timestamps: false,
  }
);

module.exports = OrderItem;
