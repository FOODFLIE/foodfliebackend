const Cart = require("./cart");
const CartItem = require("./cartItems");
const Partner = require("./partner");
const Product = require("./product");
const Customer = require("./customer");
const Order = require("./order");
const OrderItem = require("./order_item");
const Category = require("./category");
const Address = require("./address");
const Rider = require("./rider");
const PartnerDocuments = require("./partnerDocuments");
const Affiliate = require("./affiliates");
const Fee = require("./fee");

// Cart associations
Cart.hasMany(CartItem, { foreignKey: "cart_id", as: "items" });
CartItem.belongsTo(Cart, { foreignKey: "cart_id" });

// Partner-Product associations
Partner.hasMany(Product, { foreignKey: "partner_id", as: "products" });
Product.belongsTo(Partner, { foreignKey: "partner_id", as: "partner" });

// Category-Product associations
Category.hasMany(Product, { foreignKey: "category_id", as: "products" });
Product.belongsTo(Category, { foreignKey: "category_id", as: "category" });

// Order associations
Order.belongsTo(Customer, { foreignKey: "customer_id", as: "customer" });
Order.belongsTo(Partner, { foreignKey: "partner_id", as: "partner" });
Order.hasMany(OrderItem, { foreignKey: "order_id", as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "order_id" });



module.exports = { 
  Cart, 
  CartItem, 
  Partner, 
  Product, 
  Customer, 
  Order, 
  OrderItem, 
  Category, 
  Address, 
  Rider, 
  PartnerDocuments, 
  Affiliate,
  Fee
};
