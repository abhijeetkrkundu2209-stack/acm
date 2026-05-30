"use client";
import React from "react";
import { motion } from "framer-motion";

const About = () => {
  return (
    <main className="min-h-screen bg-black text-white px-6 md:px-20 py-20">

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-5xl font-extrabold text-center mb-14"
      >
        About ACM
      </motion.h1>

      {/* About Content Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-10 backdrop-blur-xl shadow-2xl"
      >
        <h2 className="text-3xl font-bold mb-5 text-blue-400">Who We Are</h2>
        <p className="text-white/80 leading-relaxed">
          ACM (Association for Computing Machinery) is the world’s largest
          educational and scientific computing organization.  
          <br /><br />
          ACM HIT Haldia is dedicated to creating a strong tech community by
          organizing workshops, coding contests, hackathons, tech talks, and
          innovation-driven events for students.
        </p>
      </motion.div>

      {/* 3 Cards Section */}
      <div className="grid md:grid-cols-3 gap-10 mt-20">
        {[
          {
            title: "Our Vision",
            desc: "To build a future-ready tech community that collaborates and innovates.",
          },
          {
            title: "Our Mission",
            desc: "To empower students with knowledge, projects, exposure & global opportunities.",
          },
          {
            title: "Our Values",
            desc: "Innovation, Integrity, Teamwork, Growth & Community Support.",
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="p-8 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl shadow-xl"
          >
            <h3 className="text-2xl font-semibold mb-3 text-blue-300">
              {item.title}
            </h3>
            <p className="text-white/70">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Footer Text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.7 }}
        className="text-center mt-20 text-white/50"
      >
        © {new Date().getFullYear()} ACM HIT Haldia. All Rights Reserved.
      </motion.p>
    </main>
  );
};

export default About;
