const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getFoodflieoptions } = require("../../utils/foodlieutils");

const flies = getFoodflieoptions()
const Email = flies.ADMIN_EMAIL
const PasswordHash = flies.ADMIN_PASSWORD


const AdminLogin = async (email, password) => {
 
  try {
    if (email !== Email) {
      throw new Error("Invalid credentials");
    }
    
    const isValid = await bcrypt.compare(password, PasswordHash);
    if (!isValid) {
      throw new Error("Invalid credentials");
    }
    
    const adminToken = jwt.sign({ email, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "24h" });
    return { adminToken, email };
  } catch (error) {
    throw error;
  }
};

module.exports = { AdminLogin };
