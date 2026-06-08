import { NextResponse } from "next/server";
import { findUserSubmissions } from "@/lib/submissionAccess";
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

    if (!payload?.userId) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const submissions = await findUserSubmissions(payload.userId);

    const totalSubmissions = submissions.length;
    const totalMarks = submissions.reduce((sum, submission) => sum + (submission.score || 0), 0);
    const maxMarks = submissions.reduce(
      (sum, submission) => sum + (submission.totalQuestions || 0),
      0
    );

    return NextResponse.json(
      {
        summary: {
          totalSubmissions,
          totalMarks,
          maxMarks,
        },
        submissions,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch profile submissions error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
