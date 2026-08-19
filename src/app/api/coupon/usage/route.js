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

    const { rows: usages } = await pool.query(
      `SELECT 
        oc.id as usage_id,
        oc.order_id,
        oc.coupon_id,
        oc.code as coupon_code,
        oc.discount_amount,
        oc.created_at as used_at,
        c.title as coupon_title,
        c.is_percentage,
        c.discount as coupon_discount_val,
        c.min_bill,
        o.name as customer_name,
        o.phone as customer_phone,
        o.sub_total,
        o.total_price,
        o.payment_status,
        o.status as order_status,
        o.created_at as order_created_at
      FROM order_coupons oc
      LEFT JOIN coupons c ON (oc.coupon_id = c.id OR UPPER(oc.code) = UPPER(c.code))
      LEFT JOIN orders o ON oc.order_id = o.id
      ORDER BY oc.created_at DESC`
    );

    // Calculate aggregated metrics
    const totalUsages = usages.length;
    const totalSavings = usages.reduce((sum, u) => sum + (Number(u.discount_amount) || 0), 0);
    
    // Top used coupons summary
    const couponMap = {};
    usages.forEach(u => {
      const code = (u.coupon_code || "UNKNOWN").toUpperCase();
      if (!couponMap[code]) {
        couponMap[code] = {
          code: code,
          title: u.coupon_title || code,
          usage_count: 0,
          total_discount: 0
        };
      }
      couponMap[code].usage_count += 1;
      couponMap[code].total_discount += Number(u.discount_amount) || 0;
    });

    const topCoupons = Object.values(couponMap).sort((a, b) => b.usage_count - a.usage_count);

    return NextResponse.json({
      success: true,
      message: "Successfully fetched coupon usages",
      payload: {
        usages,
        stats: {
          total_usages: totalUsages,
          total_savings: totalSavings,
          unique_coupons_used: Object.keys(couponMap).length,
          avg_discount_per_order: totalUsages > 0 ? (totalSavings / totalUsages) : 0
        },
        top_coupons: topCoupons
      }
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to fetch coupon usages",
      error: error.message
    }, { status: 500 });
  }
}
