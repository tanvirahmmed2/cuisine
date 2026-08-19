import { pool } from "@/lib/database/pg";
import { NextResponse } from "next/server";
import { isManager } from "@/lib/auth/middleware";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const activeOnly = searchParams.get("active") === "true";

    if (code) {
      const { rows } = await pool.query(
        "SELECT * FROM coupons WHERE UPPER(code) = UPPER($1) LIMIT 1",
        [code.trim()]
      );
      if (rows.length === 0) {
        return NextResponse.json({ success: false, message: "Coupon code not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, payload: rows[0] }, { status: 200 });
    }

    let query = "SELECT * FROM coupons";
    let params = [];

    if (activeOnly) {
      query += " WHERE is_active = true AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP) AND (start_at IS NULL OR start_at <= CURRENT_TIMESTAMP)";
    }

    query += " ORDER BY created_at DESC";

    const { rows } = await pool.query(query, params);

    return NextResponse.json({
      success: true,
      message: "Coupons fetched successfully",
      payload: rows,
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to fetch coupons",
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
    const {
      title,
      code,
      discount = 0,
      is_percentage = true,
      min_bill = 0,
      start_at = null,
      expires_at = null,
      is_active = true
    } = body;

    if (!title?.trim() || !code?.trim()) {
      return NextResponse.json({
        success: false,
        message: "Title and Coupon Code are required"
      }, { status: 400 });
    }

    const formattedCode = code.trim().toUpperCase();

    // Check unique code
    const { rows: existing } = await pool.query(
      "SELECT id FROM coupons WHERE UPPER(code) = $1 LIMIT 1",
      [formattedCode]
    );

    if (existing.length > 0) {
      return NextResponse.json({
        success: false,
        message: `Coupon code '${formattedCode}' already exists`
      }, { status: 400 });
    }

    const { rows: newCoupon } = await pool.query(
      `INSERT INTO coupons (
        title, code, discount, is_percentage, min_bill, start_at, expires_at, is_active, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP) RETURNING *`,
      [
        title.trim(),
        formattedCode,
        Number(discount) || 0,
        Boolean(is_percentage),
        Number(min_bill) || 0,
        start_at ? new Date(start_at) : new Date(),
        expires_at ? new Date(expires_at) : null,
        is_active !== undefined ? Boolean(is_active) : true
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Coupon created successfully",
      payload: newCoupon[0]
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to create coupon",
      error: error.message
    }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const auth = await isManager();
    if (!auth.success) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
    }

    const body = await req.json();
    const {
      id,
      title,
      code,
      discount = 0,
      is_percentage = true,
      min_bill = 0,
      start_at = null,
      expires_at = null,
      is_active = true
    } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "Coupon ID is required" }, { status: 400 });
    }

    if (!title?.trim() || !code?.trim()) {
      return NextResponse.json({ success: false, message: "Title and Coupon Code are required" }, { status: 400 });
    }

    const formattedCode = code.trim().toUpperCase();

    // Check code collision with other coupons
    const { rows: collision } = await pool.query(
      "SELECT id FROM coupons WHERE UPPER(code) = $1 AND id != $2 LIMIT 1",
      [formattedCode, id]
    );

    if (collision.length > 0) {
      return NextResponse.json({
        success: false,
        message: `Coupon code '${formattedCode}' is already used by another coupon`
      }, { status: 400 });
    }

    const { rows: updated } = await pool.query(
      `UPDATE coupons SET
        title = $1,
        code = $2,
        discount = $3,
        is_percentage = $4,
        min_bill = $5,
        start_at = $6,
        expires_at = $7,
        is_active = $8,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $9 RETURNING *`,
      [
        title.trim(),
        formattedCode,
        Number(discount) || 0,
        Boolean(is_percentage),
        Number(min_bill) || 0,
        start_at ? new Date(start_at) : new Date(),
        expires_at ? new Date(expires_at) : null,
        Boolean(is_active),
        id
      ]
    );

    if (updated.length === 0) {
      return NextResponse.json({ success: false, message: "Coupon not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Coupon updated successfully",
      payload: updated[0]
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to update coupon",
      error: error.message
    }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const auth = await isManager();
    if (!auth.success) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
    }

    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "Coupon ID is required" }, { status: 400 });
    }

    const { rows } = await pool.query("DELETE FROM coupons WHERE id = $1 RETURNING id", [id]);

    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: "Coupon not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Coupon deleted successfully",
      payload: { id }
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to delete coupon",
      error: error.message
    }, { status: 500 });
  }
}
