const { AdminLogin } = require("../services/admin/loginServices");

const AdminLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await AdminLogin(email, password);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

module.exports = { AdminLoginController };
