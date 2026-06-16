import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isLogin, hashPassword } from '@/lib/middleware';

export async function GET() {
  try {
    const auth = await isLogin();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });
    const res = await query("SELECT user_id, name, email FROM ress_users WHERE user_id = $1", [auth.data.user_id]);
    return NextResponse.json({ success: true, data: { profile: res.rows[0] } });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const auth = await isLogin();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });

    const { name, email, password } = await request.json();
    let queryStr = "UPDATE ress_users SET ";
    const values = [];
    let count = 1;

    if (name) {
      queryStr += `name = $${count}, `;
      values.push(name); count++;
    }
    if (email) {
      const check = await query("SELECT user_id FROM ress_users WHERE email = $1 AND user_id != $2", [email.toLowerCase().trim(), auth.data.user_id]);
      if (check.rows.length > 0) return NextResponse.json({ success: false, message: 'Email already taken' }, { status: 400 });
      queryStr += `email = $${count}, `;
      values.push(email.toLowerCase().trim()); count++;
    }
    if (password) {
      if (password.length < 8) return NextResponse.json({ success: false, message: 'Password too short' }, { status: 400 });
      const hashed = await hashPassword(password);
      queryStr += `password = $${count}, `;
      values.push(hashed); count++;
    }

    if (values.length === 0) return NextResponse.json({ success: false, message: 'No data provided' }, { status: 400 });

    queryStr = queryStr.slice(0, -2) + ` WHERE user_id = $${count}`;
    values.push(auth.data.user_id);

    await query(queryStr, values);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
