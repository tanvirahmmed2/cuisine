
import { pool } from "@/lib/database/pg";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    

    const { rows } = await pool.query(`SELECT p.*, c.name as category_name, c.slug as category_slug 
       FROM restaurant_items p 
       LEFT JOIN restaurant_categories c ON p.category_id = c.id 
       WHERE p.discount > 0
       ORDER BY p.created_at DESC 
       LIMIT 3`);

    return NextResponse.json({
      success: true,
      message: "Successfully fetched data",
      payload: rows,
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to fetch data",
      error: error.message,
    }, { status: 500 });
  }
}