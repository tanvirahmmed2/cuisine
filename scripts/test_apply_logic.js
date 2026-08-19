const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE || process.env.PG_DB,
  ssl: { rejectUnauthorized: false }
});

async function testApplyCoupon() {
  try {
    const code = 'SUM26';
    const total_price = 500;

    const formattedCode = code.trim().toUpperCase();

    const { rows } = await pool.query(
      "SELECT * FROM coupons WHERE UPPER(code) = $1 LIMIT 1",
      [formattedCode]
    );

    console.log('Coupon in DB:', rows[0]);
    if (rows.length === 0) {
      console.log('Not found');
      return;
    }

    const coupon = rows[0];
    const now = new Date();

    console.log('Now:', now.toISOString());
    console.log('is_active:', coupon.is_active);
    console.log('start_at <= now:', coupon.start_at ? new Date(coupon.start_at) <= now : true);
    console.log('expires_at > now:', coupon.expires_at ? new Date(coupon.expires_at) > now : true);

    const bill = Number(total_price);
    let discountAmount = coupon.is_percentage ? (bill * Number(coupon.discount)) / 100 : Number(coupon.discount);
    if (discountAmount > bill) discountAmount = bill;
    const finalPrice = Math.max(0, bill - discountAmount);

    console.log('SUCCESS! Applied coupon calculation:');
    console.log({
      code: coupon.code,
      discount_amount: discountAmount,
      original_price: bill,
      final_price: finalPrice
    });

  } catch(e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}

testApplyCoupon();
