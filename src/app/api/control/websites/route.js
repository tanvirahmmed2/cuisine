import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isManager } from '@/lib/middleware';

export async function GET() {
  try {
    const auth = await isManager();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });
    const res = await query(`
      SELECT w.*, t.name as tenant_name 
      FROM restaurant_websites w
      JOIN ress_tenants t ON t.tenant_id = w.tenant_id
      ORDER BY w.created_at DESC
    `);
    return NextResponse.json({ success: true, data: { websites: res.rows } });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
