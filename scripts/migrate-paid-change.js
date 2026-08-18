const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*['"]?(.*?)['"]?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2];
      if (value.endsWith("'") || value.endsWith('"')) {
        value = value.slice(0, -1);
      }
      process.env[key] = value;
    }
  });
}

const pool = new Pool({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: Number(process.env.PG_PORT) || 5432,
  database: process.env.PG_DATABASE || 'postgres',
  ssl: { rejectUnauthorized: false },
});

async function migrate() {
  console.log("Connecting to PostgreSQL...");
  const client = await pool.connect();
  try {
    console.log("Adding paid_amount and change_amount columns to restaurant_orders...");
    await client.query(`
      ALTER TABLE restaurant_orders ADD COLUMN IF NOT EXISTS paid_amount DECIMAL(12,2) DEFAULT 0;
      ALTER TABLE restaurant_orders ADD COLUMN IF NOT EXISTS change_amount DECIMAL(12,2) DEFAULT 0;
    `);
    console.log("✓ Successfully added paid_amount and change_amount columns to restaurant_orders!");
  } catch (err) {
    console.error("Migration error:", err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
