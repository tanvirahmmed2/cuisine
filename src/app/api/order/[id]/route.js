
import { pool } from "@/lib/database/pg";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, message: "Order ID is required" }, { status: 400 });
    }

    // Fetch order details
    const { rows: orderRows } = await pool.query("SELECT * FROM orders WHERE id = $1 LIMIT 1", [id]);

    if (orderRows.length === 0) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    const order = orderRows[0];

    // Fetch order items
    const { rows: itemRows } = await pool.query("SELECT * FROM order_items WHERE order_id = $1", [id]);

    // Fetch variants for all items in this order
    const itemIds = itemRows.map(item => item.id);
    let variantsMap = {};
    
    if (itemIds.length > 0) {
      const { rows: variantRows } = await pool.query("SELECT * FROM order_item_variants WHERE order_item_id = ANY($1)", [itemIds]);
      
      variantRows.forEach(v => {
        if (!variantsMap[v.order_item_id]) variantsMap[v.order_item_id] = [];
        variantsMap[v.order_item_id].push(v);
      });
    }

    order.items = itemRows.map(item => ({
      ...item,
      variants: variantsMap[item.id] || []
    }));

    // Fetch applied coupon if any
    try {
      const { rows: couponRows } = await pool.query(
        "SELECT oc.*, c.title as coupon_title, c.is_percentage, c.discount as coupon_rate FROM order_coupons oc LEFT JOIN coupons c ON oc.coupon_id = c.id WHERE oc.order_id = $1 LIMIT 1",
        [id]
      );
      order.coupon = couponRows.length > 0 ? couponRows[0] : null;
    } catch (cErr) {
      order.coupon = null;
    }

    return NextResponse.json({
      success: true,
      message: "Successfully fetched order details",
      payload: order,
    }, { status: 200 });

  } catch (error) {
    console.error("Order detail error:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch order details",
      error: error.message,
    }, { status: 500 });
  }
}