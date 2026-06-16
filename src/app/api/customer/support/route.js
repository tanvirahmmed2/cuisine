import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isLogin } from '@/lib/middleware';

export async function GET(request) {
  try {
    const auth = await isLogin();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });
    const userId = auth.data.user_id;
    if (!userId) return NextResponse.json({ success: false, message: 'User not found' }, { status: 400 });

    const { searchParams } = new URL(request.url);
    const ticketId = searchParams.get('ticketId');

    if (ticketId) {
        const [ticketRes, repliesRes] = await Promise.all([
            query("SELECT * FROM ress_support_tickets WHERE ticket_id = $1 AND user_id = $2", [ticketId, userId]),
            query(`
              SELECT r.*, u.name as user_name 
              FROM ress_support_replies r 
              LEFT JOIN ress_users u ON r.user_id = u.user_id 
              WHERE r.ticket_id = $1 
              ORDER BY r.created_at ASC
            `, [ticketId])
        ]);
        if (ticketRes.rows.length === 0) return NextResponse.json({ success: false, message: 'Ticket not found' }, { status: 404 });
        return NextResponse.json({ success: true, ticket: ticketRes.rows[0], replies: repliesRes.rows });
    }

    const res = await query(`
      SELECT 
        t.*,
        (SELECT COUNT(*) FROM ress_support_replies r WHERE r.ticket_id = t.ticket_id) as reply_count
      FROM ress_support_tickets t 
      WHERE t.user_id = $1 
      ORDER BY t.created_at DESC
    `, [userId]);
    return NextResponse.json({ success: true, data: { tickets: res.rows } });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const auth = await isLogin();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });
    const userId = auth.data.user_id;
    if (!userId) return NextResponse.json({ success: false, message: 'User not found' }, { status: 400 });
    
    const { subject, message, priority, ticket_id, reply_message } = await request.json();

    // If it's a reply
    if (ticket_id && reply_message) {
      // verify ownership
      const check = await query("SELECT ticket_id FROM ress_support_tickets WHERE ticket_id = $1 AND user_id = $2", [ticket_id, userId]);
      if (check.rows.length === 0) return NextResponse.json({ success: false, message: 'Access denied' }, { status: 403 });

      await query(
        "INSERT INTO ress_support_replies (ticket_id, user_id, is_admin, message) VALUES ($1, $2, false, $3)",
        [ticket_id, auth.data.user_id, reply_message]
      );
      // optionally reopen ticket if closed
      await query("UPDATE ress_support_tickets SET status = 'open', updated_at = NOW() WHERE ticket_id = $1 AND status = 'closed'", [ticket_id]);
      
      return NextResponse.json({ success: true });
    }

    // Otherwise, create a new ticket
    if (!subject || !message) return NextResponse.json({ success: false, message: 'Subject and message required' }, { status: 400 });

    await query(
      "INSERT INTO ress_support_tickets (user_id, subject, message, priority) VALUES ($1, $2, $3, $4)",
      [userId, subject, message, priority || 'normal']
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
