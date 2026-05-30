import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Test from "@/models/Test";

// Public endpoint - fetch all active tests (no auth required)
export async function GET() {
  try {
    await dbConnect();
    const tests = await Test.find({ isActive: true })
      .select("title subject duration questions")
      .sort({ createdAt: -1 });

    return NextResponse.json({ tests }, { status: 200 });
  } catch (error) {
    console.error("Fetch public tests error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
