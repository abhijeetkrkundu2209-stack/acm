"use client";
import React from "react";
import { motion } from "framer-motion";

const EventsPage = () => {
  const events = [
    {
      id: 1,
      title: "Hackathon 2025",
      date: "12 Jan 2025",
      desc: "A 24-hour coding challenge to build innovative solutions.",
    },
    {
      id: 2,
      title: "Web Dev Bootcamp",
      date: "18 Feb 2025",
      desc: "Learn full-stack web development with hands-on workshops.",
    },
    {
      id: 3,
      title: "AI / ML Seminar",
      date: "28 March 2025",
      desc: "Explore Machine Learning, Neural Networks & AI applications.",
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white px-6 md:px-16 py-20">

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-5xl font-extrabold text-center mb-14"
      >
        Upcoming Events
      </motion.h1>

      {/* Events Grid */}
      <div className="grid md:grid-cols-3 gap-12">
        {events.map((event) => (
          <motion.div
            key={event.id}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 180 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl backdrop-blur-xl"
          >
            <h2 className="text-2xl font-bold text-blue-400 mb-2">
              {event.title}
            </h2>
            <p className="text-sm text-white/60 mb-4">{event.date}</p>
            <p className="text-white/80">{event.desc}</p>

            <button className="mt-6 px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition-all">
              Register →
            </button>
          </motion.div>
        ))}
      </div>

      {/* Past Events Section */}
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-4xl font-bold mt-24 text-center"
      >
        Past Events
      </motion.h2>

      <div className="grid md:grid-cols-3 gap-12 mt-10">
        {[1, 2, 3].map((id) => (
          <motion.div
            key={id}
            whileHover={{ scale: 1.05 }}
            className="p-8 bg-white/5 border border-white/10 rounded-2xl shadow-xl"
          >
            <div className="w-full h-40 rounded-xl bg-blue-600/20 mb-4" />
            <h3 className="text-xl font-semibold">Past Event {id}</h3>
            <p className="text-white/70 text-sm mt-2">
              Amazing moments captured during Event {id}.
            </p>
          </motion.div>
        ))}
      </div>

    </main>
  );
};

export default EventsPage;
