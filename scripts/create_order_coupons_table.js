const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE || process.env.PG_DB,
  ssl: { rejectUnauthorized: false }
});

async function createOrderCouponsTable() {
  const client = await pool.connect();
  try {
    console.log('Creating order_coupons table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS order_coupons (
        id SERIAL PRIMARY KEY,
        order_id INT REFERENCES orders(id) ON DELETE CASCADE,
        coupon_id INT REFERENCES coupons(id) ON DELETE SET NULL,
        code VARCHAR(50),
        discount_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_order_coupons_order_id ON order_coupons(order_id);
      CREATE INDEX IF NOT EXISTS idx_order_coupons_coupon_id ON order_coupons(coupon_id);
    `);
    console.log('order_coupons table created successfully!');
  } catch (err) {
    console.error('Error creating order_coupons table:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

createOrderCouponsTable();
