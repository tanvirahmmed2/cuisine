import { pool } from "@/lib/database/pg";
import { NextResponse } from "next/server";
import { isLogin, isManager } from "@/lib/auth/middleware";

export async function GET(req) {
  try {
    const auth = await isLogin();
    if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
    const user = auth.payload;

    const isMgr = user.role === 'manager' || user.role === 'admin';

    let query = `
      SELECT t.*, u.name as user_name, u.email as user_email
      FROM restaurant_support_tickets t
      LEFT JOIN restaurant_users u ON t.user_id = u.id
    `;
    let params = [];

    if (!isMgr) {
      query += ` WHERE t.user_id = $1`;
      params.push(user.id);
    }

    query += ` ORDER BY t.updated_at DESC`;

    const { rows } = await pool.query(query, params);

    return NextResponse.json({
      success: true,
      message: "Successfully fetched tickets",
      payload: rows,
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const auth = await isLogin();
    if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
    const user = auth.payload;

    const { subject, initial_message } = await req.json();
    
    if (!subject || !initial_message) {
      return NextResponse.json({ success: false, message: "Subject and initial message are required" }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Insert Ticket
      const { rows: ticketRows } = await client.query(
        "INSERT INTO restaurant_support_tickets (user_id, subject, status) VALUES ($1, $2, $3) RETURNING *", 
        [user.id, subject, 'open']
      );
      const ticket = ticketRows[0];

      // Insert Initial Message
      await client.query(
        "INSERT INTO restaurant_support_messages (ticket_id, sender_type, sender_id, message) VALUES ($1, $2, $3, $4)", 
        [ticket.id, 'user', user.id, initial_message]
      );

      await client.query("COMMIT");

      return NextResponse.json({
        success: true,
        message: "Ticket created successfully",
        payload: ticket,
      }, { status: 201 });
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const auth = await isManager();
    if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const { rows } = await pool.query(
      "UPDATE restaurant_support_tickets SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *", 
      [status, id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: "Ticket not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Ticket status updated",
      payload: rows[0],
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
