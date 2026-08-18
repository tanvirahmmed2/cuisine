
import { pool } from "@/lib/database/pg";
import { NextResponse } from "next/server";
import { isLogin } from "@/lib/auth/middleware";

export async function GET(req) {
  try {
    

    const auth = await isLogin();
    if (!auth.success) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
    }

    const user = auth.payload;
    const userPhoneDigits = user.phone ? String(user.phone).replace(/\D/g, "") : "";
    const userPhoneLast11 = userPhoneDigits.length >= 11 ? userPhoneDigits.slice(-11) : user.phone;

    const { rows: orders } = await pool.query(
      "SELECT * FROM orders WHERE RIGHT(phone, 11) = $1 OR phone = $2 ORDER BY created_at DESC",
      [userPhoneLast11, user.phone]
    );

    if (orders.length > 0) {
      const orderIds = orders.map(o => o.id);
      const { rows: itemRows } = await pool.query("SELECT * FROM order_items WHERE order_id = ANY($1)", [orderIds]);
      
      orders.forEach(order => {
        order.items = itemRows.filter(item => item.order_id === order.id);
      });
    }

    return NextResponse.json({
      success: true,
      message: "Successfully fetched user orders",
      payload: orders,
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    }, { status: 500 });
  }
}
