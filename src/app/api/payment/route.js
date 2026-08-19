import { pool } from "@/lib/database/pg";
import { NextResponse } from "next/server";
import { isLogin, isSales } from "@/lib/auth/middleware";

export async function POST(req) {
  const client = await pool.connect();
  try {
    const auth = await isSales();
    if (!auth.success) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
    }

    const { order_id, amount, method, transaction_id } = await req.json();

    if (!order_id || !amount) {
      return NextResponse.json({ success: false, message: "Order ID and amount are required" }, { status: 400 });
    }

    await client.query("BEGIN");

    // 1. Verify order exists
    const { rows: orderRows } = await client.query(
      "SELECT id FROM orders WHERE id = $1 LIMIT 1", [order_id]
    );

    if (orderRows.length === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    // 2. Insert Payment
    const { rows: paymentRows } = await client.query(
      `INSERT INTO payments (order_id, amount, method, transaction_id, status) 
      VALUES ($1, $2, $3, $4, $5) RETURNING *`, 
      [order_id, amount, method || "cash", transaction_id || "", "completed"]
    );

    // 3. Update Order Status
    await client.query("UPDATE orders SET payment_status = $1, status = $2 WHERE id = $3", ["paid", "accepted", order_id]);

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      message: "Payment recorded successfully",
      payload: paymentRows[0],
    }, { status: 201 });

  } catch (error) {
    await client.query("ROLLBACK");
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function GET(req) {
  try {
    const auth = await isLogin();
    if (!auth.success) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
    }

    const { rows: orders } = await pool.query(
      `SELECT 
        o.id,
        o.id as order_id,
        o.name as customer_name,
        o.phone as customer_phone,
        o.delivery_method,
        o.table_no,
        o.sub_total,
        o.total_discount,
        o.total_price,
        o.paid_amount,
        o.change_amount,
        o.payment_method,
        o.payment_status,
        o.status as order_status,
        o.transaction_id,
        o.created_at
      FROM orders o
      ORDER BY o.created_at DESC`
    );

    return NextResponse.json({
      success: true,
      message: "Successfully fetched order payments",
      payload: orders,
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

