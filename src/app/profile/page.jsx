"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ClipboardList, ArrowLeft, Award, BadgeCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [summary, setSummary] = useState({ totalSubmissions: 0, totalMarks: 0, maxMarks: 0 });
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/signin");
      return;
    }

    if (!authLoading && user) {
      const loadProfileData = async () => {
        try {
          const response = await fetch("/api/profile/submissions");
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || "Failed to load profile data");
          }

          setSummary(data.summary || { totalSubmissions: 0, totalMarks: 0, maxMarks: 0 });
          setSubmissions(data.submissions || []);
        } catch (profileError) {
          setError(profileError.message || "Failed to load profile data");
        } finally {
          setLoading(false);
        }
      };

      loadProfileData();
    }
  }, [authLoading, router, user]);

  if (authLoading || loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-blue-500" />
          <p className="text-gray-300">Loading your profile...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden px-6 py-24">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-12 w-96 h-96 bg-blue-600/25 blur-3xl rounded-full" />
        <div className="absolute bottom-12 right-12 w-96 h-96 bg-purple-600/25 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center gap-2 text-blue-300 hover:text-blue-200 transition-colors">
          <ArrowLeft size={16} /> Back to home
        </Link>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-8 md:p-10 shadow-2xl"
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-blue-200">
                <BadgeCheck size={16} /> Student profile
              </span>
              <h1 className="mt-4 text-4xl md:text-6xl font-black">Welcome, {user?.name}</h1>
              <p className="mt-3 text-gray-300 max-w-2xl">
                Track how many tests you have submitted and review your marks in one place.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:w-auto">
              <Metric label="Submitted Tests" value={summary.totalSubmissions} icon={<ClipboardList size={18} />} />
              <Metric label="Total Marks" value={summary.totalMarks} icon={<Award size={18} />} />
              <Metric label="Max Marks" value={summary.maxMarks} icon={<BadgeCheck size={18} />} />
            </div>
          </div>
        </motion.section>

        {error ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-300">
            {error}
          </div>
        ) : submissions.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-gray-300">
            No test submissions found yet.
          </div>
        ) : (
          <section className="grid gap-4">
            {submissions.map((submission) => {
              const percentage = submission.totalQuestions ? Math.round((submission.score / submission.totalQuestions) * 100) : 0;

              return (
                <motion.article
                  key={submission._id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-7 flex flex-col md:flex-row md:items-center md:justify-between gap-5"
                >
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-500">{new Date(submission.createdAt).toLocaleDateString()}</p>
                    <h2 className="mt-2 text-2xl font-bold text-white">{submission.subject}</h2>
                    <p className="mt-1 text-gray-400">Roll No: {submission.rollNumber}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-center min-w-[220px]">
                    <StatBox label="Marks" value={`${submission.score}/${submission.totalQuestions}`} />
                    <StatBox label="Percentage" value={`${percentage}%`} />
                  </div>
                </motion.article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}

function Metric({ label, value, icon }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4">
      <div className="flex items-center gap-2 text-gray-400 text-sm">
        {icon}
        <span>{label}</span>
      </div>
      <div className="mt-2 text-3xl font-black text-white">{value}</div>
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
      <p className="text-xs uppercase tracking-[0.25em] text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}
