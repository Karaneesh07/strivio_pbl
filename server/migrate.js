// server/migrate.js — Runs migrate.sql against Aiven MySQL
// Usage: node migrate.js
require('dotenv').config();
const fs   = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function migrate() {
  const conn = await mysql.createConnection({
    host:     process.env.DB_HOST,
    port:     parseInt(process.env.DB_PORT || '3306'),
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { 
      rejectUnauthorized: true,
      ca: fs.readFileSync(path.join(__dirname, 'certs/ca.pem')),
    },
    multipleStatements: true,
  });

  console.log('✅ Connected to Aiven MySQL.');

  const sql = fs.readFileSync(path.join(__dirname, 'migrate.sql'), 'utf8');

  // Split on ; to run each statement individually
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  let created = 0;
  for (const stmt of statements) {
    try {
      await conn.query(stmt);
      const match = stmt.match(/CREATE TABLE IF NOT EXISTS (\w+)/i);
      if (match) {
        console.log(`  ✔ Table ready: ${match[1]}`);
        created++;
      }
    } catch (err) {
      console.error(`  ✖ Failed on statement: ${stmt.slice(0, 60)}...`);
      console.error('    Error:', err.message);
      await conn.end();
      process.exit(1);
    }
  }

  console.log(`\n🎉 Migration complete — ${created} table(s) verified.\n`);
  await conn.end();
}

migrate().catch(err => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
