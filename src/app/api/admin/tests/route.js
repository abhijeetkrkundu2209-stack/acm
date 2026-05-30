import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Test from "@/models/Test";
import { jwtVerify } from "jose";

// GET all tests
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

    await dbConnect();
    const tests = await Test.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ tests }, { status: 200 });
  } catch (error) {
    console.error("Fetch tests error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

// POST create a new test
export async function POST(req) {
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

    await dbConnect();
    const body = await req.json();
    const { title, subject, duration, questions } = body;

    if (!title || !subject || !questions || questions.length === 0) {
      return NextResponse.json(
        { error: "Title, subject, and at least one question are required" },
        { status: 400 }
      );
    }

    // Validate each question
    for (const q of questions) {
      if (!q.question || !q.options || q.options.length !== 4 || !q.answer) {
        return NextResponse.json(
          { error: "Each question must have text, 4 options, and a correct answer" },
          { status: 400 }
        );
      }
      if (!q.options.includes(q.answer)) {
        return NextResponse.json(
          { error: `Answer "${q.answer}" must be one of the options for question "${q.question}"` },
          { status: 400 }
        );
      }
    }

    const test = new Test({
      title,
      subject,
      duration: duration || 20,
      questions,
      createdBy: payload.userId,
    });

    await test.save();

    return NextResponse.json(
      { message: "Test created successfully", test },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create test error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

// DELETE a test
export async function DELETE(req) {
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

    const { searchParams } = new URL(req.url);
    const testId = searchParams.get("id");

    if (!testId) {
      return NextResponse.json({ error: "Test ID is required" }, { status: 400 });
    }

    await dbConnect();
    const deleted = await Test.findByIdAndDelete(testId);

    if (!deleted) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Test deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Delete test error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
