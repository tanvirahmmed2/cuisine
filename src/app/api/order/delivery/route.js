
import { pool } from "@/lib/database/pg";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, message: "ID not found" }, { status: 400 });
    }

    const { rowCount } = await pool.query("UPDATE restaurant_orders SET status = 'delivered' WHERE id = $1", [id]);

    if (rowCount === 0) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Successfully delivered order" }, { status: 200 });

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
