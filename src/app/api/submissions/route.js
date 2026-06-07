import { NextResponse } from "next/server";
import { createSubmission } from "@/lib/submissionAccess";
import { jwtVerify } from "jose";

export async function POST(req) {
  try {
    const token = req.cookies.get("token")?.value; // optional auth
    let createdBy = null;
    if (token) {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || "fallback-secret-minimum-32-chars-long"
      );
      const { payload } = await jwtVerify(token, secret);
      createdBy = payload.userId || null;
    }

    const body = await req.json();
    const { studentName, rollNumber, subject, answers, score, totalQuestions } = body;

    if (!studentName || !rollNumber || !subject || !answers) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const submission = await createSubmission({
      studentName,
      rollNumber,
      subject,
      answers,
      score,
      totalQuestions,
      createdBy,
    });

    return NextResponse.json({ message: "Submission saved", submission }, { status: 201 });
  } catch (error) {
    console.error("Test submission error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
