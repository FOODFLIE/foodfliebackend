const express = require("express");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes"); 
const adminRoutes = require("./routes/adminRoutes");   
const app = express();

require("dotenv").config();
require("./config/db");

app.use(express.json());

app.use("/api/category",categoryRoutes);
app.use("/api/product",productRoutes);
app.use("/api/admin", adminRoutes);

app.listen(process.env.PORT || 5000, () => {
    console.log("Server is running on port 5000");
})