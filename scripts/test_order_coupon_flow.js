const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE || process.env.PG_DB,
  ssl: { rejectUnauthorized: false }
});

async function testOrderCouponFlow() {
  const client = await pool.connect();
  try {
    console.log('Testing Order + Coupon flow...');

    // 1. Create a test coupon
    const couponCode = 'TESTPOS10';
    await client.query("DELETE FROM coupons WHERE code = $1", [couponCode]);

    const { rows: cRows } = await client.query(`
      INSERT INTO coupons (title, code, discount, is_percentage, min_bill, is_active)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
    `, ['POS 10% Test Discount', couponCode, 10, true, 100, true]);

    const testCoupon = cRows[0];
    console.log('1. Created Coupon:', testCoupon.code, 'ID:', testCoupon.id);

    // 2. Simulate Order placement with coupon
    const subTotal = 500;
    const discountAmount = 50; // 10% of 500
    const totalPrice = 450;

    const { rows: oRows } = await client.query(`
      INSERT INTO orders (name, phone, delivery_method, sub_total, total_discount, total_price, paid_amount, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id
    `, ['Test POS Customer', '01700000000', 'takein', subTotal, discountAmount, totalPrice, totalPrice, 'confirmed']);

    const orderId = oRows[0].id;
    console.log('2. Created Order ID:', orderId);

    // 3. Connect to order_coupons
    await client.query(`
      INSERT INTO order_coupons (order_id, coupon_id, code, discount_amount)
      VALUES ($1, $2, $3, $4)
    `, [orderId, testCoupon.id, testCoupon.code, discountAmount]);

    console.log('3. Inserted into order_coupons table!');

    // 4. Verify relation
    const { rows: verifyRows } = await client.query(`
      SELECT oc.*, c.title as coupon_title, o.total_price 
      FROM order_coupons oc
      JOIN coupons c ON oc.coupon_id = c.id
      JOIN orders o ON oc.order_id = o.id
      WHERE oc.order_id = $1
    `, [orderId]);

    console.log('4. Verification Query Result:', verifyRows[0]);

    // 5. Cleanup test data
    await client.query("DELETE FROM orders WHERE id = $1", [orderId]);
    await client.query("DELETE FROM coupons WHERE id = $1", [testCoupon.id]);
    console.log('5. Cleaned up test records.');

    console.log('--- ALL POS ORDER COUPON TESTS PASSED ---');
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

testOrderCouponFlow();
