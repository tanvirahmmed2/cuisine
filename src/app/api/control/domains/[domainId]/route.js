import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isManager } from '@/lib/middleware';

export async function PATCH(request, { params }) {
  try {
    const auth = await isManager();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });
    const { verified, is_primary } = await request.json();
    
    let queryStr = "UPDATE ress_domains SET ";
    const values = [];
    let count = 1;
    
    if (verified !== undefined) { queryStr += `verified = $${count}, `; values.push(verified); count++; }
    if (is_primary !== undefined) { queryStr += `is_primary = $${count}, `; values.push(is_primary); count++; }
    
    if (values.length === 0) return NextResponse.json({ success: false, message: 'No updates provided' }, { status: 400 });
    
    queryStr = queryStr.slice(0, -2) + ` WHERE domain_id = $${count}`;
    values.push(params.domainId);

    await query(queryStr, values);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = await isManager();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });
    await query("DELETE FROM ress_domains WHERE domain_id = $1", [params.domainId]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
