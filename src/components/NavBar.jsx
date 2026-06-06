"use client";

import Link from 'next/link';
import React, { useState } from 'react';

const navLinks = [
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Company", href: "/company" },
  { label: "Pricing", href: "/pricing" },
];

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <nav className="bg-[#111214] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="h-16 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-0.5 text-white font-bold text-xl tracking-tight shrink-0">
            hire
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white text-[10px] font-black mx-0.5">
              oo
            </span>
            p
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-400 font-medium hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <div className="w-px h-5 bg-white/10 mx-1" />
            <Link
              href="/signin"
              className="text-sm font-medium text-indigo-400 hover:bg-indigo-500/10 px-3.5 py-2 rounded-lg transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="text-sm font-semibold text-white bg-indigo-500 hover:bg-indigo-600 px-5 py-2 rounded-lg transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile: CTA + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/signup"
              className="text-xs font-semibold text-white bg-indigo-500 hover:bg-indigo-600 px-3.5 py-2 rounded-lg transition-colors"
            >
              Get Started
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              {isOpen ? (
                // X icon
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                // Hamburger icon
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#111214]">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 px-3 py-2.5 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}

            <div className="h-px bg-white/10 my-2" />

            <Link
              href="/signin"
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium text-indigo-400 border border-indigo-500/40 hover:bg-indigo-500/10 px-3 py-2.5 rounded-lg transition-colors text-center"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              onClick={() => setIsOpen(false)}
              className="text-sm font-semibold text-white bg-indigo-500 hover:bg-indigo-600 px-3 py-2.5 rounded-lg transition-colors text-center"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
    );
};

export default NavBar;