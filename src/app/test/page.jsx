"use client";
import React, { useState, useEffect } from "react";


import { motion } from "framer-motion";
import confetti from "canvas-confetti";

// Proper Fisher-Yates Shuffle (kept)

const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export default function TestPage() {
  const [studentName, setStudentName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [selectedTest, setSelectedTest] = useState(null); // holds test object
const [paymentCompleted, setPaymentCompleted] = useState(false); // Razorpay payment flag
  const [tests, setTests] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20 * 60); // default, will adjust per test duration
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loadingTests, setLoadingTests] = useState(true);

  // Fetch available tests on component mount
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await fetch('/api/tests');
        if (res.ok) {
          const data = await res.json();
          setTests(data.tests || []);
        }
      } catch (err) {
        console.error('Failed to fetch tests:', err);
      } finally {
        setLoadingTests(false);
      }
    };
    fetchTests();
  }, []);

  // Timer Logic
  useEffect(() => {
    if (questions.length > 0 && timeLeft > 0 && !isSubmitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isSubmitted) {
      handleSubmit();
    }
  }, [timeLeft, questions.length, isSubmitted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  function startTestDirectly() {
    // Use test's questions, shuffle order and options
    const shuffledQuestions = shuffleArray(selectedTest.questions || []).map(q => ({
      ...q,
      options: shuffleArray(q.options)
    }));
    setQuestions(shuffledQuestions);
    // Set timer based on test duration (in minutes)
    const duration = selectedTest.duration || 20;
    setTimeLeft(duration * 60);
    setCurrentQIndex(0);
    setAnswers({});
    setScore(null);
    setIsSubmitted(false);
  }

  async function handleStartTest() {
    if (!studentName.trim() || !rollNumber.trim() || !selectedTest) {
      alert("Please fill all fields and select a test!");
      return;
    }
    // If test is paid, ensure payment is done
    if (selectedTest?.isPaid && !paymentCompleted) {
      await handlePayAndStart();
      return;
    }
    startTestDirectly();
  }

  const handleAnswer = (qIndex, option) => {
    if (isSubmitted) return;
    setAnswers(prev => ({ ...prev, [qIndex]: option }));
  };

const handleSubmit = async () => {
  let sc = 0;
  questions.forEach((q, i) => {
    if (answers[i] === q.answer) sc++;
  });
  setScore(sc);
  setIsSubmitted(true);

  // Confetti if score ≥ 70%
  if ((sc / questions.length) >= 0.7) {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });
  }

  // Send submission to backend
  try {
    const res = await fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentName,
        rollNumber,
        subject: selectedTest?.subject || '',
        answers,
        score: sc,
        totalQuestions: questions.length
      })
    });
    if (!res.ok) {
      console.error('Failed to submit test:', await res.text());
    }
  } catch (err) {
    console.error('Error submitting test:', err);
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });
};

  const progress = questions.length > 0 ? (Object.keys(answers).length / questions.length) * 100 : 0;

  if (questions.length === 0) {
    if (loadingTests) {
      return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-blue-950 text-white">
          <div className="animate-spin mr-2" />Loading tests...
        </main>
      );
    }
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-950 text-white flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 shadow-2xl"
        >
          <h1 className="text-5xl font-extrabold text-center mb-10 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Test Yourself
          </h1>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 focus:border-blue-500 focus:outline-none transition"
                placeholder="John Doe"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Roll Number</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 focus:border-blue-500 focus:outline-none transition"
                placeholder="CSE2023001"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Select Test</label>
              <select
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 focus:border-blue-500 focus:outline-none transition"
                value={selectedTest ? selectedTest._id : ''}
                onChange={(e) => {
                  const test = tests.find(t => t._id === e.target.value);
                  setSelectedTest(test);
                }}
              >
                <option value="">-- Choose Test --</option>
                {tests.map((t) => (
                  <option key={t._id} value={t._id}>{t.title} ({t.subject})</option>
                ))}
              </select>
                {selectedTest && (
                  <p className="mt-2 text-sm text-gray-400">{selectedTest.isPaid ? `Paid Test: ₹${selectedTest.price}` : 'Free Test'}</p>
                )}
            </div>

            <button
              onClick={handleStartTest}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 rounded-xl font-bold text-lg transition transform hover:scale-105"
            >
              {selectedTest?.isPaid && !paymentCompleted ? `Pay ₹${selectedTest.price} & Start Test` : "Start Test"}
            </button>
          </div>
        </motion.div>
      </main>
    );
  }

  // Payment handling and direct start for paid tests
  async function handlePayAndStart() {
    try {
      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: selectedTest.price * 100, testId: selectedTest._id }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to create payment order. Please try again.');
        return;
      }
      // Ensure Razorpay script is loaded
      if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }
      const options = {
        key: data.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY || 'rzp_test_dummy',
        amount: data.amount,
        currency: data.currency,
        name: selectedTest.title,
        description: selectedTest.subject,
        order_id: data.orderId,
        handler: function (response) {
          setPaymentCompleted(true);
          // Start the test directly!
          const shuffledQuestions = shuffleArray(selectedTest.questions || []).map(q => ({
            ...q,
            options: shuffleArray(q.options)
          }));
          setQuestions(shuffledQuestions);
          const duration = selectedTest.duration || 20;
          setTimeLeft(duration * 60);
          setCurrentQIndex(0);
          setAnswers({});
          setScore(null);
          setIsSubmitted(false);
        },
        prefill: {
          name: studentName,
          email: '',
        },
        theme: { color: '#3399cc' },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Payment flow error:', err);
      alert('Payment flow failed. Please try again.');
    }
  }

  // Test Running or Submitted
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-950 text-white py-28 px-4">

      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">{studentName} - {selectedTest ? selectedTest.subject : ''}</h1>
        <p className="text-gray-300">Roll No: {rollNumber}</p>

        <div className="flex justify-between items-center mt-6 flex-wrap gap-4">
          <div className="text-2xl font-bold text-red-400">
            Time Left: <span className="text-3xl">{formatTime(timeLeft)}</span>
          </div>

          <div className="text-lg">
            Question {currentQIndex + 1} of {questions.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 bg-white/10 rounded-full h-3 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-green-500 to-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Current Question */}
      <div className="max-w-3xl mx-auto">
        <motion.div
          key={currentQIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl"
        >
          <h2 className="text-2xl font-bold mb-6">
            {currentQIndex + 1}. {questions[currentQIndex].question}
          </h2>

          <div className="space-y-4">
            {questions[currentQIndex].options.map((option, i) => {
              const isCorrect = option === questions[currentQIndex].answer;
              const isSelected = answers[currentQIndex] === option;

              return (
                <label
                  key={i}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                    isSubmitted
                      ? isCorrect
                        ? "bg-green-500/30 border-green-500"
                        : isSelected
                        ? "bg-red-500/30 border-red-500"
                        : "bg-white/5 border-white/20"
                      : "bg-white/10 border-white/30 hover:bg-white/20"
                  }`}
                >
                  <input
                    type="radio"
                    name={`q-${currentQIndex}`}
                    checked={isSelected}
                    onChange={() => handleAnswer(currentQIndex, option)}
                    disabled={isSubmitted}
                    className="w-5 h-5 text-blue-500"
                  />
                  <span className="text-lg">{option}</span>
                  {isSubmitted && isCorrect && <span className="ml-auto text-green-300 font-bold">Correct</span>}
                  {isSubmitted && isSelected && !isCorrect && <span className="ml-auto text-red-300 font-bold">Wrong</span>}
                </label>
              );
            })}
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setCurrentQIndex(Math.max(0, currentQIndex - 1))}
            disabled={currentQIndex === 0}
            className="px-6 py-3 bg-white/10 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition"
          >
            Previous
          </button>

          {currentQIndex < questions.length - 1 ? (
            <button
              onClick={() => setCurrentQIndex(currentQIndex + 1)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl transition"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitted}
              className="px-10 py-3 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 rounded-xl font-bold text-lg transition transform hover:scale-105 disabled:opacity-50"
            >
              {isSubmitted ? "Submitted!" : "Submit Test"}
            </button>
          )}
        </div>
      </div>

      {/* Final Score */}
      {isSubmitted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mt-16"
        >
          <div className="text-6xl font-extrabold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            {score} / {questions.length}
          </div>
          <p className="text-2xl mt-4">
            {score >= 8 ? "Excellent! Keep it up!" : score >= 6 ? "Good Effort!" : "Better luck next time!"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-8 px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-xl font-bold text-lg transition"
          >
            Take New Test
          </button>
        </motion.div>
      )}
    </main>
  );
}