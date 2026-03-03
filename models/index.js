const Cart = require("./cart");
const CartItem = require("./cartItems");
const Partner = require("./partner");
const Product = require("./product");

// Cart associations
Cart.hasMany(CartItem, { foreignKey: "cart_id", as: "items" });
CartItem.belongsTo(Cart, { foreignKey: "cart_id" });

// Partner-Product associations
Partner.hasMany(Product, { foreignKey: "partner_id", as: "products" });
Product.belongsTo(Partner, { foreignKey: "partner_id", as: "partner" });



module.exports = { Cart, CartItem, Partner, Product };
