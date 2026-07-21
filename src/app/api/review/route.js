
import { pool } from "@/lib/database/pg";
import { NextResponse } from "next/server";
import { isManager } from "@/lib/auth/middleware";

export async function GET(req) {
  try {
    

    const { rows } = await pool.query("SELECT * FROM restaurant_reviews ORDER BY id DESC");

    return NextResponse.json({
      success: true,
      message: "Successfully fetched data",
      payload: rows,
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    

    const { name, email, comment, rating } = await req.json();
    if (!name || !email || !comment || !rating) {
      return NextResponse.json({ success: false, message: "Please provide all information" }, { status: 400 });
    }

    // Enforce one review per email
    const { rows: existing } = await pool.query("SELECT id FROM restaurant_reviews WHERE email = $1 LIMIT 1", [email]);

    if (existing.length > 0) {
      return NextResponse.json({ success: false, message: "Review already submitted with this email" }, { status: 400 });
    }

    const { rows: newReview } = await pool.query("INSERT INTO restaurant_reviews (name, email, comment, rating) VALUES ($1, $2, $3, $4) RETURNING *", [name, email, comment, rating]);

    return NextResponse.json({
      success: true,
      message: "Successfully submitted review",
      payload: newReview[0],
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    

    const auth = await isManager();
    if (!auth.success) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, message: "Id not found" }, { status: 400 });
    }

    const { rows } = await pool.query("SELECT id FROM restaurant_reviews WHERE id = $1 LIMIT 1", [id]);

    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: "Review not found" }, { status: 404 });
    }

    await pool.query("DELETE FROM restaurant_reviews WHERE id = $1", [id]);

    return NextResponse.json({
      success: true,
      message: "Successfully deleted review",
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
