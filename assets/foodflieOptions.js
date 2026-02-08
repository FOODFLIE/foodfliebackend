const foodflieOptions = {
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "foodapp",
  password: process.env.DB_PASSWORD || "your_password",
};

module.exports = foodflieOptions;
