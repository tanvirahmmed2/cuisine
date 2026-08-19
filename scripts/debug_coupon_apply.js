const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE || process.env.PG_DB,
  ssl: { rejectUnauthorized: false }
});

async function checkTime() {
  try {
    const { rows } = await pool.query("SELECT CURRENT_TIMESTAMP, NOW(), timezone('utc', now()) as utc_now");
    console.log('DB CURRENT_TIMESTAMP:', rows[0].current_timestamp);
    console.log('Node now:', new Date().toISOString());

    const { rows: coupons } = await pool.query("SELECT * FROM coupons WHERE UPPER(code) = 'SUM26'");
    const c = coupons[0];
    console.log('Coupon code:', c.code);
    console.log('Coupon start_at:', c.start_at ? c.start_at.toISOString() : null);
    console.log('Coupon expires_at:', c.expires_at ? c.expires_at.toISOString() : null);
    console.log('is_active:', c.is_active);

    const checkQuery = await pool.query(
      `SELECT * FROM coupons 
       WHERE UPPER(code) = 'SUM26' 
         AND is_active = true 
         AND (start_at IS NULL OR start_at <= CURRENT_TIMESTAMP)
         AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)`
    );
    console.log('Query matches count:', checkQuery.rows.length);

    if (checkQuery.rows.length === 0) {
      console.log('Why did it fail?');
      const startCheck = await pool.query("SELECT start_at, CURRENT_TIMESTAMP, (start_at <= CURRENT_TIMESTAMP) as start_valid FROM coupons WHERE UPPER(code) = 'SUM26'");
      console.log('Start check:', startCheck.rows[0]);

      const expireCheck = await pool.query("SELECT expires_at, CURRENT_TIMESTAMP, (expires_at > CURRENT_TIMESTAMP) as expire_valid FROM coupons WHERE UPPER(code) = 'SUM26'");
      console.log('Expire check:', expireCheck.rows[0]);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
checkTime();
