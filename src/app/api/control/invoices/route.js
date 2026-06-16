import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isManager } from '@/lib/middleware';

export async function GET() {
  try {
    const auth = await isManager();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });
    const res = await query(`
      SELECT i.*, t.name as tenant_name 
      FROM ress_invoices i
      JOIN ress_tenants t ON t.tenant_id = i.tenant_id
      ORDER BY i.created_at DESC
    `);
    return NextResponse.json({ success: true, data: { invoices: res.rows } });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const auth = await isManager();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });
    const { tenant_id, subscription_id, invoice_number, amount, status, due_date } = await request.json();
    if (!tenant_id || !invoice_number || amount === undefined) {
      return NextResponse.json({ success: false, message: 'tenant_id, invoice_number, and amount required' }, { status: 400 });
    }
    const res = await query(
      "INSERT INTO ress_invoices (tenant_id, subscription_id, invoice_number, amount, status, due_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [tenant_id, subscription_id || null, invoice_number, amount, status || 'unpaid', due_date || null]
    );
    return NextResponse.json({ success: true, data: { invoice: res.rows[0] } });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
