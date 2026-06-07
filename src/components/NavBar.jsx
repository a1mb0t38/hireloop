"use client";

import Link from "next/link";
import React, { useState } from "react";

const navLinks = [
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Company", href: "/company" },
  { label: "Pricing", href: "/pricing" },
];

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="py-6 px-4">
      <div className="max-w-6xl mx-auto">
        <nav className="bg-[#17181C]/90 backdrop-blur-md rounded-2xl px-6 lg:px-8 h-16 flex items-center justify-between shadow-xl border border-white/5">

          {/* Logo */}
          <Link href="/" className="flex items-center text-3xl font-bold">
            <span className="text-blue-500">hire</span>
            <span className="text-orange-500">loop</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-300 hover:text-white transition"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-5">
            <div className="h-5 w-px bg-white/20" />

            <Link
              href="/signin"
              className="text-indigo-400 font-medium hover:text-indigo-300 transition"
            >
              Sign In
            </Link>

            <Link
              href="/signup"
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium transition shadow-lg shadow-indigo-500/30"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white"
          >
            {isOpen ? "✕" : "☰"}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-3 bg-[#17181C] rounded-xl border border-white/10 p-4">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-gray-300 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}

              <hr className="border-white/10" />

              <Link
                href="/signin"
                className="text-indigo-400"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>

              <Link
                href="/signup"
                className="bg-indigo-500 text-white text-center py-2 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavBar;