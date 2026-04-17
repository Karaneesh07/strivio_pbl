// config/db.js — MySQL connection pool
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'strivio_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000, // 10 seconds
});

/**
 * Helper: run a parameterised query
 */
const query = async (text, params = []) => {
  try {
    const [rows] = await pool.query(text, params);
    return { rows };
  } catch (err) {
    console.error(`[DB ERROR] Query: ${text}`);
    console.error(`[DB ERROR] Code: ${err.code}`);
    console.error(`[DB ERROR] Message: ${err.message}`);
    throw err;
  }
};

/**
 * Initial connection test
 */
const testConnection = async () => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    console.log('✅ Database connected successfully (MySQL).');
    return true;
  } catch (err) {
    console.error('❌ Database connection failed!');
    console.error(`  - Error Code: ${err.code}`);
    console.error(`  - Message: ${err.message}`);
    if (err.code === 'ER_BAD_DB_ERROR') console.error('  - TIP: Please ensure the database "strivio_db" exists in your MySQL server.');
    return false;
  }
};

module.exports = { pool, query, testConnection };
