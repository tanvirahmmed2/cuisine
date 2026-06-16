import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const res = await query(`
      SELECT r.review_id as id, r.rating, r.comment as message, u.name 
      FROM ress_reviews r
      JOIN ress_users u ON u.user_id = r.user_id
      WHERE r.is_approved = true
      ORDER BY r.created_at DESC LIMIT 10
    `);
    return NextResponse.json({ success: true, data: { testimonials: res.rows } });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
