import { pool } from "@/lib/database/pg";
import { NextResponse } from "next/server";
import { isLogin, isManager, isSales } from "@/lib/auth/middleware";

export async function GET(req) {
  try {
    const auth = await isLogin();
    if (!auth.success) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
    }

    const { rows } = await pool.query("SELECT * FROM tables ORDER BY table_no ASC, id ASC");

    return NextResponse.json({
      success: true,
      message: "Successfully fetched tables",
      payload: rows,
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to fetch tables",
      error: error.message,
    }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const auth = await isManager();
    if (!auth.success) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
    }

    const { table_no, capacity, location, status } = await req.json();

    if (!table_no || !table_no.trim()) {
      return NextResponse.json({ success: false, message: "Table number is required" }, { status: 400 });
    }

    const cleanTableNo = table_no.trim();
    const tableCapacity = Number(capacity) > 0 ? Number(capacity) : 4;
    const tableLocation = location && location.trim() ? location.trim() : "Main Dining";
    const tableStatus = status && ['available', 'occupied', 'reserved', 'maintenance'].includes(status) ? status : 'available';

    const { rows: existing } = await pool.query("SELECT id FROM tables WHERE LOWER(table_no) = LOWER($1) LIMIT 1", [cleanTableNo]);
    if (existing.length > 0) {
      return NextResponse.json({ success: false, message: `Table ${cleanTableNo} already exists` }, { status: 400 });
    }

    const { rows } = await pool.query(
      `INSERT INTO tables (table_no, capacity, location, status) VALUES ($1, $2, $3, $4) RETURNING *`,
      [cleanTableNo, tableCapacity, tableLocation, tableStatus]
    );

    return NextResponse.json({
      success: true,
      message: "Successfully created table",
      payload: rows[0],
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to create table",
      error: error.message,
    }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const auth = await isLogin();
    if (!auth.success) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
    }

    const userRole = auth.payload.role;
    const isMgr = userRole === 'manager' || userRole === 'admin';
    const isSls = userRole === 'sales';

    if (!isMgr && !isSls) {
      return NextResponse.json({ success: false, message: "Unauthorized to update tables" }, { status: 401 });
    }

    const { id, table_no, capacity, location, status, is_active } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, message: "Table ID is required" }, { status: 400 });
    }

    const { rows: existingRows } = await pool.query("SELECT * FROM tables WHERE id = $1 LIMIT 1", [id]);
    if (existingRows.length === 0) {
      return NextResponse.json({ success: false, message: "Table not found" }, { status: 404 });
    }

    const currentTable = existingRows[0];

    const updatedTableNo = isMgr && table_no ? table_no.trim() : currentTable.table_no;
    const updatedCapacity = isMgr && capacity !== undefined ? Number(capacity) : currentTable.capacity;
    const updatedLocation = isMgr && location ? location.trim() : currentTable.location;
    const updatedStatus = status && ['available', 'occupied', 'reserved', 'maintenance'].includes(status) ? status : currentTable.status;
    const updatedIsActive = isMgr && is_active !== undefined ? Boolean(is_active) : currentTable.is_active;

    if (isMgr && updatedTableNo.toLowerCase() !== currentTable.table_no.toLowerCase()) {
      const { rows: dupCheck } = await pool.query("SELECT id FROM tables WHERE LOWER(table_no) = LOWER($1) AND id != $2 LIMIT 1", [updatedTableNo, id]);
      if (dupCheck.length > 0) {
        return NextResponse.json({ success: false, message: `Table number ${updatedTableNo} already exists` }, { status: 400 });
      }
    }

    const { rows } = await pool.query(
      `UPDATE tables 
       SET table_no = $1, capacity = $2, location = $3, status = $4, is_active = $5, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $6 RETURNING *`,
      [updatedTableNo, updatedCapacity, updatedLocation, updatedStatus, updatedIsActive, id]
    );

    return NextResponse.json({
      success: true,
      message: "Successfully updated table",
      payload: rows[0],
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to update table",
      error: error.message,
    }, { status: 500 });
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
      return NextResponse.json({ success: false, message: "Table ID is required" }, { status: 400 });
    }

    const { rows } = await pool.query("SELECT * FROM tables WHERE id = $1 LIMIT 1", [id]);
    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: "Table not found" }, { status: 404 });
    }

    await pool.query("DELETE FROM tables WHERE id = $1", [id]);

    return NextResponse.json({
      success: true,
      message: "Successfully deleted table",
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to delete table",
      error: error.message,
    }, { status: 500 });
  }
}
