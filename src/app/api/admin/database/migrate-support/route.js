import { NextResponse } from "next/server";

export async function GET(req) {
  return NextResponse.json({
    success: true,
    message: "No migration is needed in standalone single-tenant mode. Database schema is already fully optimized.",
  }, { status: 200 });
}
