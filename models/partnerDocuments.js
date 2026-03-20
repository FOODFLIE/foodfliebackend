const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const PartnerDocument = sequelize.define(
  "flie_partner_documents",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    partner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true, // one record per partner
    },

    // PAN
    pan_number: {
      type: DataTypes.STRING,
    },

    // GST
    gst_number: {
      type: DataTypes.STRING,
    },

    // FSSAI
    fssai_number: {
      type: DataTypes.STRING,
    },
    // BANK
    bank_account_holder_name: {
      type: DataTypes.STRING,
    },
    bank_account_number: {
      type: DataTypes.STRING,
    },
    bank_ifsc: {
      type: DataTypes.STRING,
    },

    rejection_reason: {
      type: DataTypes.TEXT,
    },

    submitted_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "flie_partner_documents",
    timestamps: false,
  },
);

module.exports = PartnerDocument;
