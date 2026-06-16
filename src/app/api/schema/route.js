import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await query(`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name IN ('ress_packages', 'ress_features', 'ress_package_features')
    `);
    
    const tables = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    return NextResponse.json({ success: true, timestamp: Date.now(), columns: res.rows, tables: tables.rows.map(r => r.table_name) });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message });
  }
}
