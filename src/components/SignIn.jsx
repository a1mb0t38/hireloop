"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

// ── toast hook ────────────────────────────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = (message, type = "error") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4000);
  };
  const remove = (id) => setToasts((p) => p.filter((t) => t.id !== id));
  return { toasts, toast: add, removeToast: remove };
}

// ── validation ────────────────────────────────────────────────────────────────
function validate(f) {
  const e = {};
  if (!f.email.trim()) e.email = "Email address is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))
    e.email = "Please enter a valid email address.";
  if (!f.password) e.password = "Password is required.";
  return e;
}

// ── deterministic stars ───────────────────────────────────────────────────────
const STARS = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  size: ((i * 37 + 13) % 20) / 10 + 1,
  top:  ((i * 71 + 19) % 1000) / 10,
  left: ((i * 97 + 3)  % 1000) / 10,
  op:   ((i * 41 + 11) % 60)  / 100 + 0.05,
}));

// ── border helper ─────────────────────────────────────────────────────────────
function borderColor(hasError, hasValue) {
  if (hasError) return "border-red-500 focus:border-red-500 focus:ring-red-500/20";
  if (hasValue) return "border-green-500 focus:border-green-500 focus:ring-green-500/20";
  return "border-white/10 focus:border-indigo-500 focus:ring-indigo-500/20";
}

// ── icons ─────────────────────────────────────────────────────────────────────
const EyeIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOffIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const XCircleIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
// ── toast list ────────────────────────────────────────────────────────────────
function ToastList({ toasts, removeToast }) {
  return (
    <div className="fixed top-20 right-4 z-[99999] flex flex-col gap-2 w-[min(340px,calc(100vw-2rem))]">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-start gap-2.5 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-sm
            ${t.type === "success" ? "bg-green-950/90 border-green-500/60" : "bg-red-950/90 border-red-500/60"}`}
          style={{ animation: "slideIn 0.3s ease" }}
        >
          <span className={`flex-shrink-0 mt-0.5 ${t.type === "success" ? "text-green-400" : "text-red-400"}`}>
            {t.type === "success" ? <CheckIcon /> : <XCircleIcon />}
          </span>
          <p className="text-sm text-white flex-1 leading-snug">{t.message}</p>
          <button onClick={() => removeToast(t.id)} className="text-white/30 hover:text-white/70 flex-shrink-0 transition-colors mt-0.5">
            <CloseIcon />
          </button>
        </div>
      ))}

      <style>{`
        @keyframes slideIn  { from { opacity:0; transform:translateX(110%); } to { opacity:1; transform:translateX(0); } }
        @keyframes fadeUp   { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin     { to   { transform: rotate(360deg); } }
        .si-card  { animation: fadeUp 0.4s ease both; }
        .si-spin  {
          width:15px; height:15px; border-radius:50%; display:inline-block; flex-shrink:0;
          border:2px solid rgba(255,255,255,0.25); border-top-color:#fff;
          animation: spin 0.7s linear infinite;
        }
      `}</style>
    </div>
  );
}

// ── main ──────────────────────────────────────────────────────────────────────
export default function SigninPage() {
  const { toasts, toast, removeToast } = useToast();
  const router = useRouter();
  const [fields, setFields]   = useState({ email: "", password: "" });
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...fields, [name]: value };
    setFields(updated);
    if (touched[name]) {
      const errs = validate(updated);
      setErrors((p) => ({ ...p, [name]: errs[name] }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((p) => ({ ...p, [name]: true }));
    const errs = validate(fields);
    setErrors((p) => ({ ...p, [name]: errs[name] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    const errs = validate(fields);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      toast("Please fix the errors before signing in.", "error");
      return;
    }

    setLoading(true);

    const { data, error } = await authClient.signIn.email({
      email:    fields.email,
      password: fields.password,
      rememberMe: remember,
      callbackURL: "/",
    });

    setLoading(false);

    if (error) {
      // Map Better Auth error codes to friendly messages
      const msg =
        error.code === "INVALID_EMAIL_OR_PASSWORD"
          ? "Invalid email or password. Please try again."
          : error.code === "EMAIL_NOT_VERIFIED"
          ? "Please verify your email before signing in."
          : error.code === "TOO_MANY_REQUESTS"
          ? "Too many attempts. Please try again later."
          : error.message ?? "Something went wrong. Please try again.";
      toast(msg, "error");
      return;
    }

    toast("Signed in successfully! Redirecting…", "success");
    // Small delay so user sees the success toast before redirect
    setTimeout(() => router.push("/"), 1000);
  };

  const emailBorder = borderColor(!!(touched.email && errors.email), !!(fields.email && !(touched.email && errors.email)));
  const pwBorder    = borderColor(!!(touched.password && errors.password), !!(fields.password && !(touched.password && errors.password)));

  return (
    <>
      <ToastList toasts={toasts} removeToast={removeToast} />

      <section className="relative w-full bg-[#08080f] overflow-hidden py-16 px-4 flex justify-center items-center" style={{ minHeight: "calc(100vh - 80px)" }}>

        {/* Stars */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {STARS.map((s) => (
            <div key={s.id} className="absolute rounded-full bg-white"
              style={{ width: s.size + "px", height: s.size + "px", top: s.top + "%", left: s.left + "%", opacity: s.op }}
            />
          ))}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[260px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.14) 0%, transparent 70%)", filter: "blur(40px)" }}
          />
        </div>

        {/* Card */}
        <div className="si-card relative z-10 w-full max-w-[440px] bg-[#0f0f1a] border border-white/10 rounded-2xl px-8 py-9 shadow-[0_24px_64px_rgba(0,0,0,0.6)] sm:px-10">

          {/* Logo */}
          <div className="flex items-center gap-2 mb-7">
            <span className="text-indigo-400 text-xl">⟳</span>
            <span className="font-extrabold text-white text-lg tracking-tight">HireLoop</span>
          </div>

          <h1 className="text-2xl sm:text-[26px] font-bold text-white tracking-tight mb-1">
            Welcome back
          </h1>
          <p className="text-sm text-white/40 mb-7 leading-relaxed">
            Sign in to continue finding your dream role.
          </p>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-white/55 tracking-wide">Email Address</label>
              <input
                name="email"
                type="email"
                placeholder="jane@example.com"
                value={fields.email}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="email"
                className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all duration-200 focus:ring-2 ${emailBorder}`}
              />
              {touched.email && errors.email && (
                <p className="text-xs text-red-400 leading-snug">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-white/55 tracking-wide">Password</label>
                <a href="#" className="text-xs text-indigo-400 hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <input
                  name="password"
                  type={showPw ? "text" : "password"}
                  placeholder="Enter your password"
                  value={fields.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="current-password"
                  className={`w-full bg-white/5 border rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-white/20 outline-none transition-all duration-200 focus:ring-2 ${pwBorder}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors p-1"
                  aria-label="Toggle password visibility"
                >
                  {showPw ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {touched.password && errors.password && (
                <p className="text-xs text-red-400 leading-snug">{errors.password}</p>
              )}
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none group w-fit">
              <div
                onClick={() => setRemember((v) => !v)}
                className={`w-4 h-4 rounded flex items-center justify-center border transition-colors flex-shrink-0
                  ${remember ? "bg-indigo-500 border-indigo-500" : "bg-white/5 border-white/20 group-hover:border-white/40"}`}
              >
                {remember && (
                  <svg width="10" height="10" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 12 12">
                    <polyline points="2 6 5 9 10 3"/>
                  </svg>
                )}
              </div>
              <span className="text-sm text-white/45">Remember me for 30 days</span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full bg-gradient-to-r from-indigo-500 to-violet-600 hover:opacity-90 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-150 text-white font-semibold text-sm rounded-xl py-3.5 shadow-[0_4px_18px_rgba(99,102,241,0.35)] flex items-center justify-center gap-2.5"
            >
              {loading ? (
                <>
                  <span className="si-spin" />
                  Signing in…
                </>
              ) : "Sign In"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-white/32">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="text-indigo-400 font-medium hover:underline">Create one</a>
          </p>
        </div>
      </section>
    </>
  );
}