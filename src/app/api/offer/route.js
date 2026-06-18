import { getTenantContext } from "@/lib/tenant/helper";
import cloudinary from "@/lib/database/cloudinary";
import { pool } from "@/lib/database/pg";
import { NextResponse } from "next/server";
import { isManager } from "@/lib/auth/middleware";

export async function GET(req) {
  try {
    const tenantCtx = await getTenantContext();
    if (!tenantCtx.success) return NextResponse.json(tenantCtx, { status: tenantCtx.status });
    const tenant_id = tenantCtx.payload.tenant_id;

    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get('active') === 'true';

    let query = "SELECT * FROM restaurant_offers WHERE tenant_id = $1";
    let params = [tenant_id];

    if (activeOnly) {
      query += " AND is_active = true AND (end_date IS NULL OR end_date >= CURRENT_TIMESTAMP)";
    }
    
    query += " ORDER BY created_at DESC";

    const { rows } = await pool.query(query, params);

    return NextResponse.json({
      success: true,
      message: "Successfully fetched offers",
      payload: rows,
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const tenantCtx = await getTenantContext();
    if (!tenantCtx.success) return NextResponse.json(tenantCtx, { status: tenantCtx.status });
    const tenant_id = tenantCtx.payload.tenant_id;

    const auth = await isManager();
    if (!auth.success) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
    }

    const formData = await req.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const is_active = formData.get("is_active") === 'true';
    const start_date = formData.get("start_date") || null;
    const end_date = formData.get("end_date") || null;

    if (!title) {
      return NextResponse.json({ success: false, message: "Title is required" }, { status: 400 });
    }

    const imageFile = formData.get("image");
    if (!imageFile) {
      return NextResponse.json({ success: false, message: "Please upload an offer image" }, { status: 400 });
    }

    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());

    const cloudImage = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "res-offers",
          use_filename: true,
          unique_filename: true
        },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
      stream.end(imageBuffer);
    });

    const { rows: newOffer } = await pool.query(
      "INSERT INTO restaurant_offers (tenant_id, title, description, image, image_id, is_active, start_date, end_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [tenant_id, title, description, cloudImage.secure_url, cloudImage.public_id, is_active, start_date, end_date]
    );

    return NextResponse.json({
      success: true,
      message: "Successfully created offer",
      payload: newOffer[0],
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const tenantCtx = await getTenantContext();
    if (!tenantCtx.success) return NextResponse.json(tenantCtx, { status: tenantCtx.status });
    const tenant_id = tenantCtx.payload.tenant_id;

    const auth = await isManager();
    if (!auth.success) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
    }

    const formData = await req.formData();
    const id = formData.get("id");
    const title = formData.get("title");
    const description = formData.get("description");
    const is_active = formData.get("is_active") === 'true';
    const start_date = formData.get("start_date") || null;
    const end_date = formData.get("end_date") || null;

    if (!id || !title) {
      return NextResponse.json({ success: false, message: "ID and Title are required" }, { status: 400 });
    }

    const imageFile = formData.get("image");
    
    let query = "UPDATE restaurant_offers SET title = $1, description = $2, is_active = $3, start_date = $4, end_date = $5";
    let params = [title, description, is_active, start_date, end_date];
    let paramIndex = 6;

    if (imageFile && imageFile.name && imageFile.size > 0) {
      const { rows } = await pool.query("SELECT image_id FROM restaurant_offers WHERE id = $1 AND tenant_id = $2", [id, tenant_id]);
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
            folder: "res-offers",
            use_filename: true,
            unique_filename: true
          },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
        stream.end(imageBuffer);
      });

      query += `, image = $${paramIndex}, image_id = $${paramIndex + 1}`;
      params.push(cloudImage.secure_url, cloudImage.public_id);
      paramIndex += 2;
    }

    query += ` WHERE id = $${paramIndex} AND tenant_id = $${paramIndex + 1} RETURNING *`;
    params.push(id, tenant_id);

    const { rows: updatedOffer } = await pool.query(query, params);

    return NextResponse.json({ success: true, message: "Successfully updated offer", payload: updatedOffer[0] }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const tenantCtx = await getTenantContext();
    if (!tenantCtx.success) return NextResponse.json(tenantCtx, { status: tenantCtx.status });
    const tenant_id = tenantCtx.payload.tenant_id;

    const auth = await isManager();
    if (!auth.success) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, message: "Id not found" }, { status: 400 });
    }

    const { rows } = await pool.query(
      "SELECT * FROM restaurant_offers WHERE id = $1 AND tenant_id = $2 LIMIT 1",
      [id, tenant_id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: "Offer not found" }, { status: 404 });
    }

    const offer = rows[0];

    if (offer.image_id) {
      await cloudinary.uploader.destroy(offer.image_id);
    }

    await pool.query("DELETE FROM restaurant_offers WHERE id = $1 AND tenant_id = $2", [id, tenant_id]);

    return NextResponse.json({
      success: true,
      message: "Successfully deleted offer",
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
