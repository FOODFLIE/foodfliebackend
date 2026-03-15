const express = require("express");
const router = express.Router();
const { AddAddressController, GetAddressesController, UpdateAddressController, DeleteAddressController } = require("../../controllers/customer/addressController");
const { customerAuth } = require("../../middleware/customerAuth");

router.post("/add", customerAuth, AddAddressController);
router.get("/", customerAuth, GetAddressesController);
router.put("/:address_id", customerAuth, UpdateAddressController);
router.delete("/:address_id", customerAuth, DeleteAddressController);

module.exports = router;
