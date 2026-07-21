
import { pool } from "@/lib/database/pg";
import { NextResponse } from "next/server";
import { isManager } from "@/lib/auth/middleware";

export async function POST(req) {
  try {
    

    const auth = await isManager();
    if (!auth.success) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, message: "Id not found" }, { status: 400 });
    }

    const { rowCount } = await pool.query("UPDATE restaurant_reservations SET status = 'confirmed' WHERE id = $1", [id]);

    if (rowCount === 0) {
      return NextResponse.json({ success: false, message: "Reservation not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Successfully confirmed reservation" }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to confirm reservation",
      error: error.message,
    }, { status: 500 });
  }
}