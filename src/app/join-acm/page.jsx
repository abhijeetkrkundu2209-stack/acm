"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CreditCard, Mail, Phone, Hash, Building2, User } from "lucide-react";

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function JoinAcmPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    rollNumber: "",
    email: "",
    department: "",
    mobileNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadRazorpayScript();
  }, []);

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/join-acm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to start membership payment");
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Unable to load payment gateway");
      }

      const options = {
        key: data.keyId,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "ACM Student Chapter",
        description: "ACM membership fee",
        order_id: data.order.id,
        prefill: {
          name: form.fullName,
          email: form.email,
          contact: form.mobileNumber,
        },
        theme: {
          color: "#2563eb",
        },
        handler: async function (response) {
          try {
            const verifyResponse = await fetch("/api/join-acm/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                applicationId: data.application.id,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();
            if (!verifyResponse.ok) {
              throw new Error(verifyData.error || "Payment verification failed");
            }

            setMessage("Membership payment successful. Your ACM join request is confirmed.");
            router.push("/");
          } catch (verificationError) {
            setError(verificationError.message || "Payment verification failed");
          }
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (submissionError) {
      setError(submissionError.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden px-6 py-20">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-24 left-16 w-96 h-96 bg-blue-600/30 blur-3xl rounded-full" />
        <div className="absolute bottom-16 right-16 w-96 h-96 bg-purple-600/30 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
        <motion.section
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="space-y-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-blue-200">
            <CreditCard size={16} /> Membership fee: Rs 100
          </span>
          <h1 className="text-5xl md:text-7xl font-black leading-tight">
            Join <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent">ACM HIT</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-xl">
            Fill in your details and pay the one-time membership fee of Rs 100 to become part of the ACM Student Chapter.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 max-w-xl">
            {[
              "Access events, workshops, and hackathons",
              "Build projects with a strong tech community",
              "Connect with mentors and core members",
              "Get updates on ACM opportunities",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-gray-300">
                {item}
              </div>
            ))}
          </div>
          <Link href="/" className="inline-flex items-center gap-2 text-blue-300 hover:text-blue-200 transition-colors">
            Back to home <ArrowRight size={16} />
          </Link>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl p-6 md:p-8"
        >
          <div className="mb-6">
            <h2 className="text-3xl font-bold">Membership Form</h2>
            <p className="text-gray-400 mt-2">All fields are required before payment.</p>
          </div>

          {(error || message) && (
            <div className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${error ? "border-red-500/30 bg-red-500/10 text-red-300" : "border-green-500/30 bg-green-500/10 text-green-300"}`}>
              {error || message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Full Name" icon={User} value={form.fullName} onChange={handleChange("fullName")} placeholder="Your name" />
            <Field label="Roll Number" icon={Hash} value={form.rollNumber} onChange={handleChange("rollNumber")} placeholder="Your roll number" />
            <Field label="Email Address" icon={Mail} type="email" value={form.email} onChange={handleChange("email")} placeholder="you@example.com" />
            <Field label="Department" icon={Building2} value={form.department} onChange={handleChange("department")} placeholder="CSE / IT / ECE ..." />
            <Field label="Mobile Number" icon={Phone} value={form.mobileNumber} onChange={handleChange("mobileNumber")} placeholder="10-digit mobile number" />

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total payable</p>
                <p className="text-2xl font-bold">Rs 100</p>
              </div>
              <CreditCard className="text-blue-300" />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-purple-700 px-6 py-4 font-bold text-lg hover:shadow-xl hover:shadow-blue-500/25 transition disabled:opacity-60"
            >
              {loading ? "Processing..." : "Pay Rs 100 and Join ACM"}
            </button>
          </form>
        </motion.section>
      </div>
    </main>
  );
}

function Field({ label, icon: Icon, type = "text", value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-gray-300">{label}</span>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-white placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
          required
        />
      </div>
    </label>
  );
}
