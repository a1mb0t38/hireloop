"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { motion } from "motion/react"

const navLinks = [
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Company", href: "/company" },
  { label: "Pricing", href: "/pricing" },
];

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();

  // ── session ──────────────────────────────────────────────────────────────
  const { data: session, isPending } = authClient.useSession();
  const isLoggedIn = !!session?.user;

  // ── logout ───────────────────────────────────────────────────────────────
  const handleSignOut = async () => {
    setLoggingOut(true);
    await authClient.signOut();
    setLoggingOut(false);
    setIsOpen(false);
    router.push("/");
    router.refresh(); // clear server-side session cache
  };

  return (
    <motion.header initial={{ scale: 0 }} animate={{ scale: 1 }} className="py-6 px-4">
      <div className="max-w-6xl mx-auto">
        <nav className="bg-[#17181C]/90 backdrop-blur-md rounded-2xl px-6 lg:px-8 h-16 flex items-center justify-between shadow-xl border border-white/5">

          {/* Logo */}
          <Link href="/" className="flex items-center text-3xl font-bold">
            <span className="text-blue-500">hire</span>
            <span className="text-orange-500">loop</span>
          </Link>

          {/* Desktop nav links */}
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

          {/* Desktop auth buttons */}
          <div className="hidden md:flex items-center gap-5">
            <div className="h-5 w-px bg-white/20" />

            {/* Show skeleton while session loads */}
            {isPending ? (
              <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
            ) : isLoggedIn ? (
              <>
                {/* User avatar / name */}
                <span className="text-sm text-gray-300 truncate max-w-[140px]">
                  👋 {session.user.name ?? session.user.email}
                </span>

                {/* Logout button */}
                <button
                  
                  onClick={handleSignOut}
                  disabled={loggingOut}
                  className="border border-red-500/50 text-red-400 hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-2.5 rounded-xl text-sm font-medium transition"
                >
                  {loggingOut ? "Signing out…" : "Log Out"}
                </button>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white text-lg"
            aria-label="Toggle menu"
          >
            {isOpen ? "✕" : "☰"}
          </button>
        </nav>

        {/* Mobile drawer */}
        {isOpen && (
          <div className="md:hidden mt-3 bg-[#17181C] rounded-xl border border-white/10 p-4">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-gray-300 hover:text-white transition"
                >
                  {link.label}
                </Link>
              ))}

              <hr className="border-white/10" />

              {isPending ? (
                <div className="h-4 w-32 bg-white/10 rounded animate-pulse" />
              ) : isLoggedIn ? (
                <>
                  <span className="text-sm text-gray-400 truncate">
                    👋 {session.user.name ?? session.user.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    disabled={loggingOut}
                    className="border border-red-500/50 text-red-400 hover:bg-red-500/10 disabled:opacity-50 py-2 rounded-lg text-sm font-medium transition text-center"
                  >
                    {loggingOut ? "Signing out…" : "Log Out"}
                  </button>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.header>
  );
};

export default NavBar;