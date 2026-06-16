import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isManager } from '@/lib/middleware';

export async function GET() {
  try {
    const auth = await isManager();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });
    const res = await query(`
      SELECT d.*, t.name as tenant_name 
      FROM ress_domains d
      JOIN ress_tenants t ON t.tenant_id = d.tenant_id
      ORDER BY d.created_at DESC
    `);
    return NextResponse.json({ success: true, data: { domains: res.rows } });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
