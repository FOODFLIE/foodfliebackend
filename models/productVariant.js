const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const ProductVariant = sequelize.define(
  "flie_product_variants",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sku: {
      type: DataTypes.STRING,
      unique: true,
    },

    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    is_available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "flie_product_variants",
    timestamps: false,
  },
);

module.exports = ProductVariant;
