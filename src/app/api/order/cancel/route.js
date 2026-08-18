
import { pool } from "@/lib/database/pg";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, message: "ID not found" }, { status: 400 });
    }

    const { rowCount } = await pool.query("UPDATE orders SET status = 'cancelled', payment_status = 'unpaid' WHERE id = $1", [id]);

    if (rowCount === 0) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    // Free associated table (set status to 'available')
    try {
      const { rows: orderRows } = await pool.query("SELECT table_id, table_no FROM orders WHERE id = $1 LIMIT 1", [id]);
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
      console.error("Failed to free table on cancel:", tableErr.message);
    }

    return NextResponse.json({ success: true, message: "Successfully cancelled order" }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to cancel order",
      error: error.message,
    }, { status: 500 });
  }
}