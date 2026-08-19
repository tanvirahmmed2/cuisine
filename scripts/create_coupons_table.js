const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE || process.env.PG_DB,
  ssl: { rejectUnauthorized: false }
});

async function createCouponsTable() {
  const client = await pool.connect();
  try {
    console.log('Creating coupons table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS coupons (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        code VARCHAR(50) UNIQUE NOT NULL,
        discount DECIMAL(12,2) NOT NULL DEFAULT 0,
        is_percentage BOOLEAN DEFAULT TRUE,
        max_usage_per_account INT DEFAULT 1,
        min_bill DECIMAL(12,2) DEFAULT 0,
        start_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
    `);
    console.log('Coupons table created successfully!');
  } catch (err) {
    console.error('Error creating coupons table:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

createCouponsTable();
