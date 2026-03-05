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
    item_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    item_image: {
      type: DataTypes.TEXT,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    variant: {
      type: DataTypes.STRING(100),
    },

    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    total_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    instructions: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "flie_order_items",
    timestamps: false,
  },
);

module.exports = OrderItem;
