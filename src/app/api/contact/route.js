
import { pool } from "@/lib/database/pg";
import { NextResponse } from "next/server";
import { isManager } from "@/lib/auth/middleware";

export async function GET(req) {
  try {
    

    const auth = await isManager();
    if (!auth.success) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
    }

    const { rows } = await pool.query("SELECT * FROM restaurant_contact_tickets ORDER BY created_at DESC");

    return NextResponse.json({
      success: true,
      message: "Successfully fetched contact data",
      payload: rows,
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    

    const { name, email, subject, message } = await req.json();
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ success: false, message: "Please fill all information" }, { status: 400 });
    }

    const { rows: newContact } = await pool.query("INSERT INTO restaurant_contact_tickets (name, email, subject, message) VALUES ($1, $2, $3, $4) RETURNING *", [name, email, subject, message]);

    return NextResponse.json({
      success: true,
      message: "Placed contact message. Wait for response",
      payload: newContact[0],
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

    const { rows } = await pool.query("SELECT id FROM restaurant_contact_tickets WHERE id = $1 LIMIT 1", [id]);

    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: "Contact data not found" }, { status: 404 });
    }

    await pool.query("DELETE FROM restaurant_contact_tickets WHERE id = $1", [id]);

    return NextResponse.json({
      success: true,
      message: "Successfully deleted contact data",
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
