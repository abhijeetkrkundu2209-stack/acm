import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import TestSubmission from "@/models/TestSubmission";
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

    await dbConnect();
    const body = await req.json();
    const { studentName, rollNumber, subject, answers, score, totalQuestions } = body;

    if (!studentName || !rollNumber || !subject || !answers) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const submission = new TestSubmission({
      studentName,
      rollNumber,
      subject,
      answers,
      score,
      totalQuestions,
      createdBy,
    });

    await submission.save();

    return NextResponse.json({ message: "Submission saved", submission }, { status: 201 });
  } catch (error) {
    console.error("Test submission error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
