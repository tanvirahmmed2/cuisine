import { pool } from "@/lib/database/pg";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const q = req.nextUrl.searchParams.get("q") || "";
    const cleanQuery = q.trim();

    if (!cleanQuery) {
      return NextResponse.json({ success: false, message: "Search query is required" }, { status: 400 });
    }

    let queryStr = "SELECT id, name, phone, delivery_method, table_no, sub_total, total_discount, total_price, payment_method, status, payment_status, created_at FROM restaurant_orders WHERE (phone = $1";
    const params = [cleanQuery];

    const parsedId = parseInt(cleanQuery, 10);
    if (!isNaN(parsedId) && parsedId.toString() === cleanQuery) {
      queryStr += " OR id = $2";
      params.push(parsedId);
    }
    queryStr += ") ORDER BY created_at DESC";

    const { rows: orders } = await pool.query(queryStr, params);

    if (orders.length > 0) {
      const orderIds = orders.map(o => o.id);
      const { rows: itemRows } = await pool.query(
        "SELECT * FROM restaurant_order_items WHERE order_id = ANY($1)", [orderIds]
      );
      
      orders.forEach(order => {
        order.items = itemRows.filter(item => item.order_id === order.id);
      });
    }

    return NextResponse.json({
      success: true,
      message: "Orders retrieved successfully",
      payload: orders,
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to query orders",
      error: error.message,
    }, { status: 500 });
  }
}
