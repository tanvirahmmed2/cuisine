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
  await c.query('ALTER TABLE ress_users DROP COLUMN IF EXISTS tenant_id;');
  console.log('Dropped tenant_id');
  await c.query("UPDATE ress_users SET role = 'admin' WHERE role = 'owner';");
  console.log('Updated role');
  await c.query('ALTER TABLE ress_users DROP CONSTRAINT IF EXISTS ress_users_role_check;');
  console.log('Dropped old constraint');
  await c.query("ALTER TABLE ress_users ADD CONSTRAINT ress_users_role_check CHECK (role IN ('admin', 'manager', 'support', 'customer'));");
  console.log('Added new constraint');
  await c.end();
}

run().catch(console.error);
