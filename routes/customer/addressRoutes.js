const express = require("express");
const router = express.Router();
const { AddAddressController, GetAddressesController, UpdateAddressController } = require("../../controllers/customer/addressController");
const { customerAuth } = require("../../middleware/customerAuth");

router.post("/add", customerAuth, AddAddressController);
router.get("/", customerAuth,GetAddressesController);
router.put("/:address_id",customerAuth, UpdateAddressController);

module.exports = router;
