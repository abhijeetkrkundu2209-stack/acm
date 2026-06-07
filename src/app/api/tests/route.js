import { NextResponse } from "next/server";
import { findPublicTests } from "@/lib/testAccess";

// Public endpoint - fetch all active tests (no auth required)
export async function GET() {
  try {
    const tests = await findPublicTests();

    return NextResponse.json({ tests }, { status: 200 });
  } catch (error) {
    console.error("Fetch public tests error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
