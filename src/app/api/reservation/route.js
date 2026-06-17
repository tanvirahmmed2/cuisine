import { getTenantContext } from "@/lib/tenant/helper";
import { pool } from "@/lib/database/pg";
import { NextResponse } from "next/server";
import { isManager } from "@/lib/auth/middleware";

export async function GET(req) {
  try {
    const tenantCtx = await getTenantContext();
    if (!tenantCtx.success) return NextResponse.json(tenantCtx, { status: tenantCtx.status });
    const tenant_id = tenantCtx.payload.tenant_id;

    const auth = await isManager();
    if (!auth.success) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
    }

    const { rows } = await pool.query(
      "SELECT * FROM restaurant_reservations ORDER BY res_date DESC"
    );

    return NextResponse.json({
      success: true,
      message: "Successfully fetched reservation data",
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

    const { name, email, date, table, member, message } = await req.json();
    if (!name || !email || !date || !member || !table) {
      return NextResponse.json({ success: false, message: "Please fill all information" }, { status: 400 });
    }

    const { rows: newRes } = await pool.query(
      `INSERT INTO restaurant_reservations (name, email, res_date, member_count, table_no, message) 
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, email, date, member, table, message || ""]
    );

    return NextResponse.json({
      success: true,
      message: "Placed reservation. Wait for confirmation",
      payload: newRes[0],
    }, { status: 201 });

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
      "SELECT id FROM restaurant_reservations WHERE id = $1 LIMIT 1",
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: "Reservation not found" }, { status: 404 });
    }

    await pool.query("DELETE FROM restaurant_reservations WHERE id = $1", [id]);

    return NextResponse.json({
      success: true,
      message: "Successfully deleted reservation data",
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}