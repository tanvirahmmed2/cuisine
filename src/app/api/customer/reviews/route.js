import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isLogin } from '@/lib/middleware';

export async function GET() {
  try {
    const auth = await isLogin();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });
    const res = await query("SELECT * FROM ress_reviews WHERE user_id = $1 LIMIT 1", [auth.data.user_id]);
    return NextResponse.json({ success: true, data: { review: res.rows[0] || null } });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const auth = await isLogin();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });
    
    const { rating, comment } = await request.json();
    if (!rating || rating < 1 || rating > 5) return NextResponse.json({ success: false, message: 'Invalid rating' }, { status: 400 });

    const check = await query("SELECT review_id FROM ress_reviews WHERE user_id = $1", [auth.data.user_id]);
    if (check.rows.length > 0) {
        await query("UPDATE ress_reviews SET rating = $1, comment = $2, is_approved = false WHERE user_id = $3", [rating, comment, auth.data.user_id]);
    } else {
        await query("INSERT INTO ress_reviews (user_id, rating, comment) VALUES ($1, $2, $3)", [auth.data.user_id, rating, comment]);
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
