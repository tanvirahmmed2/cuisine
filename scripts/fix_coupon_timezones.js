const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE || process.env.PG_DB,
  ssl: { rejectUnauthorized: false }
});

async function fixTimezones() {
  const client = await pool.connect();
  try {
    console.log('Fixing timezone handling on coupons table...');
    await client.query(`
      ALTER TABLE coupons 
        ALTER COLUMN start_at TYPE TIMESTAMPTZ,
        ALTER COLUMN expires_at TYPE TIMESTAMPTZ,
        ALTER COLUMN created_at TYPE TIMESTAMPTZ,
        ALTER COLUMN updated_at TYPE TIMESTAMPTZ;
    `);

    // For any existing coupons where start_at was saved ahead, fix start_at if it was intended to start now
    await client.query(`
      UPDATE coupons 
      SET start_at = CURRENT_TIMESTAMP 
      WHERE UPPER(code) = 'SUM26' AND start_at > CURRENT_TIMESTAMP;
    `);

    console.log('Altered columns to TIMESTAMPTZ successfully!');

    // Test query
    const checkQuery = await client.query(
      `SELECT * FROM coupons 
       WHERE UPPER(code) = 'SUM26' 
         AND is_active = true 
         AND (start_at IS NULL OR start_at <= CURRENT_TIMESTAMP)
         AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)`
    );
    console.log('Matching coupons count:', checkQuery.rows.length);
    if (checkQuery.rows.length > 0) {
      console.log('Coupon data:', checkQuery.rows[0]);
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

fixTimezones();
