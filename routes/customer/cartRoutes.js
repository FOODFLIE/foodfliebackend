const express = require("express");
const router = express.Router();
const { customerAuth } = require("../../middleware/customerAuth");
const { AddToCartController, GetCartController, UpdateCartItemController, RemoveFromCartController } = require("../../controllers/customer/cartController");

router.post("/add", customerAuth, AddToCartController);
router.get("/", customerAuth, GetCartController);
router.put("/:id", customerAuth, UpdateCartItemController);
router.delete("/:id", customerAuth, RemoveFromCartController);

module.exports = router;
