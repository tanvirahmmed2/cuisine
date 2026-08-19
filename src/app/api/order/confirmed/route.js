
import { pool } from "@/lib/database/pg";
import { NextResponse } from "next/server";
import { isSales } from "@/lib/auth/middleware";

export async function POST(req) {
  try {
    

    const auth = await isSales();
    if (!auth.success) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
    }

    const { id, paid_amount, change_amount, payment_method, payment_status } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, message: "ID not found" }, { status: 400 });
    }

    let query = "UPDATE orders SET status = 'cooking'";
    let params = [id];

    if (paid_amount !== undefined && paid_amount !== null) {
      params.push(paid_amount);
      query += `, paid_amount = $${params.length}`;
    }
    if (change_amount !== undefined && change_amount !== null) {
      params.push(change_amount);
      query += `, change_amount = $${params.length}`;
    }
    if (payment_method) {
      params.push(payment_method);
      query += `, payment_method = $${params.length}`;
    }
    if (payment_status) {
      params.push(payment_status);
      query += `, payment_status = $${params.length}`;
    } else {
      query += `, payment_status = 'paid'`;
    }

    query += " WHERE id = $1";

    const { rowCount } = await pool.query(query, params);

    if (rowCount === 0) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Successfully confirmed order and saved payment" }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to confirm order",
      error: error.message,
    }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    

    const { rows: orders } = await pool.query("SELECT * FROM orders WHERE status = 'confirmed' ORDER BY created_at DESC");

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
      message: "Successfully fetched confirmed orders",
      payload: orders,
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to fetch confirmed orders",
      error: error.message,
    }, { status: 500 });
  }
}
