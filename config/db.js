const { Pool } = require("pg");
const { getFoodflieoptions } = require("../utils/foodlieutils");

const flies = getFoodflieoptions();

const pool = new Pool({
  user: flies.user,
  host: flies.host,
  database: flies.database,
  password: flies.password,
  port: flies.port,

  // ✅ ADD THIS (important fix)
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
});

// Test connection
(async () => {
  try {
    await pool.connect();
    console.log("✅ Connected to database");

    const res = await pool.query("SELECT NOW()");
    console.log("✅ Database test query successful:", res.rows[0].now);
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
  }
})();

module.exports = pool;