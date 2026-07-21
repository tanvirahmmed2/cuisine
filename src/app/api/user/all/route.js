
import { pool } from "@/lib/database/pg";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth/middleware";

export async function GET(req) {
  try {
    

    const auth = await isAdmin();
    if (!auth.success) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const filterRole = searchParams.get('role');

    let query = "SELECT id, name, email, role, is_banned, created_at FROM restaurant_users";
    let params = [];
    
    if (filterRole === 'management') {
      query += " AND role IN ('admin', 'manager', 'sales')";
    }
    
    query += " ORDER BY created_at DESC";

    const { rows } = await pool.query(query, params);

    return NextResponse.json({
      success: true,
      message: "Successfully fetched users",
      payload: rows,
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
