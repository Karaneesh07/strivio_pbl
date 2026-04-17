const { pool } = require('./config/db');

async function test() {
  try {
    console.log('Testing MySQL connection...');
    const [rows] = await pool.execute('SELECT 1 + 1 AS result');
    console.log('Connection successful! Result:', rows[0].result);
    process.exit(0);
  } catch (err) {
    console.error('Connection failed:', err.message);
    process.exit(1);
  }
}

test();
