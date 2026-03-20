const express = require("express");
const {
  AddFeeController,
  GetAllFeesController,
  GetFeeByIdController,
  UpdateFeeController,
  DeleteFeeController,
  CalculateDeliveryFeeController
} = require("../controllers/admin/feeController");

const router = express.Router();

// CRUD routes
router.post("/fees/add", AddFeeController);
router.get("/fees", GetAllFeesController);
router.get("/fees/:id", GetFeeByIdController);
router.put("/fees/:id", UpdateFeeController);
router.delete("/fees/:id", DeleteFeeController);

// Utility routes
router.post("/fees/calculate-delivery", CalculateDeliveryFeeController);

module.exports = router;