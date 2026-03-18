const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Category = sequelize.define(
  "flie_categories",
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

    image: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },

    // ✅ NEW FIELD: delivery_type
    delivery_type: {
      type: DataTypes.ENUM("fast", "regular"),
      allowNull: false,
      defaultValue: "regular",
    },

    // ✅ NEW FIELD: delivery_time (in minutes)
    delivery_time: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30,
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
    tableName: "flie_categories",
    timestamps: false,
  }
);

module.exports = Category;