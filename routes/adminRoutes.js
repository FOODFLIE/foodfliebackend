const express = require("express");
const router = express.Router();
const { AdminLoginController } = require("../controllers/adminController");

router.post("/login", AdminLoginController);

module.exports = router;
