const { AddToCart, GetCart, UpdateCartItem, RemoveFromCart, SyncGuestCart } = require("../../services/customer/cartServices");

const AddToCartController = async (req, res) => {
  try {
    const { sku, quantity } = req.body;
    const customer_id = req.customer.id;
    const result = await AddToCart(customer_id, sku, quantity);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const GetCartController = async (req, res) => {
  try {
    const customer_id = req.customer.id;
    const cart = await GetCart(customer_id);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const UpdateCartItemController = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const result = await UpdateCartItem(id, quantity);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const RemoveFromCartController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await RemoveFromCart(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const SyncGuestCartController = async (req, res) => {
  try {
    const customer_id = req.customer.id;
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "items must be a non-empty array" });
    }
    const result = await SyncGuestCart(customer_id, items);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { AddToCartController, GetCartController, UpdateCartItemController, RemoveFromCartController, SyncGuestCartController };
