const Cart = require("./cart");
const CartItem = require("./cartItems");
const Partner = require("./partner");
const Product = require("./product");
const ProductVariant = require("./productVariant");
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

// Partner-Category associations (through Products)
Partner.belongsToMany(Category, { 
  through: Product, 
  foreignKey: "partner_id", 
  otherKey: "category_id", 
  as: "categories" 
});
Category.belongsToMany(Partner, { 
  through: Product, 
  foreignKey: "category_id", 
  otherKey: "partner_id", 
  as: "partners" 
});

// Product-ProductVariant associations
Product.hasMany(ProductVariant, { foreignKey: "product_id", as: "variants" });
ProductVariant.belongsTo(Product, { foreignKey: "product_id", as: "product" });

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
  ProductVariant,
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
