import { NextResponse } from "next/server";
import { findAllSubmissions } from "@/lib/submissionAccess";
import { jwtVerify } from "jose";

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "fallback-secret-minimum-32-chars-long"
    );
    const { payload } = await jwtVerify(token, secret);
    if (payload.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const submissions = await findAllSubmissions();

    return NextResponse.json({ submissions }, { status: 200 });
  } catch (error) {
    console.error("Fetch submissions error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
