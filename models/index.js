const Cart = require("./cart");
const CartItem = require("./cartItems");

Cart.hasMany(CartItem, { foreignKey: "cart_id", as: "items" });
CartItem.belongsTo(Cart, { foreignKey: "cart_id" });

module.exports = { Cart, CartItem };
