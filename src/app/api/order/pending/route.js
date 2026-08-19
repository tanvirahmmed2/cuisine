
import { pool } from "@/lib/database/pg";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    

    const { rows: orders } = await pool.query("SELECT * FROM orders WHERE status = 'pending' ORDER BY created_at DESC");

    if (orders.length > 0) {
      const orderIds = orders.map(o => o.id);
      const { rows: itemRows } = await pool.query("SELECT * FROM order_items WHERE order_id = ANY($1)", [orderIds]);
      const { rows: couponRows } = await pool.query("SELECT * FROM order_coupons WHERE order_id = ANY($1)", [orderIds]);
      
      orders.forEach(order => {
        order.items = itemRows.filter(item => item.order_id === order.id);
        const c = couponRows.find(c => c.order_id === order.id);
        order.coupon = c || null;
        order.coupon_code = c ? c.code : null;
        order.coupon_discount = c ? Number(c.discount_amount) : 0;
      });
    }

    return NextResponse.json({
      success: true,
      message: "Successfully fetched pending orders",
      payload: orders,
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to fetch pending orders",
      error: error.message,
    }, { status: 500 });
  }
}
