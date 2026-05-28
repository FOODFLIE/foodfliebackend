const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Partner = sequelize.define(
  "flie_partners",
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
    email: {
      type: DataTypes.STRING(255),
    },
    store_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    outlet_type: {
      type: DataTypes.STRING(100),
    },
    image: {
      type: DataTypes.TEXT,
    },

    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },

    password: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    area: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    opening_time: {
      type: DataTypes.TIME,
    },
    closing_time: {
      type: DataTypes.TIME,
    },
    working_days: {
      type: DataTypes.JSON,
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    approved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    latitude: {
      type: DataTypes.FLOAT,
    },
    longitude: {
      type: DataTypes.FLOAT,
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "flie_partners",
    timestamps: false,
  },
);

module.exports = Partner;
