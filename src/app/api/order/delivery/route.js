
import { pool } from "@/lib/database/pg";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    

    const { id, paid_amount, change_amount, payment_method, payment_status } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, message: "ID not found" }, { status: 400 });
    }

    let query = "UPDATE restaurant_orders SET status = 'delivered'";
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

    // Free associated table (set status to 'available')
    try {
      const { rows: orderRows } = await pool.query("SELECT table_id, table_no FROM restaurant_orders WHERE id = $1 LIMIT 1", [id]);
      if (orderRows.length > 0) {
        if (orderRows[0].table_id) {
          await pool.query("UPDATE tables SET status = 'available', updated_at = CURRENT_TIMESTAMP WHERE id = $1", [orderRows[0].table_id]);
        }
        if (orderRows[0].table_no && orderRows[0].table_no !== 'N/A') {
          const cleanNo = String(orderRows[0].table_no).trim();
          await pool.query(
            "UPDATE tables SET status = 'available', updated_at = CURRENT_TIMESTAMP WHERE LOWER(table_no) = LOWER($1) OR LOWER(table_no) = LOWER($2) OR LOWER(table_no) = LOWER($3)",
            [cleanNo, `table ${cleanNo}`, cleanNo.replace(/^table\s*/i, '')]
          );
        }
      }
      
      const { rows: otRows } = await pool.query("SELECT table_id FROM order_tables WHERE order_id = $1", [id]);
      if (otRows.length > 0) {
        const tableIds = otRows.map(r => r.table_id);
        await pool.query("UPDATE tables SET status = 'available', updated_at = CURRENT_TIMESTAMP WHERE id = ANY($1)", [tableIds]);
      }
    } catch (tableErr) {
      console.error("Failed to free table on delivery:", tableErr.message);
    }

    return NextResponse.json({ success: true, message: "Successfully delivered order and saved payment" }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to deliver order",
      error: error.message,
    }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    

    const { rows: orders } = await pool.query("SELECT * FROM restaurant_orders WHERE status = 'delivered' ORDER BY created_at DESC");

    if (orders.length > 0) {
      const orderIds = orders.map(o => o.id);
      const { rows: itemRows } = await pool.query("SELECT * FROM restaurant_order_items WHERE order_id = ANY($1)", [orderIds]);
      
      orders.forEach(order => {
        order.items = itemRows.filter(item => item.order_id === order.id);
      });
    }

    return NextResponse.json({
      success: true,
      message: "Successfully fetched delivered orders",
      payload: orders,
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to fetch delivered orders",
      error: error.message,
    }, { status: 500 });
  }
}
