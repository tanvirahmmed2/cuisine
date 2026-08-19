
import { pool } from "@/lib/database/pg";
import { NextResponse } from "next/server";
import { isLogin } from "@/lib/auth/middleware";

export async function GET(req) {
  try {

    const auth = await isLogin();
    if (!auth.success) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
    }

    if (!["admin", "manager", "sales"].includes(auth.payload.role)) {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 403 });
    }

    const { rows } = await pool.query("SELECT * FROM customers ORDER BY id DESC");

    return NextResponse.json({
      success: true,
      message: "Successfully fetched data",
      payload: rows,
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}