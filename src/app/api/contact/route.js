import { NextResponse } from "next/server";
import emailjs from "@emailjs/nodejs";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function POST(req) {
  try {
    const { fullName, email, phone, message } = await req.json();

    if (!fullName || !email || !phone || !message) {
      return NextResponse.json(
        { error: "Please fill in all fields" },
        { status: 400 }
      );
    }

    if (
      !process.env.EMAILJS_SERVICE_ID ||
      !process.env.EMAILJS_TEMPLATE_ID ||
      !process.env.EMAILJS_PUBLIC_KEY
    ) {
      return NextResponse.json(
        { error: "Mail service is not configured" },
        { status: 500 }
      );
    }

    const adminEmail = process.env.CONTACT_TO_EMAIL || process.env.ADMIN_EMAIL || "acm.hit@gmail.com";
    const safeFullName = escapeHtml(fullName);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone);
    const safeMessage = escapeHtml(message).replaceAll("\n", "<br />");

    const templateParams = {
      to_email: adminEmail,
      from_name: safeFullName,
      from_email: safeEmail,
      phone: safePhone,
      message: safeMessage,
      subject: `New ACM contact inquiry from ${safeFullName}`,
      reply_to: email,
    };

    const emailOptions = {
      publicKey: process.env.EMAILJS_PUBLIC_KEY,
      privateKey: process.env.EMAILJS_PRIVATE_KEY,
    };

    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      templateParams,
      emailOptions
    );

    return NextResponse.json(
      { message: "Your message has been sent to ACM admin" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
