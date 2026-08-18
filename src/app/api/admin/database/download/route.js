
import { pool } from "@/lib/database/pg";
import { isLogin } from "@/lib/auth/middleware";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    

    const auth = await isLogin();
    
    if (!auth.success || auth.payload.role !== 'admin') {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const tables = [
      "users",
      "customers",
      "categories",
      "items",
      "item_variants",
      "orders",
      "order_items",
      "order_item_variants",
      "payments",
      "expenses",
      "reservations",
      "support_tickets",
      "reviews",
      "websites",
      "tables",
      "order_tables"
    ];

    const databaseExport = {
      exported_at: new Date().toISOString(),
      data: {}
    };

    for (const table of tables) {
      const { rows } = await pool.query(`SELECT * FROM ${table}`);
      databaseExport.data[table] = rows;
    }

    const jsonString = JSON.stringify(databaseExport, null, 2);
    
    return new Response(jsonString, {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename=restaurant_db_export_${new Date().getTime()}.json`,
      },
    });

  } catch (error) {
    console.error("Database export error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
