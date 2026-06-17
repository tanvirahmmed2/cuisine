import { getTenantContext } from "@/lib/tenant/helper";
import { pool } from "@/lib/database/pg";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth/middleware";

export async function GET(req) {
  try {
    const tenantCtx = await getTenantContext();
    if (!tenantCtx.success) return NextResponse.json(tenantCtx, { status: tenantCtx.status });
    const tenant_id = tenantCtx.payload.tenant_id;

    const { rows } = await pool.query(
      "SELECT * FROM website LIMIT 1"
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Website not configured yet", data: null },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: rows[0],
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  try {
    const tenantCtx = await getTenantContext();
    if (!tenantCtx.success) return NextResponse.json(tenantCtx, { status: tenantCtx.status });
    const tenant_id = tenantCtx.payload.tenant_id;

    const auth = await isAdmin();
    if (!auth.success) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
    }

    const body = await req.json();

    const { rows } = await pool.query(
      "SELECT id FROM website LIMIT 1"
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Website profile not found" },
        { status: 404 }
      );
    }

    const website_id = rows[0].id;

    const allowedFields = [
      'name', 'business_name', 'logo', 'favicon',
      'email', 'phone', 'address', 'city', 'country', 'meta_title', 'meta_description',
      'facebook', 'instagram', 'linkedin', 'youtube', 'primary_color', 'secondary_color'
    ];

    const updates = {};
    Object.keys(body).forEach(key => {
      if (allowedFields.includes(key)) {
        updates[key] = body[key];
      }
    });

    const fields = Object.keys(updates);
    const values = Object.values(updates);

    if (fields.length === 0) {
      return NextResponse.json(
        { success: false, message: "No data to update" },
        { status: 400 }
      );
    }

    const setQuery = fields
      .map((field, i) => `${field} = $${i + 1}`)
      .join(", ");

    const updateQuery = `
      UPDATE website
      SET ${setQuery}, updated_at = now()
      WHERE id = $${fields.length + 1}
      RETURNING *
    `;

    const updated = await pool.query(updateQuery, [
      ...values,
      website_id,
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "Website updated successfully",
        data: updated.rows[0],
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}