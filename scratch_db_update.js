const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE || 'postgres',
  ssl: { rejectUnauthorized: false }
});

async function main() {
  const queries = [
    "ALTER TABLE restaurant_users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;",
    "ALTER TABLE restaurant_users ADD COLUMN IF NOT EXISTS verification_token TEXT;",
    "ALTER TABLE restaurant_users ADD COLUMN IF NOT EXISTS verification_token_expires TIMESTAMP;",
    "UPDATE restaurant_users SET is_verified = TRUE WHERE is_verified IS FALSE;"
  ];

  for (const q of queries) {
    try {
      await pool.query(q);
      console.log("Executed:", q);
    } catch (e) {
      console.error("Error executing:", q, e.message);
    }
  }
  process.exit(0);
}

main();
