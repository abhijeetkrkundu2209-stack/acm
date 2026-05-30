"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  FileText,
  PlusCircle,
  Trash2,
  UserCheck,
  ShieldAlert,
  Home,
  LogOut,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Clock,
  Mail,
  Shield,
  X,
  BookOpen,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AdminDashboard() {
  const { user, signout } = useAuth();

  // Real data states
  const [users, setUsers] = useState([]);
  const [tests, setTests] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingTests, setLoadingTests] = useState(true);

  // UI states
  const [activeTab, setActiveTab] = useState("overview"); // overview | users | tests
  const [showCreateTest, setShowCreateTest] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");

  // Create test form state
  const [testTitle, setTestTitle] = useState("");
  const [testSubject, setTestSubject] = useState("");
  const [testDuration, setTestDuration] = useState(20);
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], answer: "" },
  ]);

  // Fetch users from API
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Fetch tests from API
  const fetchTests = async () => {
    setLoadingTests(true);
    try {
      const res = await fetch("/api/admin/tests");
      if (res.ok) {
        const data = await res.json();
        setTests(data.tests);
      }
    } catch (err) {
      console.error("Failed to fetch tests:", err);
    } finally {
      setLoadingTests(false);
    }
  };

  const fetchSubmissions = async () => {
    setLoadingSubmissions(true);
    try {
      const res = await fetch('/api/admin/submissions');
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data.submissions || []);
      }
    } catch (err) {
      console.error('Failed to fetch submissions:', err);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchTests();
  }, []);

  useEffect(() => {
    if (activeTab === 'submissions') {
      fetchSubmissions();
    }
  }, [activeTab]);

  // Delete a test
  const handleDeleteTest = async (testId) => {
    if (!confirm("Are you sure you want to delete this test?")) return;
    try {
      const res = await fetch(`/api/admin/tests?id=${testId}`, { method: "DELETE" });
      if (res.ok) {
        setTests(tests.filter((t) => t._id !== testId));
      }
    } catch (err) {
      console.error("Failed to delete test:", err);
    }
  };

  // Add a new empty question row
  const addQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", "", "", ""], answer: "" }]);
  };

  // Remove a question row
  const removeQuestion = (index) => {
    if (questions.length <= 1) return;
    setQuestions(questions.filter((_, i) => i !== index));
  };

  // Update question text
  const updateQuestionText = (index, value) => {
    const updated = [...questions];
    updated[index].question = value;
    setQuestions(updated);
  };

  // Update option text
  const updateOption = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  // Set correct answer for a question
  const setCorrectAnswer = (qIndex, value) => {
    const updated = [...questions];
    updated[qIndex].answer = value;
    setQuestions(updated);
  };

  // Submit create test form
  const handleCreateTest = async (e) => {
    e.preventDefault();
    setCreateError("");
    setCreateSuccess("");

    if (!testTitle || !testSubject) {
      setCreateError("Please provide a title and subject.");
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question) {
        setCreateError(`Question ${i + 1} text is empty.`);
        return;
      }
      for (let j = 0; j < 4; j++) {
        if (!q.options[j]) {
          setCreateError(`Question ${i + 1}, Option ${j + 1} is empty.`);
          return;
        }
      }
      if (!q.answer) {
        setCreateError(`Please select the correct answer for Question ${i + 1}.`);
        return;
      }
    }

    try {
      const res = await fetch("/api/admin/tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: testTitle,
          subject: testSubject,
          duration: testDuration,
          questions,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setCreateError(data.error || "Failed to create test.");
        return;
      }

      setCreateSuccess("Test created successfully!");
      setTestTitle("");
      setTestSubject("");
      setTestDuration(20);
      setQuestions([{ question: "", options: ["", "", "", ""], answer: "" }]);
      fetchTests();

      setTimeout(() => {
        setShowCreateTest(false);
        setCreateSuccess("");
      }, 1500);
    } catch (err) {
      setCreateError("Network error. Please try again.");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const totalUsers = users.length;
  const totalAdmins = users.filter((u) => u.role === "admin").length;
  const totalTests = tests.length;
  const totalQuestions = tests.reduce((acc, t) => acc + (t.questions?.length || 0), 0);

  return (
    <div className="relative min-h-screen bg-black text-white px-4 md:px-6 py-28 overflow-hidden select-none">
      {/* Glowing Blobs */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-purple-600 rounded-full blur-3xl opacity-10" />
        <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-blue-600 rounded-full blur-3xl opacity-10" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto w-full flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-purple-400 font-extrabold mb-1">
              <ShieldAlert size={14} />
              Administrative Command Center
            </div>
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => (window.location.href = "/")}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2.5 rounded-2xl text-sm font-semibold transition cursor-pointer"
            >
              <Home size={16} />
              Website
            </button>
            <button
              onClick={signout}
              className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/20 px-4 py-2.5 rounded-2xl text-sm font-semibold text-red-400 transition cursor-pointer"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 bg-white/5 rounded-2xl p-1.5 w-fit">
          {[
            { key: "overview", label: "Overview" },
            { key: "users", label: `Users (${totalUsers})` },
            { key: "tests", label: `Tests (${totalTests})` },
            { key: "submissions", label: `Submissions` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeTab === tab.key
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ===== OVERVIEW TAB ===== */}
        {activeTab === "overview" && (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col gap-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div variants={cardVariants} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-blue-500/50 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 group-hover:scale-110 transition-transform">
                    <Users size={24} />
                  </div>
                </div>
                <h3 className="text-gray-400 text-sm font-semibold">Total Users</h3>
                <p className="text-4xl font-extrabold mt-1 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  {loadingUsers ? "..." : totalUsers}
                </p>
              </motion.div>

              <motion.div variants={cardVariants} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-yellow-500/50 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-yellow-500/10 rounded-2xl text-yellow-400 group-hover:scale-110 transition-transform">
                    <Shield size={24} />
                  </div>
                </div>
                <h3 className="text-gray-400 text-sm font-semibold">Admin Accounts</h3>
                <p className="text-4xl font-extrabold mt-1 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  {loadingUsers ? "..." : totalAdmins}
                </p>
              </motion.div>

              <motion.div variants={cardVariants} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-purple-500/50 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-400 group-hover:scale-110 transition-transform">
                    <FileText size={24} />
                  </div>
                </div>
                <h3 className="text-gray-400 text-sm font-semibold">Total Tests</h3>
                <p className="text-4xl font-extrabold mt-1 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  {loadingTests ? "..." : totalTests}
                </p>
              </motion.div>

              <motion.div variants={cardVariants} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-pink-500/50 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-pink-500/10 rounded-2xl text-pink-400 group-hover:scale-110 transition-transform">
                    <BookOpen size={24} />
                  </div>
                </div>
                <h3 className="text-gray-400 text-sm font-semibold">Total Questions</h3>
                <p className="text-4xl font-extrabold mt-1 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  {loadingTests ? "..." : totalQuestions}
                </p>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <PlusCircle className="text-purple-400" size={20} />
                  Quick Actions
                </h2>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => { setActiveTab("tests"); setShowCreateTest(true); }}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 px-5 rounded-2xl transition cursor-pointer"
                  >
                    <PlusCircle size={18} />
                    Create New Test
                  </button>
                  <button
                    onClick={() => setActiveTab("users")}
                    className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-3 px-5 rounded-2xl transition cursor-pointer"
                  >
                    <Users size={18} />
                    View All Users
                  </button>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <UserCheck className="text-blue-400" size={20} />
                  Active Admin Session
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-300">
                    <UserCheck size={16} className="text-purple-400" />
                    <span className="font-medium">{user?.name || "Administrator"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400 text-sm">
                    <Mail size={14} />
                    <span>{user?.email || "admin@acm.org"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400 text-sm">
                    <Shield size={14} className="text-yellow-400" />
                    <span className="text-yellow-400 font-semibold uppercase text-xs tracking-wider">Admin</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ===== USERS TAB ===== */}
        {activeTab === "users" && (
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Users className="text-blue-400" size={22} />
                Registered Users
              </h2>
              <button
                onClick={fetchUsers}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl text-sm transition cursor-pointer"
              >
                <RefreshCw size={14} />
                Refresh
              </button>
            </div>

            {loadingUsers ? (
              <div className="flex items-center justify-center py-20 text-gray-500">
                <RefreshCw className="animate-spin mr-3" size={20} />
                Loading users...
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-20 text-gray-500">No users found.</div>
            ) : (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
                {/* Table Header */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-white/5 text-xs uppercase font-bold tracking-wider text-gray-500 border-b border-white/10">
                  <div className="col-span-4">Name</div>
                  <div className="col-span-4">Email</div>
                  <div className="col-span-2">Role</div>
                  <div className="col-span-2">Joined</div>
                </div>

                {/* Table Rows */}
                {users.map((u) => (
                  <div
                    key={u._id}
                    className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <div className="col-span-4 font-semibold text-gray-200 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="truncate">{u.name}</span>
                    </div>
                    <div className="col-span-4 text-gray-400 text-sm flex items-center truncate">
                      {u.email}
                    </div>
                    <div className="col-span-2 flex items-center">
                      <span
                        className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                          u.role === "admin"
                            ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                            : "bg-blue-500/10 text-blue-400"
                        }`}
                      >
                        {u.role || "user"}
                      </span>
                    </div>
                    <div className="col-span-2 text-gray-500 text-sm flex items-center">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== TESTS TAB ===== */}
        {activeTab === "tests" && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <FileText className="text-purple-400" size={22} />
                Manage Tests
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={fetchTests}
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl text-sm transition cursor-pointer"
                >
                  <RefreshCw size={14} />
                  Refresh
                </button>
                <button
                  onClick={() => setShowCreateTest(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold px-5 py-2 rounded-xl transition cursor-pointer"
                >
                  <PlusCircle size={16} />
                  Create Test
                </button>
              </div>
            </div>

            {/* Existing Tests List */}
            {loadingTests ? (
              <div className="flex items-center justify-center py-20 text-gray-500">
                <RefreshCw className="animate-spin mr-3" size={20} />
                Loading tests...
              </div>
            ) : tests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-3">
                <FileText size={40} />
                <span>No tests created yet.</span>
                <button
                  onClick={() => setShowCreateTest(true)}
                  className="mt-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl cursor-pointer"
                >
                  Create Your First Test
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tests.map((test) => (
                  <div
                    key={test._id}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-purple-500/30 transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-100">{test.title}</h3>
                        <p className="text-sm text-purple-400 font-semibold mt-1">{test.subject}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteTest(test._id)}
                        className="p-2 rounded-xl hover:bg-red-600/20 text-gray-500 hover:text-red-400 transition cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="flex gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <BookOpen size={14} />
                        {test.questions?.length || 0} questions
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {test.duration || 20} mins
                      </span>
                    </div>

                    <div className="mt-3 text-xs text-gray-500">
                      Created: {new Date(test.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ===== CREATE TEST MODAL ===== */}
      {showCreateTest && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center overflow-y-auto py-10 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-3xl bg-gray-950 border border-white/10 rounded-3xl p-8 shadow-2xl my-10"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Create New Test
              </h3>
              <button
                onClick={() => { setShowCreateTest(false); setCreateError(""); setCreateSuccess(""); }}
                className="p-2 hover:bg-white/10 rounded-xl transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {createError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {createError}
              </div>
            )}
            {createSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                {createSuccess}
              </div>
            )}

            <form onSubmit={handleCreateTest} className="flex flex-col gap-5">
              {/* Test Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="text-gray-400 text-xs font-semibold mb-1 block">Test Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Midterm Quiz"
                    value={testTitle}
                    onChange={(e) => setTestTitle(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                    required
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="text-gray-400 text-xs font-semibold mb-1 block">Subject</label>
                  <input
                    type="text"
                    placeholder="e.g. Data Structures"
                    value={testSubject}
                    onChange={(e) => setTestSubject(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                    required
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="text-gray-400 text-xs font-semibold mb-1 block">Duration (mins)</label>
                  <input
                    type="number"
                    min={1}
                    max={180}
                    value={testDuration}
                    onChange={(e) => setTestDuration(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                  />
                </div>
              </div>

              {/* Questions Section */}
              <div className="border-t border-white/10 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-lg">Questions ({questions.length})</h4>
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition cursor-pointer"
                  >
                    <PlusCircle size={16} />
                    Add Question
                  </button>
                </div>

                <div className="flex flex-col gap-6 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                  {questions.map((q, qIndex) => (
                    <div key={qIndex} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-bold text-purple-400">Question {qIndex + 1}</span>
                        {questions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeQuestion(qIndex)}
                            className="text-gray-500 hover:text-red-400 transition cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>

                      <input
                        type="text"
                        placeholder="Enter question text..."
                        value={q.question}
                        onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors text-sm mb-3"
                        required
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {q.options.map((opt, optIndex) => (
                          <div key={optIndex} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`correct-${qIndex}`}
                              checked={q.answer === opt && opt !== ""}
                              onChange={() => setCorrectAnswer(qIndex, opt)}
                              className="w-4 h-4 accent-emerald-500 cursor-pointer flex-shrink-0"
                              title="Mark as correct answer"
                            />
                            <input
                              type="text"
                              placeholder={`Option ${optIndex + 1}`}
                              value={opt}
                              onChange={(e) => {
                                if (q.answer === opt) {
                                  setCorrectAnswer(qIndex, e.target.value);
                                }
                                updateOption(qIndex, optIndex, e.target.value);
                              }}
                              className="flex-1 bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                              required
                            />
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Select the radio button next to the correct answer.
                        {q.answer && <span className="text-emerald-400 ml-1">✓ Correct: {q.answer}</span>}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-4 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => { setShowCreateTest(false); setCreateError(""); setCreateSuccess(""); }}
                  className="flex-1 py-3 border border-white/10 rounded-xl hover:bg-white/5 transition font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 font-bold rounded-xl transition cursor-pointer"
                >
                  Create Test
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
}
