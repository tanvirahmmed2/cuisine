const { Client } = require('pg');
const fs = require('fs');

const envFile = fs.readFileSync('../.env', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [k, v] = line.split('=');
  if(k&&v) env[k.trim()] = v.trim().replace(/'/g, '');
});

const c = new Client({
  user: env.PG_USER,
  password: env.PG_PASSWORD,
  host: env.PG_HOST,
  port: parseInt(env.PG_PORT, 10),
  database: env.PG_DATABASE,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await c.connect();
  console.log('Connected');
  await c.query(`
    ALTER TABLE ress_purchases 
    ADD COLUMN IF NOT EXISTS requested_tenant_name TEXT,
    ADD COLUMN IF NOT EXISTS requested_tenant_slug TEXT,
    ADD COLUMN IF NOT EXISTS requested_custom_domain TEXT,
    ADD COLUMN IF NOT EXISTS transaction_id TEXT,
    ADD COLUMN IF NOT EXISTS payment_method TEXT,
    ADD COLUMN IF NOT EXISTS duration_months INT DEFAULT 1;
  `);
  console.log('Added missing columns to ress_purchases');
  await c.end();
}

run().catch(console.error);
