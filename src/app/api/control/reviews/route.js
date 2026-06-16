import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isManager } from '@/lib/middleware';

export async function GET() {
  try {
    const auth = await isManager();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });
    const res = await query(`
      SELECT r.*, u.name as user_name, u.email as user_email 
      FROM ress_reviews r 
      JOIN ress_users u ON u.user_id = r.user_id 
      ORDER BY r.created_at DESC
    `);
    return NextResponse.json({ success: true, data: { reviews: res.rows } });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
