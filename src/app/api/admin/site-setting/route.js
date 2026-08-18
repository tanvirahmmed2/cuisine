import { pool } from "@/lib/database/pg";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { rows } = await pool.query("SELECT * FROM restaurant_websites LIMIT 1");
    return NextResponse.json({
      success: true,
      message: "Site settings fetched successfully",
      payload: rows.length > 0 ? rows[0] : {},
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to fetch site settings",
      error: error.message,
    }, { status: 500 });
  }
}
