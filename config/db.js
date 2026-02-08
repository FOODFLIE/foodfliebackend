const { Pool } = require("pg");
const { getFoodflieoptions } = require("../utils/foodlieutils");
const flies = getFoodflieoptions();

const pool = new Pool({
  user: flies.user,
  host: flies.host,
  database: flies.database,
  password: flies.password,
  port: flies.port,
});
(async () => {
  try {
    await pool.connect();
    console.log("Connected to database");

    // This query proves we can actually read from the database
    const res = await pool.query("SELECT NOW()");
    console.log("Database test query successful:", res.rows[0].now);
  } catch (error) {
    console.error("Database connection error:", error.message);
  }
})(); // The "()" here is essential to execute the connection check

module.exports = pool;
