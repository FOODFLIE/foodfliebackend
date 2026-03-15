const Affiliate = require("../../models/affiliates");
const { Op } = require("sequelize");
const QRCode = require('qrcode');
const { getFoodflieoptions } = require("../../utils/foodlieutils");

const flies = getFoodflieoptions();
const flieUrl = flies.affiliateUrl;

const AddAffiliate = async (affiliateData) => {
  try {
    const {
      name,
      type,
      phone,
      address,
      commission_type,
      commission_value,
      is_active,
    } = affiliateData;

    const affiliate = await Affiliate.create({
      name: name,
      type: type,
      phone: phone,
      address: address,
      commission_type: commission_type || "fixed",
      commission_value: parseFloat(commission_value) || 10,
      is_active: is_active !== undefined ? is_active : true,
    });

    // QR LOGIC ADDED
    const affiliateUrl = `${flieUrl}?affiliate_id=${affiliate.id}`;

    // Generate QR code as base64 data URL
    const qrCodeDataURL = await QRCode.toDataURL(affiliateUrl);

    // Update affiliate with QR code URL
    await affiliate.update({ qr_code_url: qrCodeDataURL });

    // Add QR code info to response
    const affiliateWithQR = {
      ...affiliate.toJSON(),
      affiliate_url: affiliateUrl,
      qr_code_url: qrCodeDataURL
    };

    return affiliateWithQR;
  } catch (error) {
    throw new Error("Error adding affiliate: " + error.message);
  }
};

const GetAllAffiliates = async (filters = {}) => {
  try {
    const whereClause = {};

    if (filters.is_active !== undefined) {
      whereClause.is_active = filters.is_active;
    }

    if (filters.type) {
      whereClause.type = { [Op.iLike]: `%${filters.type}%` };
    }

    if (filters.search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${filters.search}%` } },
        { type: { [Op.iLike]: `%${filters.search}%` } },
      ];
    }

    const affiliates = await Affiliate.findAll({
      where: whereClause,
      order: [["created_at", "DESC"]],
    });
    return affiliates;
  } catch (error) {
    throw new Error("Error fetching affiliates: " + error.message);
  }
};

const GetAffiliateById = async (id) => {
  try {
    const affiliate = await Affiliate.findByPk(id);
    if (!affiliate) {
      throw new Error("Affiliate not found");
    }
    return affiliate;
  } catch (error) {
    throw new Error("Error fetching affiliate: " + error.message);
  }
};

const UpdateAffiliate = async (id, affiliateData) => {
  try {
    const affiliate = await Affiliate.findByPk(id);
    if (!affiliate) {
      throw new Error("Affiliate not found");
    }

    const {
      name,
      type,
      phone,
      address,
      commission_type,
      commission_value,
      is_active,
    } = affiliateData;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (type !== undefined) updateData.type = type;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (commission_type !== undefined)
      updateData.commission_type = commission_type;
    if (commission_value !== undefined)
      updateData.commission_value = parseFloat(commission_value);
    if (is_active !== undefined) updateData.is_active = is_active;

    await affiliate.update(updateData);
    return affiliate;
  } catch (error) {
    throw new Error("Error updating affiliate: " + error.message);
  }
};

const DeleteAffiliate = async (id) => {
  try {
    const affiliate = await Affiliate.findByPk(id);
    if (!affiliate) {
      throw new Error("Affiliate not found");
    }

    await affiliate.destroy();
    return { message: "Affiliate deleted successfully" };
  } catch (error) {
    throw new Error("Error deleting affiliate: " + error.message);
  }
};

module.exports = {
  AddAffiliate,
  GetAllAffiliates,
  GetAffiliateById,
  UpdateAffiliate,
  DeleteAffiliate,
};