import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/middleware';

export async function PATCH(request, { params }) {
  try {
    const { userId } = await params;
    const auth = await isAdmin();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });
    const { role } = await request.json();
    await query("UPDATE ress_users SET role = $1 WHERE user_id = $2", [role, userId]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { userId } = await params;
    const auth = await isAdmin();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });
    if (auth.data.user_id == userId) return NextResponse.json({ success: false, message: 'Cannot delete yourself' }, { status: 400 });
    await query("DELETE FROM ress_users WHERE user_id = $1", [userId]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
