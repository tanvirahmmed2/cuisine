
import { pool } from "@/lib/database/pg";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    

    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({
        success: false,
        message: "Slug not found",
      }, { status: 400 });
    }

    const { rows: productRows } = await pool.query("SELECT p.*, c.name as category_name FROM restaurant_items p LEFT JOIN restaurant_categories c ON p.category_id = c.id WHERE p.slug = $1 LIMIT 1", [slug]);

    if (productRows.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No product found with this slug",
      }, { status: 404 });
    }

    const product = productRows[0];

    // Fetch variants
    const { rows: variantRows } = await pool.query("SELECT * FROM restaurant_item_variants WHERE item_id = $1 ORDER BY created_at ASC", [product.id]);

    return NextResponse.json({
      success: true,
      message: "Product data found successfully",
      payload: { ...product, variants: variantRows },
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to fetch data",
      error: error.message,
    }, { status: 500 });
  }
}
