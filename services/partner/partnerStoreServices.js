const Partner = require("../../models/partner");

const toggleStoreStatus = async (partner_id, is_active) => {
    try {
        await Partner.update(
            { is_active },
            { where: { id: partner_id } }
        );
        
        const updatedPartner = await Partner.findByPk(partner_id, {
            attributes: ['id', 'store_name', 'is_active']
        });
        console.log(`Store status for partner ID ${partner_id} updated to ${is_active}`);
        return updatedPartner;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    toggleStoreStatus
};