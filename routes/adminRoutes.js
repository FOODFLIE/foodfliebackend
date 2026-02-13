const express = require("express");
const router = express.Router();
const {
  AdminLoginController,
} = require("../controllers/admin/adminController");

router.post("/login", AdminLoginController);

module.exports = router;
