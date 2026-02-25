const express = require("express");
const cors = require("cors");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const adminRoutes = require("./routes/adminRoutes");
const customerRoutes = require("./routes/customer/customerRoutes");
const sellerRoutes = require("./routes/sellerRoutes");
const cartRoutes = require("./routes/customer/cartRoutes");
const app = express();

require("dotenv").config();
require("./config/db");

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:5173"];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/cart", cartRoutes)
app.listen(process.env.PORT || 5000, () => {
  console.log("Server is running on port 5000");
});
