const foodflieOptions = {
  allowedOrigins:process.env.ALLOWED_ORIGINS,
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "foodapp",
  password: process.env.DB_PASSWORD || "your_password",
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || "admin@gmail.com",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "password",
  
};

module.exports = foodflieOptions;
