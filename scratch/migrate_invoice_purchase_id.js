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
    ALTER TABLE ress_invoices 
    ADD COLUMN IF NOT EXISTS purchase_id INT REFERENCES ress_purchases(purchase_id) ON DELETE CASCADE;
  `);
  console.log('Added purchase_id to ress_invoices');
  
  await c.query(`
    ALTER TABLE ress_subscription_payments 
    ADD COLUMN IF NOT EXISTS purchase_id INT REFERENCES ress_purchases(purchase_id) ON DELETE CASCADE;
  `);
  console.log('Added purchase_id to ress_subscription_payments');
  
  await c.end();
}

run().catch(console.error);
