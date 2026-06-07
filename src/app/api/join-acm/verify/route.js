import { NextResponse } from "next/server";
import crypto from "crypto";
import { updateJoinApplication } from "@/lib/joinApplications";

export async function POST(req) {
  try {
    const {
      applicationId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = await req.json();

    if (!applicationId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json(
        { error: "Missing payment verification data" },
        { status: 400 }
      );
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        { error: "Razorpay is not configured on this environment" },
        { status: 500 }
      );
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      await updateJoinApplication(applicationId, { paymentStatus: "failed" });
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    const updatedApplication = await updateJoinApplication(applicationId, {
      paymentStatus: "paid",
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      paidAt: new Date(),
    });

    return NextResponse.json(
      {
        message: "Payment verified successfully",
        application: updatedApplication,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Join ACM verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
