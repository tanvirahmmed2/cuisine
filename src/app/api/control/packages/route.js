import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { isManager } from '@/lib/middleware';

const slugify = (text) => text ? text.toString().toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : '';

export async function GET() {
  try {
    const auth = await isManager();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });
    const res = await query("SELECT * FROM ress_packages ORDER BY monthly_price ASC");
    
    const featuresRes = await query(`
      SELECT pf.package_id, f.feature_id, f.key, f.name 
      FROM ress_package_features pf
      JOIN ress_features f ON pf.feature_id = f.feature_id
    `);

    const packages = res.rows.map(pkg => {
      return {
        ...pkg,
        features: featuresRes.rows.filter(f => f.package_id === pkg.package_id).map(f => ({ feature_id: f.feature_id, key: f.key, name: f.name }))
      };
    });

    return NextResponse.json({ success: true, data: { packages } });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const auth = await isManager();
    if (!auth.success) return NextResponse.json(auth, { status: 403 });
    const { name, description, monthly_price, setup_fee, max_menu_items, max_orders_per_month, max_tables, is_active, features } = await request.json();
    if (!name) return NextResponse.json({ success: false, message: 'Name required' }, { status: 400 });
    
    const slug = slugify(name);
    const yearly_price = monthly_price ? parseFloat(monthly_price) * 12 : 0;
    
    const res = await query(
      "INSERT INTO ress_packages (name, slug, description, monthly_price, yearly_price, setup_fee, max_menu_items, max_orders_per_month, max_tables, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
      [
        name, slug, description, 
        monthly_price || 0, yearly_price, setup_fee || 0, 
        max_menu_items || 0, max_orders_per_month || 0, max_tables || 0, 
        is_active !== false
      ]
    );

    const newPackageId = res.rows[0].package_id;

    if (Array.isArray(features) && features.length > 0) {
      for (const featureId of features) {
        if (featureId) {
          await query("INSERT INTO ress_package_features (package_id, feature_id) VALUES ($1, $2)", [newPackageId, featureId]);
        }
      }
    }

    return NextResponse.json({ success: true, data: { package: res.rows[0] } });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
