
import { pool } from "@/lib/database/pg";
import { NextResponse } from "next/server";
import slugify from "slugify";
import { isManager } from "@/lib/auth/middleware";

export async function POST(req) {
  try {
    

    const auth = await isManager();
    if (!auth.success) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
    }

    const { title, description, price, discount, id, variants } = await req.json();

    if (!title || !description || !price || !id) {
      return NextResponse.json({
        success: false,
        message: "Please fill all required data (title, description, price, id)",
      }, { status: 400 });
    }

    const { rows } = await pool.query("SELECT id FROM restaurant_items WHERE id = $1", [id]);

    if (rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Product not found",
      }, { status: 404 });
    }

    const newSlug = slugify(title, { lower: true, strict: true });

    // Update item info
    await pool.query(`UPDATE restaurant_items 
       SET title = $1, slug = $2, description = $3, price = $4, discount = $5, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $6`, [title, newSlug, description, price, discount || 0, id]);

    // Sync variants: Delete existing and re-insert
    await pool.query("DELETE FROM restaurant_item_variants WHERE item_id = $1", [id]);

    if (Array.isArray(variants) && variants.length > 0) {
      for (const variant of variants) {
        await pool.query("INSERT INTO restaurant_item_variants (item_id, name, value, price_adjustment, is_default) VALUES ($1, $2, $3, $4, $5)", [id, variant.name, variant.value, Number(variant.price_adjustment) || 0, variant.is_default || false]);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Successfully updated product and variants",
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    }, { status: 500 });
  }
}