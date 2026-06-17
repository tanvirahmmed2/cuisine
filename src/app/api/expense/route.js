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
      "SELECT e.*, u.name as creator_name FROM restaurant_expenses e LEFT JOIN restaurant_users u ON e.created_by = u.id ORDER BY e.created_at DESC"
    );

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
    const tenantCtx = await getTenantContext();
    if (!tenantCtx.success) return NextResponse.json(tenantCtx, { status: tenantCtx.status });
    const tenant_id = tenantCtx.payload.tenant_id;

    const auth = await isManager();
    if (!auth.success) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
    }

    const { title, note, amount } = await req.json();
    if (!title || !amount) {
      return NextResponse.json({ success: false, message: "Title and amount are required" }, { status: 400 });
    }

    const user = auth.payload;

    const { rows: newExpense } = await pool.query(
      "INSERT INTO restaurant_expenses (title, note, amount, created_by) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, note, amount, user.id]
    );

    return NextResponse.json({
      success: true,
      message: "Successfully created record",
      payload: newExpense[0],
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
      "SELECT id FROM restaurant_expenses WHERE id = $1 LIMIT 1",
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: "Expense record not found" }, { status: 404 });
    }

    await pool.query("DELETE FROM restaurant_expenses WHERE id = $1", [id]);

    return NextResponse.json({
      success: true,
      message: "Successfully deleted record",
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}