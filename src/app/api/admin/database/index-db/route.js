import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Standalone single-tenant website does not require multi-tenant indexing optimizations. All indexes are already properly configured in schema.psql.",
  });
}
