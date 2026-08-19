const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE || process.env.PG_DB,
  ssl: { rejectUnauthorized: false }
});

async function testCouponFlow() {
  const client = await pool.connect();
  try {
    console.log('Testing Coupons DB operations without max_usage_per_account...');

    // 1. Insert test coupon
    const insertRes = await client.query(`
      INSERT INTO coupons (
        title, code, discount, is_percentage, min_bill, start_at, expires_at, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
    `, [
      'Summer 15% Off',
      'SUMMER15',
      15,
      true,
      300,
      new Date(),
      new Date(Date.now() + 14 * 24 * 3600 * 1000),
      true
    ]);
    const coupon = insertRes.rows[0];
    console.log('Created coupon:', coupon.code, 'ID:', coupon.id);

    // 2. Query coupon
    const selectRes = await client.query('SELECT * FROM coupons WHERE code = $1', ['SUMMER15']);
    console.log('Found coupon:', selectRes.rows[0]?.title);

    // 3. Update coupon
    const updateRes = await client.query(`
      UPDATE coupons SET discount = 18, title = 'Summer 18% Off' WHERE id = $1 RETURNING *
    `, [coupon.id]);
    console.log('Updated coupon discount:', updateRes.rows[0]?.discount);

    // 4. Delete coupon
    await client.query('DELETE FROM coupons WHERE id = $1', [coupon.id]);
    console.log('Deleted test coupon successfully.');

    console.log('--- ALL COUPON DB TESTS PASSED ---');
  } catch (err) {
    console.error('Coupon test error:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

testCouponFlow();
