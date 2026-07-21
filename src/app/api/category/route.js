
import cloudinary from "@/lib/database/cloudinary";
import { pool } from "@/lib/database/pg";
import { NextResponse } from "next/server";
import slugify from "slugify";
import { isManager } from "@/lib/auth/middleware";

export async function GET(req) {
  try {
    

    const { rows } = await pool.query("SELECT * FROM restaurant_categories ORDER BY created_at DESC");

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
    

    const auth = await isManager();
    if (!auth.success) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
    }

    const formData = await req.formData();
    const name = formData.get("name");

    if (!name) {
      return NextResponse.json({ success: false, message: "Name is required" }, { status: 400 });
    }

    const slug = slugify(name, { lower: true, strict: true });

    // Check if category exists
    const { rows: existingCat } = await pool.query("SELECT id FROM restaurant_categories WHERE slug = $1 LIMIT 1", [slug]);

    if (existingCat.length > 0) {
      return NextResponse.json({ success: false, message: "Category already exists" }, { status: 400 });
    }

    const imageFile = formData.get("image");
    if (!imageFile) {
      return NextResponse.json({ success: false, message: "Please upload cover image" }, { status: 400 });
    }

    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());

    const cloudImage = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "res-items",
          public_id: slug,
          use_filename: true,
          unique_filename: false
        },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
      stream.end(imageBuffer);
    });

    const { rows: newCat } = await pool.query("INSERT INTO restaurant_categories (name, slug, image, image_id) VALUES ($1, $2, $3, $4) RETURNING *", [name, slug, cloudImage.secure_url, cloudImage.public_id]);

    return NextResponse.json({
      success: true,
      message: "Successfully created category",
      payload: newCat[0],
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

    const { rows } = await pool.query("SELECT * FROM restaurant_categories WHERE id = $1 LIMIT 1", [id]);

    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });
    }

    const cat = rows[0];

    if (cat.image_id) {
      await cloudinary.uploader.destroy(cat.image_id);
    }

    await pool.query("DELETE FROM restaurant_categories WHERE id = $1", [id]);

    return NextResponse.json({
      success: true,
      message: "Successfully deleted category",
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    

    const auth = await isManager();
    if (!auth.success) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
    }

    const formData = await req.formData();
    const id = formData.get("id");
    const name = formData.get("name");

    if (!id || !name) {
      return NextResponse.json({ success: false, message: "ID and Name are required" }, { status: 400 });
    }

    const slug = slugify(name, { lower: true, strict: true });

    const { rows: existingCat } = await pool.query("SELECT id FROM restaurant_categories WHERE slug = $1 AND id != $2 LIMIT 1", [slug, id]);

    if (existingCat.length > 0) {
      return NextResponse.json({ success: false, message: "Category with this name already exists" }, { status: 400 });
    }

    const imageFile = formData.get("image");
    
    if (imageFile && imageFile.name && imageFile.size > 0) {
      const { rows } = await pool.query("SELECT image_id FROM restaurant_categories WHERE id = $1", [id]);
      if (rows.length > 0 && rows[0].image_id) {
        try {
          await cloudinary.uploader.destroy(rows[0].image_id);
        } catch (e) {
          console.error("Failed to delete old image", e);
        }
      }

      const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
      const cloudImage = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "res-items",
            public_id: slug + "-" + Date.now(),
            use_filename: true,
            unique_filename: false
          },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
        stream.end(imageBuffer);
      });

      const { rows: updatedCat } = await pool.query("UPDATE restaurant_categories SET name = $1, slug = $2, image = $3, image_id = $4 WHERE id = $5 RETURNING *", [name, slug, cloudImage.secure_url, cloudImage.public_id, id]);

      return NextResponse.json({ success: true, message: "Successfully updated category", payload: updatedCat[0] }, { status: 200 });
    } else {
      const { rows: updatedCat } = await pool.query("UPDATE restaurant_categories SET name = $1, slug = $2 WHERE id = $3 RETURNING *", [name, slug, id]);

      return NextResponse.json({ success: true, message: "Successfully updated category", payload: updatedCat[0] }, { status: 200 });
    }

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}