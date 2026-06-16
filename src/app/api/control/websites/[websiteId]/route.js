import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isManager } from '@/lib/middleware';

export async function PATCH(request, { params }) {
  try {
    const auth = await isManager();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });
    const body = await request.json();
    
    let queryStr = "UPDATE restaurant_websites SET ";
    const values = [];
    let count = 1;
    
    const allowedFields = ['logo_url', 'theme_color', 'hero_title', 'hero_subtitle'];
    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        queryStr += `${key} = $${count}, `;
        values.push(body[key]);
        count++;
      }
    }
    
    if (values.length === 0) return NextResponse.json({ success: false, message: 'No updates provided' }, { status: 400 });
    
    queryStr += `updated_at = NOW() WHERE website_id = $${count}`;
    values.push(params.websiteId);

    await query(queryStr, values);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
