const { Partner } = require("../../models");

const toggleStoreStatusService = async (partner_id, is_active) => {
  try {
    const updatedPartner = await Partner.update(
      { is_active },
      { where: { id: partner_id } },
    );

    return updatedPartner;
  } catch (error) {
    console.error(
      `Error updating store status for partner ID ${partner_id}:`,
      error,
    );
    throw error;
  }
};
const getAllStores = async () => {
  try {
    const stores = await Partner.findAll({
      attributes: [
        "id",
        "store_name",
        "name",
        "email",
        "phone",
        "address",
        "area",
        "outlet_type",
        "is_active",
        "approved",
        "opening_time",
        "closing_time",
        "created_at"
      ],
      order: [['created_at', 'DESC']]
    });
    return stores;
  } catch (error) {
    console.error("Error fetching stores:", error);
    throw error;
  }
};
module.exports = { toggleStoreStatusService, getAllStores };
