"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

const Page = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setSuccess(data.message || "Message sent successfully");
      setForm({ fullName: "", email: "", phone: "", message: "" });
    } catch (submitError) {
      setError(submitError.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 md:px-20 py-20">

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-5xl font-extrabold text-center"
      >
        Contact Us
      </motion.h1>

      <p className="text-center text-white/70 mt-4 mb-16 text-lg">
        We'd love to hear from you — let's talk!
      </p>

      {/* Main Grid */}
      <div className="grid md:grid-cols-2 gap-16">

        {/* Contact Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/5 p-10 rounded-2xl border border-white/10 shadow-xl backdrop-blur-xl"
        >
          <h2 className="text-3xl font-bold mb-6 text-blue-400">
            Send a Message
          </h2>

          {(success || error) && (
            <div className={`mb-6 rounded-xl border px-4 py-3 text-sm ${error ? "border-red-500/30 bg-red-500/10 text-red-300" : "border-green-500/30 bg-green-500/10 text-green-300"}`}>
              {success || error}
            </div>
          )}

          <label className="block mb-4">
            <span className="text-white/80">Full Name</span>
            <input
              type="text"
              value={form.fullName}
              onChange={handleChange("fullName")}
              className="mt-2 w-full p-3 rounded-xl bg-black/40 border border-white/20 text-white focus:outline-none"
              placeholder="Enter your name"
            />
          </label>

          <label className="block mb-4">
            <span className="text-white/80">Email</span>
            <input
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              className="mt-2 w-full p-3 rounded-xl bg-black/40 border border-white/20 text-white focus:outline-none"
              placeholder="Enter your email"
            />
          </label>

          <label className="block mb-4">
            <span className="text-white/80">Phone Number</span>
            <input
              type="tel"
              value={form.phone}
              onChange={handleChange("phone")}
              className="mt-2 w-full p-3 rounded-xl bg-black/40 border border-white/20 text-white focus:outline-none"
              placeholder="Enter your phone number"
            />
          </label>

          <label className="block mb-4">
            <span className="text-white/80">Message</span>
            <textarea
              rows={5}
              value={form.message}
              onChange={handleChange("message")}
              className="mt-2 w-full p-3 rounded-xl bg-black/40 border border-white/20 text-white focus:outline-none resize-none"
              placeholder="Write your message..."
            ></textarea>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 px-8 py-3 bg-blue-600 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Message →"}
          </button>
        </motion.form>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/5 p-10 rounded-2xl border border-white/10 shadow-xl backdrop-blur-xl"
        >
          <h2 className="text-3xl font-bold mb-6 text-blue-400">
            Get In Touch
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold">📍 Address</h3>
              <p className="text-white/70">
                Haldia Institute of Technology<br />
                West Bengal, India
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold">📧 Email</h3>
              <p className="text-white/70">acm.hit@gmail.com</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold">📞 Phone</h3>
              <p className="text-white/70">+91 98765 43210</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold">🌐 Social Links</h3>
              <div className="flex gap-4 mt-2">
                <a className="hover:text-blue-400" href="#">Instagram</a>
                <a className="hover:text-blue-400" href="#">LinkedIn</a>
                <a className="hover:text-blue-400" href="#">Github</a>
              </div>
            </div>
          </div>
        </motion.div>

      </div>

      <footer className="text-center text-white/40 mt-20">
        © {new Date().getFullYear()} ACM HIT Haldia — Built with ❤️
      </footer>

    </main>
  );
};

export default Page;
