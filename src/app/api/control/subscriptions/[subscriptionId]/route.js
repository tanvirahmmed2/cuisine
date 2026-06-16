import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isAdmin } from '@/lib/middleware';

export async function PATCH(request, { params }) {
  try {
    const auth = await isAdmin();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });
    const { status, auto_renew } = await request.json();
    
    let queryStr = "UPDATE ress_subscriptions SET ";
    const values = [];
    let count = 1;
    
    if (status !== undefined) { queryStr += `status = $${count}, `; values.push(status); count++; }
    if (auto_renew !== undefined) { queryStr += `auto_renew = $${count}, `; values.push(auto_renew); count++; }
    
    if (values.length === 0) return NextResponse.json({ success: false, message: 'No updates provided' }, { status: 400 });
    
    queryStr = queryStr.slice(0, -2) + ` WHERE subscription_id = $${count}`;
    values.push(params.subscriptionId);

    await query(queryStr, values);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
