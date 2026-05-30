"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, User as UserIcon, UserCheck, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const { signup, loading, error, clearError } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccessMsg("");
    clearError();

    if (!name || !email || !password || !confirmPassword) {
      setFormError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setFormError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    const res = await signup(name, email, password);
    if (res.success) {
      setSuccessMsg("Account created successfully! Redirecting to sign in...");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        router.push("/signin");
      }, 2500);
    } else {
      setFormError(res.error || "Failed to create account.");
    }
  };

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center px-6 py-24 overflow-hidden select-none">
      {/* Background Glow Blobs */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-20 animate-pulse duration-4000" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20 animate-pulse duration-6000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 45, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl flex flex-col"
      >
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Create Account
          </h2>
          <p className="text-gray-400 mt-2 text-sm md:text-base">
            Join the ACM Student Chapter at HIT
          </p>
        </div>

        {/* Errors */}
        {(formError || error) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium"
          >
            {formError || error}
          </motion.div>
        )}

        {/* Success */}
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium flex items-center gap-2"
          >
            <UserCheck size={16} />
            {successMsg}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name Input */}
          <div className="flex flex-col relative">
            <label className="text-gray-400 text-sm font-semibold mb-1 ml-1">
              Full Name
            </label>
            <div className="relative flex items-center">
              <UserIcon className="absolute left-4 text-gray-500" size={18} />
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="flex flex-col relative">
            <label className="text-gray-400 text-sm font-semibold mb-1 ml-1">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-4 text-gray-500" size={18} />
              <input
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="flex flex-col relative">
            <label className="text-gray-400 text-sm font-semibold mb-1 ml-1">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 text-gray-500" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-gray-500 hover:text-white transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="flex flex-col relative">
            <label className="text-gray-400 text-sm font-semibold mb-1 ml-1">
              Confirm Password
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 text-gray-500" size={18} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 text-gray-500 hover:text-white transition"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={loading}
            className="group mt-3 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-blue-500/25 transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Creating Account..." : "Sign Up"}
            {!loading && (
              <ArrowRight
                className="group-hover:translate-x-1.5 transition-transform"
                size={18}
              />
            )}
          </button>
        </form>

        {/* Signin Redirect */}
        <p className="text-gray-400 text-center text-sm mt-6">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-300 hover:to-purple-300 font-semibold"
          >
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
