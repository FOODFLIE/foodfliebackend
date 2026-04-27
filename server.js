const express = require("express");
const cors = require("cors");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/partner/partnerProductRoutes");
const customerProductRoutes = require("./routes/customer/productRoutes");
const adminRoutes = require("./routes/adminRoutes");
const customerRoutes = require("./routes/customer/customerRoutes");
const sellerRoutes = require("./routes/sellerRoutes");
const cartRoutes = require("./routes/customer/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const addressRoutes = require("./routes/customer/addressRoutes");
const riderRoutes = require("./routes/rider/riderRoutes");
const partnerProductRoutes = require("./routes/partner/partnerProductRoutes");
const partnerStoreRoutes = require("./routes/partner/partnerStoreRoutes");
const partnerOrderRoutes = require("./routes/partner/partnerOrderRoutes");

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
app.use("/api/customer-product", customerProductRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/partner", sellerRoutes);
app.use("/api/cart", cartRoutes)
app.use("/api/order", orderRoutes)
app.use("/api/address", addressRoutes)
app.use("/api/rider", riderRoutes)
app.use("/api/partner/menu", partnerProductRoutes)
app.use("/api/partner/store", partnerStoreRoutes)
app.use("/api/partner/orders", partnerOrderRoutes)

app.get("/", (req, res) => {
  res.send("FoodFie Backend Server is Running");
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Server is running on port 5000");
});
