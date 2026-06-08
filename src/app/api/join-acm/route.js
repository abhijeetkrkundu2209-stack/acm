import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createJoinApplication, updateJoinApplication } from "@/lib/joinApplications";

export async function POST(req) {
  try {
    const { fullName, rollNumber, email, department, mobileNumber } = await req.json();

    if (!fullName || !rollNumber || !email || !department || !mobileNumber) {
      return NextResponse.json(
        { error: "Please fill in all fields" },
        { status: 400 }
      );
    }

    const amount = 10000;

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        { error: "Razorpay is not configured on this environment" },
        { status: 500 }
      );
    }

    const application = await createJoinApplication({
      fullName,
      rollNumber,
      email,
      department,
      mobileNumber,
      feeAmount: amount,
      paymentStatus: "pending",
    });

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: String(application._id),
      payment_capture: 1,
    });

    await updateJoinApplication(application._id, {
      razorpayOrderId: order.id,
    });

    return NextResponse.json(
      {
        message: "Join application created",
        application: {
          id: application._id,
          fullName: application.fullName,
          email: application.email,
        },
        order: {
          id: order.id,
          amount: order.amount,
          currency: order.currency,
        },
        keyId: process.env.RAZORPAY_KEY_ID,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Join ACM application error:", error);
    return NextResponse.json(
      { error: "Failed to create join application" },
      { status: 500 }
    );
  }
}
