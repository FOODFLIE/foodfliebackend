const express = require("express");
const router = express.Router();
const { CustomerLoginController } = require("../controllers/customer/loginController");

router.post("/login", CustomerLoginController);

module.exports = router;
