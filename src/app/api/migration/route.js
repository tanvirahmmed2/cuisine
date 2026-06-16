import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    await query("ALTER TABLE ress_packages ADD COLUMN features JSONB DEFAULT '[]'::jsonb;");
    return NextResponse.json({ success: true, message: 'Added features column' });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message });
  }
}
