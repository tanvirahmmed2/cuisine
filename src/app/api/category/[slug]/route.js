
import { pool } from "@/lib/database/pg";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    

    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ success: false, message: "Slug not found" }, { status: 400 });
    }

    // Find category by slug
    const { rows: catRows } = await pool.query("SELECT id, name, slug FROM restaurant_categories WHERE slug ILIKE $1 LIMIT 1", [slug]);

    if (catRows.length === 0) {
      return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });
    }

    const categoryId = catRows[0].id;

    // Fetch products for this category
    const { rows: products } = await pool.query(`SELECT i.*, c.name as category_name, c.slug as category_slug 
       FROM restaurant_items i
       JOIN restaurant_categories c ON i.category_id = c.id
       WHERE i.category_id = $1
       ORDER BY i.created_at DESC`, [categoryId]);

    return NextResponse.json({
      success: true,
      message: "Successfully fetched category products",
      payload: products,
    }, { status: 200 });

  } catch (error) {
    console.error("Category slug error:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch category products",
      error: error.message,
    }, { status: 500 });
  }
}