import { pool } from "@/lib/database/pg";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { code, total_price, user_id } = await req.json();

    if (!code?.trim()) {
      return NextResponse.json({ success: false, message: "Please enter a coupon code" }, { status: 400 });
    }

    const bill = Number(total_price) || 0;
    const formattedCode = code.trim().toUpperCase();

    // 1. Fetch coupon by code
    const { rows } = await pool.query(
      "SELECT * FROM coupons WHERE UPPER(code) = $1 LIMIT 1",
      [formattedCode]
    );

    if (rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: `Coupon code '${formattedCode}' not found`
      }, { status: 400 });
    }

    const coupon = rows[0];
    const now = new Date();

    // 2. Check active status
    if (!coupon.is_active) {
      return NextResponse.json({
        success: false,
        message: `Coupon '${coupon.code}' is currently inactive`
      }, { status: 400 });
    }

    // 3. Check start date
    if (coupon.start_at && new Date(coupon.start_at) > now) {
      const startDate = new Date(coupon.start_at).toLocaleDateString();
      return NextResponse.json({
        success: false,
        message: `Coupon '${coupon.code}' will become active on ${startDate}`
      }, { status: 400 });
    }

    // 4. Check expiration date
    if (coupon.expires_at && new Date(coupon.expires_at) <= now) {
      const expireDate = new Date(coupon.expires_at).toLocaleDateString();
      return NextResponse.json({
        success: false,
        message: `Coupon '${coupon.code}' expired on ${expireDate}`
      }, { status: 400 });
    }

    // 5. Check minimum bill requirement
    if (coupon.min_bill && bill < Number(coupon.min_bill)) {
      return NextResponse.json({
        success: false,
        message: `Minimum bill of ৳${Number(coupon.min_bill).toLocaleString()} required to use coupon '${coupon.code}'`
      }, { status: 400 });
    }

    // 6. Calculate discount amount
    let discountAmount = 0;
    if (coupon.is_percentage) {
      discountAmount = (bill * Number(coupon.discount)) / 100;
    } else {
      discountAmount = Number(coupon.discount);
    }

    if (discountAmount > bill) {
      discountAmount = bill;
    }

    const newTotal = Math.max(0, bill - discountAmount);

    return NextResponse.json({
      success: true,
      message: `Coupon '${coupon.code}' applied successfully!`,
      payload: {
        coupon_id: coupon.id,
        code: coupon.code,
        title: coupon.title,
        is_percentage: coupon.is_percentage,
        discount_rate: Number(coupon.discount),
        discount_amount: Number(discountAmount.toFixed(2)),
        original_price: bill,
        final_price: Number(newTotal.toFixed(2))
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Coupon apply error:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to apply coupon",
      error: error.message
    }, { status: 500 });
  }
}
