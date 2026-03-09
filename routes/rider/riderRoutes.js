const express = require("express");
const router = express.Router();
const { RiderLoginController, UpdateRiderStatusController, UpdateLocationController } = require("../../controllers/rider/riderController");
const { GetRiderOrdersController, UpdateOrderStatusController } = require("../../controllers/rider/riderOrderController");
const { riderAuth } = require("../../middleware/riderAuth");

router.post("/login", RiderLoginController);
router.put("/status", riderAuth, UpdateRiderStatusController);
router.post("/location", riderAuth, UpdateLocationController);
router.get("/orders", riderAuth, GetRiderOrdersController);
router.put("/orders/status", riderAuth, UpdateOrderStatusController);

module.exports = router;
