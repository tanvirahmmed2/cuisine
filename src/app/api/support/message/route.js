
import { pool } from "@/lib/database/pg";
import { NextResponse } from "next/server";
import { isLogin } from "@/lib/auth/middleware";

export async function GET(req) {
  try {
    

    const auth = await isLogin();
    if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
    const user = auth.payload;

    const { searchParams } = new URL(req.url);
    const ticket_id = searchParams.get('ticket_id');

    if (!ticket_id) {
      return NextResponse.json({ success: false, message: "Ticket ID is required" }, { status: 400 });
    }

    // Verify ownership or manager
    const isMgr = user.role === 'manager' || user.role === 'admin';
    const { rows: ticketCheck } = await pool.query("SELECT user_id FROM restaurant_support_tickets WHERE id = $1 LIMIT 1", [ticket_id]);

    if (ticketCheck.length === 0) {
      return NextResponse.json({ success: false, message: "Ticket not found" }, { status: 404 });
    }

    if (!isMgr && ticketCheck[0].user_id !== user.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const { rows } = await pool.query("SELECT * FROM restaurant_support_messages WHERE ticket_id = $1 ORDER BY created_at ASC", [ticket_id]);

    return NextResponse.json({
      success: true,
      message: "Successfully fetched messages",
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

    const { ticket_id, message } = await req.json();

    if (!ticket_id || !message) {
      return NextResponse.json({ success: false, message: "Ticket ID and message are required" }, { status: 400 });
    }

    const isMgr = user.role === 'manager' || user.role === 'admin';
    
    // Verify ownership or manager
    const { rows: ticketCheck } = await pool.query("SELECT user_id FROM restaurant_support_tickets WHERE id = $1 LIMIT 1", [ticket_id]);

    if (ticketCheck.length === 0) {
      return NextResponse.json({ success: false, message: "Ticket not found" }, { status: 404 });
    }

    if (!isMgr && ticketCheck[0].user_id !== user.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const senderType = isMgr ? 'manager' : 'user';

      const { rows: msgRows } = await client.query(
        "INSERT INTO restaurant_support_messages (ticket_id, sender_type, sender_id, message) VALUES ($1, $2, $3, $4) RETURNING *", [ticket_id, senderType, user.id, message]);

      // Update ticket timestamp
      await client.query("UPDATE restaurant_support_tickets SET updated_at = CURRENT_TIMESTAMP WHERE id = $1", [ticket_id]);

      await client.query("COMMIT");

      return NextResponse.json({
        success: true,
        message: "Message sent",
        payload: msgRows[0],
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
