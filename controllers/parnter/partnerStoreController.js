const { toggleStoreStatus } = require("../../services/partner/partnerStoreServices");

const toggleStoreStatusController = async (req, res) => {
    try {
        const partner_id = req.seller.id;
        const { is_active } = req.body;

        if (typeof is_active !== 'boolean') {
            return res.status(400).json({
                success: false,
                message: "is_active must be a boolean value"
            });
        }

        const updatedStore = await toggleStoreStatus(partner_id, is_active);

        res.status(200).json({
            success: true,
            message: `Store ${is_active ? 'activated' : 'deactivated'} successfully`,
            data: updatedStore
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update store status",
            error: error.message
        });
    }
};

module.exports = {
    toggleStoreStatusController
};