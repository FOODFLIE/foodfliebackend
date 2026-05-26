const express = require("express");
const router = express.Router();
const { getKOTData, getESCPOSKOT, getTextKOT } = require("../controllers/kotController");
const { sellerAuth } = require("../middleware/sellerAuth");

// Get KOT data (JSON format)
router.get("/:order_id", sellerAuth, getKOTData);

// Get ESC/POS formatted KOT for thermal printer
router.get("/:order_id/print", sellerAuth, getESCPOSKOT);

// Get text formatted KOT
router.get("/:order_id/text", sellerAuth, getTextKOT);

module.exports = router;
