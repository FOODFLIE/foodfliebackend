const express = require('express');
const { getordersController, getPickedOrdersController } = require('../../controllers/parnter/partnerOrderController');
const { sellerAuth } = require('../../middleware/sellerAuth');
const router = express.Router();

router.get("/pending",sellerAuth,getordersController)
router.get("/picked",sellerAuth,getPickedOrdersController)

module.exports = router;