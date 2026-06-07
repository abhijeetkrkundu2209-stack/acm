"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Menu, X, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [navBg, setNavBg] = useState(false);
  const { user, signout, loading } = useAuth();

  useEffect(() => {
    const onScroll = () => setNavBg(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`
        fixed top-0 left-0 w-full z-50 
        transition-all duration-300 
        ${navBg ? "backdrop-blur-lg bg-white/10 border-b border-white/20 shadow-lg" 
                : "backdrop-blur-md bg-white/5"}
      `}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/">
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent cursor-pointer">
            ACM - HIT
          </h1>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center text-lg font-medium">
          {["Home", "About", "Events", "Team", "Contact"].map((item) => (
            <Link
              key={item}
              href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              className="relative group cursor-pointer"
            >
              <span className="text-white/90 group-hover:text-white transition">
                {item}
              </span>

              {/* Underline animation */}
              <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
          ))}
          
          {/* Auth Section */}
          {!loading && (
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/20">
              {user ? (
                <>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 text-white/90 bg-white/10 px-4 py-2 rounded-xl border border-white/10 hover:bg-white/15 transition"
                  >
                    <UserIcon size={16} className="text-blue-400" />
                    <span className="text-sm font-semibold max-w-[120px] truncate">{user.name}</span>
                  </Link>
                  <button
                    onClick={signout}
                    className="flex items-center gap-2 text-white/90 hover:text-red-400 bg-red-600/20 hover:bg-red-600/30 px-4 py-2 rounded-xl border border-red-500/20 transition cursor-pointer"
                  >
                    <LogOut size={16} />
                    <span className="text-sm font-semibold">Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/signin"
                    className="text-white/90 hover:text-white hover:bg-white/10 px-4 py-2 rounded-xl transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-5 py-2 rounded-xl transition shadow-md shadow-blue-500/20"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col items-center gap-6 py-6 bg-white/10 backdrop-blur-xl border-t border-white/20">
          {["Home", "About", "Events", "Team", "Contact"].map((item) => (
            <Link
              key={item}
              href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              onClick={() => setIsOpen(false)}
              className="text-white/90 text-lg hover:text-white transition"
            >
              {item}
            </Link>
          ))}
          
          {/* Auth Section for Mobile */}
          {!loading && (
            <div className="flex flex-col items-center gap-4 w-full px-6 pt-4 border-t border-white/10">
              {user ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 text-white/90 bg-white/10 px-6 py-2.5 rounded-xl border border-white/10 w-full justify-center hover:bg-white/15 transition"
                  >
                    <UserIcon size={18} className="text-blue-400" />
                    <span className="text-base font-semibold">{user.name}</span>
                  </Link>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      signout();
                    }}
                    className="flex items-center gap-2 text-white bg-red-600 hover:bg-red-700 px-6 py-2.5 rounded-xl transition w-full justify-center shadow-lg cursor-pointer"
                  >
                    <LogOut size={18} />
                    <span className="text-base font-semibold">Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/signin"
                    onClick={() => setIsOpen(false)}
                    className="text-white/90 hover:text-white hover:bg-white/10 px-6 py-2.5 rounded-xl transition w-full text-center border border-white/20"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setIsOpen(false)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-xl transition w-full text-center shadow-lg"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
