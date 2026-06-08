"use client";

import Image from "next/image";
import globe from "@/images/globe.png";


const stats = [
  { icon: "🏢", value: "50K", label: "Active Jobs" },
  { icon: "📊", value: "12K", label: "Companies" },
  { icon: "🔍", value: "2M", label: "Job Seekers" },
  { icon: "⭐", value: "97%", label: "Satisfaction Rate" },
];

const trending = ["Product Designer", "AI Engineering", "Dev-ops Engineer"];

// Deterministic stars — no Math.random() to avoid hydration mismatch
const STARS = Array.from({ length: 70 }, (_, i) => ({
  id: i,
  width:   ((i * 37 + 13) % 20) / 10 + 1,
  height:  ((i * 53 + 7)  % 20) / 10 + 1,
  top:     ((i * 71 + 19) % 900) / 10,
  left:    ((i * 97 + 3)  % 1000) / 10,
  opacity: ((i * 41 + 11) % 60)  / 100 + 0.1,
}));

export default function HeroBanner() {
  return (
    <section  className="relative w-full min-h-screen bg-black overflow-hidden flex flex-col items-center">

      {/* ── Stars ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {STARS.map((s) => (
          <div
            key={s.id}
            className="absolute rounded-full bg-white"
            style={{
              width:   s.width + "px",
              height:  s.height + "px",
              top:     s.top + "%",
              left:    s.left + "%",
              opacity: s.opacity,
            }}
          />
        ))}
      </div>

      {/* ── Globe — centered, bottom half visible ── */}
      <div
        className="absolute left-1/2 pointer-events-none select-none"
        style={{
          bottom: 0,
          transform: "translateX(-50%) translateY(35%)",
          width: "min(180vw, 1700px)",
          aspectRatio: "1 / 1",
        }}
      >
        <Image
          src={globe}
          alt="Globe"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col items-center w-full px-4 sm:px-6 pt-10 sm:pt-14">

        {/* Badge */}
        <div className="flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-[10px] sm:text-xs text-gray-400 tracking-widest uppercase">
          <span className="text-orange-400">🔥</span>
          <span>
            <span className="text-white font-semibold">50,000+</span> New Jobs This Month
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white text-center leading-tight mb-3 tracking-tight max-w-xl">
          Find Your Dream Job Today
        </h1>

        {/* Subtitle */}
        <p className="text-gray-400 text-xs sm:text-sm text-center max-w-sm sm:max-w-md mb-7 leading-relaxed">
          HireLoop connects top talent with world-class companies. Browse thousands of
          curated opportunities and land your next role — faster.
        </p>

        {/* ── Search bar desktop ── */}
        <div className="hidden sm:flex w-full max-w-xl items-center bg-[#0e0e16] border border-white/10 rounded-xl overflow-hidden mb-4 shadow-xl shadow-black/50">
          <div className="flex items-center gap-2 flex-1 px-4 py-3 min-w-0">
            <SearchIcon />
            <input
              type="text"
              placeholder="Job title, skill or company"
              className="bg-transparent text-sm text-white placeholder-gray-500 outline-none w-full min-w-0"
            />
          </div>
          <div className="w-px h-5 bg-white/10 shrink-0" />
          <div className="flex items-center gap-2 flex-1 px-4 py-3 min-w-0">
            <LocationIcon />
            <input
              type="text"
              placeholder="Location or Remote"
              className="bg-transparent text-sm text-white placeholder-gray-500 outline-none w-full min-w-0"
            />
          </div>
          <button className="m-1.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 transition-colors rounded-lg px-4 py-2.5 shrink-0">
            <SearchIcon white />
          </button>
        </div>

        {/* ── Search bar mobile ── */}
        <div className="flex sm:hidden flex-col gap-2 w-full max-w-sm mb-4">
          <div className="flex items-center gap-2 bg-[#0e0e16] border border-white/10 rounded-xl px-4 py-3">
            <SearchIcon />
            <input type="text" placeholder="Job title, skill or company"
              className="bg-transparent text-sm text-white placeholder-gray-500 outline-none w-full" />
          </div>
          <div className="flex items-center gap-2 bg-[#0e0e16] border border-white/10 rounded-xl px-4 py-3">
            <LocationIcon />
            <input type="text" placeholder="Location or Remote"
              className="bg-transparent text-sm text-white placeholder-gray-500 outline-none w-full" />
          </div>
          <button className="w-full bg-indigo-600 hover:bg-indigo-500 transition-colors rounded-xl py-3 flex items-center justify-center gap-2 text-white text-sm font-semibold">
            <SearchIcon white /> Search Jobs
          </button>
        </div>

        {/* Trending */}
        <div className="flex flex-wrap items-center gap-2 justify-center">
          <span className="text-gray-500 text-xs">Trending Position</span>
          {trending.map((tag) => (
            <button key={tag}
              className="px-3 py-1 rounded-full text-xs text-gray-300 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tagline — floats above the globe ── */}
      <div className="relative z-10 text-center px-4 mt-30 sm:mt-40 md:mt-50">
        <p className="text-white/85 text-sm sm:text-base md:text-lg font-light leading-snug drop-shadow-lg">
          Assisting over{" "}
          <span className="text-indigo-300 font-semibold">15,000 job seekers</span>
          <br />find their dream positions.
        </p>
      </div>

      {/* ── Stat cards ── */}
      <div className="relative z-10 w-full max-w-3xl px-3 sm:px-4 pb-6 sm:pb-10 mt-16 sm:mt-25">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
          {stats.map(({ icon, value, label }) => (
            <div key={label}
              className="rounded-xl sm:rounded-2xl bg-[#0d0d14]/80 border border-white/[0.07] backdrop-blur-md p-3 sm:p-5 flex flex-col gap-2">
              <span className="text-gray-400 text-base sm:text-lg">{icon}</span>
              <span className="text-white text-2xl sm:text-3xl font-bold leading-none">{value}</span>
              <span className="text-gray-500 text-[10px] sm:text-xs">{label}</span>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}

function SearchIcon({ white }) {
  return (
    <svg className={`w-4 h-4 shrink-0 ${white ? "text-white" : "text-gray-500"}`}
      fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg className="w-4 h-4 text-gray-500 shrink-0"
      fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}