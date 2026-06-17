const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE || 'postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  const r = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE '%user%'");
  console.log("User tables:", r.rows);
  
  for (const row of r.rows) {
    const table = row.table_name;
    const columns = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = $1", [table]);
    console.log(`\nTable: ${table}`);
    console.log(columns.rows.map(c => `${c.column_name}: ${c.data_type}`).join('\n'));
  }
  process.exit(0);
}
run();
