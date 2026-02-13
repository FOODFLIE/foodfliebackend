require("dotenv").config();
const { Sequelize } = require("sequelize");
const { getFoodflieoptions } = require("../utils/foodlieutils");

const flies = getFoodflieoptions();

const sequelize = new Sequelize(
  flies.database,
  flies.user,
  flies.password,
  {
    host: flies.host,
    port: flies.port || 5432,   // postgres default
    dialect: "postgres",
    logging: false,
    pool: {
      max: 30,
      min: 0,
      acquire: 60000,
      idle: 10000,
    },
    dialectOptions: {
      connectTimeout: 60000,
    },
    retry: {
      match: [/SequelizeConnectionError/, /SequelizeTimeoutError/],
      max: 5,
    },
  }
);

// Test connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ PostgreSQL connected");
  } catch (error) {
    console.error("❌ connection error:", error);
  }
})();

module.exports = sequelize;
