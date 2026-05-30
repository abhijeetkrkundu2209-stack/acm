"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

// ---------------- Images ----------------
const marqueeImages = [
  "image1.jpg",
  "image2.jpg",
  "image3.jpg",
  "image4.jpg",
  "image5.jpg",
  "image6.jpg",
  "image7.jpg",
  "image8.jpg",
];

const teamMembers = [
  { name: "Dr. Soumen Paul", img: "hod_img.jpg", gradient: "from-pink-500 to-purple-600" },
  { name: "Mr Manasija Bhattacharya", img: "mb_img.jpeg", gradient: "from-blue-500 to-cyan-600" },
  { name: "Moumita Ghosh", img: "moumita_img.jpg", gradient: "from-green-500 to-emerald-600" },
  { name: "Sk. Sahnawaj", img: "sehnwaj_img.jpg", gradient: "from-orange-500 to-red-600" },
];

// ---------------- Counter Component ----------------
const Counter = ({ end }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const inc = end / (duration / 16);
    const timer = setInterval(() => {
      start += inc;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end]);

  return (
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 text-5xl font-bold">
      {count}+
    </span>
  );
};

// ---------------- Page Component ----------------
export default function ACMPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleMove = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
    const handleScroll = () => setScrollY(window.scrollY);

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const parallaxY = scrollY * -0.2;

  // ---------- Motion Variants ----------
  const titleVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: "easeOut" },
    },
  };

  const subtitleVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.8 } },
  };

  const buttonVariant = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { delay: 0.5, duration: 0.6 } },
  };

  const cardVariant = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  return (
    <div className="relative">
      {/* Mouse Glow */}
      <div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(59,130,246,0.15), transparent 80%)`,
        }}
      />

      <main className="bg-black text-white relative overflow-hidden">

        {/* HERO SECTION */}
        <section className="min-h-screen flex items-center justify-center relative px-6 pb-32">

          {/* Background Blobs */}
          <div className="absolute inset-0" style={{ transform: `translateY(${parallaxY}px)` }}>
            <div className="absolute top-20 left-20 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-30" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-30" />
          </div>

          <div className="relative z-10 text-center max-w-5xl mx-auto">
            {/* Animated Title */}
            <motion.h1
              variants={titleVariant}
              initial="hidden"
              animate="visible"
              className="text-6xl md:text-8xl font-black"
            >
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                ACM HIT
              </span>
              <br />
              <span className="text-white/90 text-5xl md:text-7xl">Haldia</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={subtitleVariant}
              initial="hidden"
              animate="visible"
              className="text-xl md:text-2xl mt-6 text-gray-300"
            >
              Empowering the next generation of tech innovators
            </motion.p>

            {/* Buttons */}
            <motion.div
              variants={buttonVariant}
              initial="hidden"
              animate="visible"
              className="mt-10 flex flex-col sm:flex-row gap-6 justify-center"
            >
              <button className="group px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all mx-auto sm:mx-0">
                Join ACM Now
                <span className="inline-block ml-2 group-hover:translate-x-2 transition-transform">→</span>
              </button>

              <button
                onClick={() => (window.location.href = "/test")}
                className="px-10 py-4 border-2 border-white/30 rounded-2xl text-lg hover:bg-white/10 transition-all"
              >
                Go to Test Page
              </button>
            </motion.div>
          </div>

          {/* Infinite Marquee */}
          <div className="absolute bottom-0 w-full overflow-hidden py-8">
            <div className="flex gap-8 animate-marquee">
              {[...marqueeImages, ...marqueeImages, ...marqueeImages].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  className="w-80 h-48 rounded-2xl object-cover border border-white/20 shadow-2xl flex-shrink-0"
                  alt=""
                />
              ))}
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
            {[{ icon: "👥", value: 250, label: "Members" },
              { icon: "💻", value: 45, label: "Projects" },
              { icon: "📅", value: 32, label: "Events" },
              { icon: "✨", value: 18, label: "Workshops" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                variants={cardVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="p-8 bg-white/5 rounded-3xl backdrop-blur-xl border border-white/10 hover:border-blue-500/50 transform hover:scale-105 transition-all"
              >
                <div className="text-6xl mb-4">{stat.icon}</div>
                <Counter end={stat.value} />
                <p className="text-gray-400 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ABOUT SECTION (Animated Cards) */}
        <section className="py-20 px-6 md:px-20">
          <h2 className="text-5xl md:text-6xl font-black text-center mb-16">
            Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">ACM HIT</span>?
          </h2>

          <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {[{ title: "Innovation Lab", desc: "Build real-world projects with mentorship.", icon: "🚀" },
              { title: "Global Network", desc: "Connect with 100K+ ACM members worldwide.", icon: "🌐" },
              { title: "Career Growth", desc: "Hackathons, internships & placements.", icon: "📈" },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={cardVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="p-10 bg-white/10 rounded-3xl backdrop-blur-xl border border-white/20 hover:-translate-y-5 transition-all"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 flex items-center justify-center text-3xl">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-300">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* TEAM MEMBERS */}
        <section className="py-20 px-6">
          <h2 className="text-5xl font-black text-center mb-16">
            Meet Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Core Members
            </span>
          </h2>

          <div className="grid md:grid-cols-4 gap-10 max-w-7xl mx-auto">
            {teamMembers.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="group relative transition-all hover:-translate-y-5"
              >
                <div className="relative overflow-hidden rounded-3xl">
                  <img
                    src={m.img}
                    className="absolute inset-0 w-full h-full object-cover opacity-180"
                  />
                  <div
                    className={`w-full h-80 bg-gradient-to-br ${m.gradient} rounded-3xl group-hover:scale-110 transition-transform duration-300`}
                  />
                  <div className="absolute bottom-6 left-6">
                    <h3 className="text-2xl font-bold">{m.name}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 text-center">
          <motion.div
            variants={cardVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-4xl mx-auto p-16 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-2xl border border-white/20 rounded-3xl hover:scale-105 transition-transform"
          >
            <h2 className="text-5xl font-black mb-6">Ready to Shape the Future?</h2>
            <p className="text-xl text-gray-300 mb-10">Join the most active tech community in HIT</p>
            <button className="px-12 py-5 bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl text-xl font-bold hover:scale-110 transition-transform">
              Become a Member Today
            </button>
          </motion.div>
        </section>

        {/* FOOTER */}
        <footer className="py-12 text-center border-t border-white/10">
          <p className="text-gray-500">© {new Date().getFullYear()} ACM Student Chapter • HIT Haldia</p>
        </footer>
      </main>

      {/* Marquee Animation */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
          width: fit-content;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
