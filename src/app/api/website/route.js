import { pool } from "@/lib/database/pg";
import { NextResponse } from "next/server";
import { isManager } from "@/lib/auth/middleware";

export async function GET(req) {
  try {
    const { rows } = await pool.query("SELECT * FROM restaurant_websites LIMIT 1");

    if (rows.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No website details set yet.",
        payload: null,
      }, { status: 200 });
    }

    return NextResponse.json({
      success: true,
      message: "Website details fetched successfully",
      payload: rows[0],
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to fetch website details",
      error: error.message,
    }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const auth = await isManager();
    if (!auth.success) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
    }

    const body = await req.json();

    const allowedFields = [
      'logo_url', 'theme_color', 'hero_title', 'hero_subtitle',
      'name', 'address', 'tagline', 'sociallink', 'email', 'phone'
    ];

    const updates = {};
    Object.keys(body).forEach(key => {
      if (allowedFields.includes(key)) {
        updates[key] = body[key];
      }
    });

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ success: false, message: "No valid fields provided for update" }, { status: 400 });
    }

    const { rows: existing } = await pool.query("SELECT website_id FROM restaurant_websites LIMIT 1");

    if (existing.length === 0) {
      // Insert new row if none exists
      const columns = Object.keys(updates);
      const values = Object.values(updates);
      
      const insertCols = columns.join(", ");
      const insertPlaceholders = columns.map((_, i) => `$${i + 1}`).join(", ");
      
      const insertQuery = `INSERT INTO restaurant_websites (${insertCols}) VALUES (${insertPlaceholders}) RETURNING *`;
      const { rows } = await pool.query(insertQuery, values);
      
      return NextResponse.json({
        success: true,
        message: "Website details initialized successfully",
        payload: rows[0],
      }, { status: 201 });
    }

    // Update existing row
    const columns = Object.keys(updates);
    const setClause = columns.map((col, idx) => `${col} = $${idx + 1}`).join(", ");
    const values = Object.values(updates);
    const query = `UPDATE restaurant_websites SET ${setClause}, updated_at = NOW() RETURNING *`;
    const { rows } = await pool.query(query, values);

    return NextResponse.json({
      success: true,
      message: "Website details updated successfully",
      payload: rows[0],
    }, { status: 200 });

  } catch (error) {
    console.error("Website Update Error:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to update website details",
      error: error.message,
    }, { status: 500 });
  }
}