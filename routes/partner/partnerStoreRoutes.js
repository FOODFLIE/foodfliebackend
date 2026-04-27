const express = require("express");
const { toggleStoreStatusController } = require("../../controllers/parnter/partnerStoreController");
const { sellerAuth } = require("../../middleware/sellerAuth");

const router = express.Router();

router.put("/status", sellerAuth, toggleStoreStatusController);

module.exports = router;