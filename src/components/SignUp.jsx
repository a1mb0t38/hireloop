"use client";

import Link from "next/link";
import { useState } from "react";
import { Description, Label, Radio, RadioGroup } from "@heroui/react";
import { authClient } from "@/lib/auth-client"; // Adjust path to match your client setup

// ── toast hook ────────────────────────────────────────────────────────────────
function useToast() {
    const [toasts, setToasts] = useState([]);
    const addToast = (message, type = "error") => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
    };
    const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));
    return { toasts, toast: addToast, removeToast };
}

// ── validation ────────────────────────────────────────────────────────────────
function validate(fields) {
    const errors = {};
    if (!fields.name.trim()) errors.name = "Full name is required.";
    else if (fields.name.trim().length < 2) errors.name = "Name must be at least 2 characters.";

    if (!fields.email.trim()) errors.email = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
        errors.email = "Please enter a valid email address.";

    if (!fields.password) errors.password = "Password is required.";
    else if (fields.password.length < 8) errors.password = "Password must be at least 8 characters.";
    else if (!/[A-Z]/.test(fields.password)) errors.password = "Must contain at least one uppercase letter.";
    else if (!/[0-9]/.test(fields.password)) errors.password = "Must contain at least one number.";

    if (!fields.confirm) errors.confirm = "Please confirm your password.";
    else if (fields.confirm !== fields.password) errors.confirm = "Passwords do not match.";

    return errors;
}

// ── password strength ─────────────────────────────────────────────────────────
function getStrength(password) {
    if (!password) return { level: 0, label: "", color: "text-transparent" };
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (score <= 1) return { level: 1, label: "Weak", color: "bg-red-500", textColor: "text-red-500" };
    if (score <= 3) return { level: 2, label: "Fair", color: "bg-amber-500", textColor: "text-amber-500" };
    if (score === 4) return { level: 3, label: "Good", color: "bg-indigo-500", textColor: "text-indigo-500" };
    return { level: 4, label: "Strong", color: "bg-green-500", textColor: "text-green-500" };
}

// ── deterministic stars ───────────────────────────────────────────────────────
const STARS = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    w: ((i * 37 + 13) % 20) / 10 + 1,
    top: ((i * 71 + 19) % 1000) / 10,
    left: ((i * 97 + 3) % 1000) / 10,
    op: ((i * 41 + 11) % 60) / 100 + 0.05,
}));

// ── icons ─────────────────────────────────────────────────────────────────────
const EyeIcon = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);
const EyeOffIcon = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
);
const CheckCircleIcon = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);
const XCircleIcon = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
);
const XIcon = () => (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

// ── reusable field ────────────────────────────────────────────────────────────
function Field({ label, name, type, placeholder, value, onChange, onBlur, error }) {
    const getBorderColor = () => {
        if (error) return "border-red-500";
        if (value && !error) return "border-green-500";
        return "border-white/10";
    };

    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-white/55 tracking-wide">{label}</label>
            <input
                name={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                autoComplete={name}
                className={`w-full bg-white/5 border ${getBorderColor()} rounded-xl px-3.5 py-2.5 text-sm font-sans text-white placeholder-white/20 transition-all duration-200 focus:outline-none focus:border-indigo-500! focus:ring-3 focus:ring-indigo-500/18`}
            />
            {error && <p className="text-[11.5px] text-red-500 mt-0.5 leading-relaxed">{error}</p>}
        </div>
    );
}

// ── toast list ────────────────────────────────────────────────────────────────
function ToastList({ toasts, removeToast }) {
    return (
        <div className="fixed top-20 right-4 md:right-3 flex flex-col gap-2 z-[99999] w-[min(340px,calc(100vw-32px))]">
            {toasts.map((t) => (
                <div
                    key={t.id}
                    className={`flex items-start gap-2.5 p-3.5 rounded-xl border backdrop-blur-xl shadow-2xl animate-[slideIn_0.3s_ease] ${t.type === "success"
                        ? "bg-green-950/80 border-green-500"
                        : "bg-[#1c0a0a]/80 border-red-500"
                        }`}
                >
                    <span className={`flex-shrink-0 flex ${t.type === "success" ? "text-green-500" : "text-red-500"}`}>
                        {t.type === "success" ? <CheckCircleIcon /> : <XCircleIcon />}
                    </span>
                    <p className="text-xs text-white flex-1 leading-relaxed pt-0.5">{t.message}</p>
                    <button onClick={() => removeToast(t.id)} className="bg-none border-none text-white/38 cursor-pointer p-0.5 flex items-center shrink-0 transition-colors duration-150 hover:text-white/80">
                        <XIcon />
                    </button>
                </div>
            ))}
        </div>
    );
}

// ── main component ────────────────────────────────────────────────────────────
export default function SignUp() {
    const { toasts, toast, removeToast } = useToast();
    const [fields, setFields] = useState({ name: "", email: "", password: "", confirm: "", role: "seeker" });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [showPw, setShowPw] = useState(false);
    const [showCf, setShowCf] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const strength = getStrength(fields.password);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updated = { ...fields, [name]: value };
        setFields(updated);
        if (touched[name]) {
            const errs = validate(updated);
            setErrors((prev) => ({ ...prev, [name]: errs[name] }));
        }
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
        const errs = validate(fields);
        setErrors((prev) => ({ ...prev, [name]: errs[name] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setTouched({ name: true, email: true, password: true, confirm: true });

        const errs = validate(fields);
        setErrors(errs);

        if (Object.keys(errs).length > 0) {
            toast("Please fix the errors before submitting.", "error");
            return;
        }

        setLoading(true);
        // console.log("Submitting:", fields.role);

        // ── better auth sign up execution ─────────────────────────────────────────
        authClient.signUp.email({
            email: fields.email.trim(),
            password: fields.password,
            name: fields.name.trim(),
            role: fields.role,
            callbackURL: "/",
        })
            .then((res) => {
                // console.log("Signup successful:", res);
                setLoading(false);
                setSuccess(true);
                toast("Account created successfully! 🎉", "success");
            })
            .catch((err) => {
                setLoading(false);
                toast(err?.message || "Signup failed", "error");
            });
    };

    const reset = () => {
        setSuccess(false);
        setFields({ name: "", email: "", password: "", confirm: "" });
        setTouched({});
        setErrors({});
    };

    const getPasswordBorderColor = () => {
        if (touched.password && errors.password) return "border-red-500";
        if (touched.password && !errors.password) return "border-green-500";
        return "border-white/10";
    };

    const getConfirmBorderColor = () => {
        if (touched.confirm && errors.confirm) return "border-red-500";
        if (touched.confirm && fields.confirm && !errors.confirm) return "border-green-500";
        return "border-white/10";
    };

    return (
        <>
            <ToastList toasts={toasts} removeToast={removeToast} />

            <section className="relative w-full px-3 py-12 md:px-4 flex justify-center items-start overflow-hidden font-sans bg-[#08080f]">

                <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
                    <div className="absolute top-[-60px] left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-[radial-gradient(ellipse,rgba(99,102,241,0.13)_0%,transparent_70%)] blur-[40px]" />
                    {STARS.map((s) => (
                        <div
                            key={s.id}
                            className="absolute rounded-full bg-white"
                            style={{ width: s.w + "px", height: s.w + "px", top: s.top + "%", left: s.left + "%", opacity: s.op }}
                        />
                    ))}
                </div>

                {success ? (
                    <div className="relative z-10 w-full max-w-[400px] bg-[#0f0f1a] border border-white/10 rounded-2xl p-8 md:p-12 text-center shadow-[0_24px_64px_rgba(0,0,0,0.6)] animate-[fadeUp_0.45s_ease_both]">
                        <div className="w-15 h-15 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-2xl text-white mx-auto mb-4.5 shadow-[0_0_28px_rgba(34,197,94,0.25)]">✓</div>
                        <h2 className="font-bold text-xl text-white mb-1.5 font-sans">You are all set!</h2>
                        <p className="text-xs text-white/38 mb-6">Your account has been created successfully.</p>
                        <button className="bg-gradient-to-br from-indigo-500 to-violet-500 border-none rounded-xl px-6 py-2.5 text-xs font-semibold text-white cursor-pointer font-sans" onClick={reset}>Back to Sign Up</button>
                    </div>
                ) : (
                    <div className="relative z-10 w-full max-w-[460px] bg-[#0f0f1a] border border-white/10 rounded-2xl p-5 sm:p-8 md:p-9 shadow-[0_24px_64px_rgba(0,0,0,0.6)] animate-[fadeUp_0.45s_ease_both]">


                        <h1 className="font-bold text-xl sm:text-2xl text-white tracking-tight m-0 mb-1 font-sans">Create your account</h1>
                        <p className="text-xs sm:text-sm text-white/38 m-0 mb-6 leading-normal">Join thousands of professionals finding their dream roles.</p>

                        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

                            {/* Name */}
                            <Field
                                label="Full Name" name="name" type="text" placeholder="Jane Doe"
                                value={fields.name} onChange={handleChange} onBlur={handleBlur}
                                error={touched.name && errors.name}
                            />

                            {/* Email */}
                            <Field
                                label="Email Address" name="email" type="email" placeholder="jane@example.com"
                                value={fields.email} onChange={handleChange} onBlur={handleBlur}
                                error={touched.email && errors.email}
                            />

                            {/* Password */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-white/55 tracking-wide">Password</label>
                                <div className="relative">
                                    <input
                                        name="password"
                                        type={showPw ? "text" : "password"}
                                        placeholder="Min. 8 characters"
                                        value={fields.password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        autoComplete="new-password"
                                        className={`w-full bg-white/5 border ${getPasswordBorderColor()} rounded-xl pl-3.5 pr-10 py-2.5 text-sm font-sans text-white placeholder-white/20 transition-all duration-200 focus:outline-none focus:border-indigo-500! focus:ring-3 focus:ring-indigo-500/18`}
                                    />
                                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 bg-none border-none text-white/30 cursor-pointer flex items-center p-1 transition-colors duration-200 hover:text-white/70" onClick={() => setShowPw((v) => !v)} aria-label="Toggle password">
                                        {showPw ? <EyeOffIcon /> : <EyeIcon />}
                                    </button>
                                </div>

                                {/* strength bar */}
                                {fields.password && (
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <div className="flex gap-1 flex-1">
                                            {[1, 2, 3, 4].map((n) => (
                                                <div
                                                    key={n}
                                                    className={`h-[3px] flex-1 rounded-full transition-colors duration-300 ${strength.level >= n ? strength.color : "bg-white/10"}`}
                                                />
                                            ))}
                                        </div>
                                        <span className={`text-[11px] font-semibold tracking-wider min-w-[38px] text-right ${strength.textColor}`}>{strength.label}</span>
                                    </div>
                                )}
                                {touched.password && errors.password && <p className="text-[11.5px] text-red-500 mt-0.5 leading-relaxed">{errors.password}</p>}
                            </div>

                            {/* Confirm password */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-white/55 tracking-wide">Confirm Password</label>
                                <div className="relative">
                                    <input
                                        name="confirm"
                                        type={showCf ? "text" : "password"}
                                        placeholder="Re-enter password"
                                        value={fields.confirm}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        autoComplete="new-password"
                                        className={`w-full bg-white/5 border ${getConfirmBorderColor()} rounded-xl pl-3.5 pr-10 py-2.5 text-sm font-sans text-white placeholder-white/20 transition-all duration-200 focus:outline-none focus:border-indigo-500! focus:ring-3 focus:ring-indigo-500/18`}
                                    />
                                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 bg-none border-none text-white/30 cursor-pointer flex items-center p-1 transition-colors duration-200 hover:text-white/70" onClick={() => setShowCf((v) => !v)} aria-label="Toggle confirm password">
                                        {showCf ? <EyeOffIcon /> : <EyeIcon />}
                                    </button>
                                </div>
                                {touched.confirm && errors.confirm && <p className="text-[11.5px] text-red-500 mt-0.5 leading-relaxed">{errors.confirm}</p>}
                            </div>
                            {/* role selection */}
                            {/* <div className="flex flex-col gap-4">
                                <Label className="text-white/55">Role</Label>
                                <RadioGroup defaultValue={fields.role} onValueChange={(value) => {
                                    console.log("Selected:", value);
                                    setFields((prev) => ({
                                        ...prev,
                                        role: value,
                                    }));
                                }} name="role" orientation="horizontal">
                                    <Radio value="seeker">
                                        <Radio.Control>
                                            <Radio.Indicator />
                                        </Radio.Control>
                                        <Radio.Content>
                                            <Label className="text-white/55">Seeker</Label>
                                            <Description>For job seekers</Description>
                                        </Radio.Content>
                                    </Radio>
                                    <Radio value="recruiter">
                                        <Radio.Control>
                                            <Radio.Indicator />
                                        </Radio.Control>
                                        <Radio.Content>
                                            <Label className="text-white/55">Recruiter</Label>
                                            <Description>For recruiters and hiring managers</Description>
                                        </Radio.Content>
                                    </Radio>

                                </RadioGroup>
                            </div> */}



                            <div className="flex flex-col gap-4">
                                <Label className="text-white/55">Role</Label>

                                <div className="flex gap-6">
                                    <label className="flex items-center gap-2 text-white">
                                        <input
                                            type="radio"
                                            name="role"
                                            value="seeker"
                                            checked={fields.role === "seeker"}
                                            onChange={(e) =>
                                                setFields((prev) => ({ ...prev, role: e.target.value }))
                                            }
                                        />
                                        Seeker
                                    </label>

                                    <label className="flex items-center gap-2 text-white">
                                        <input
                                            type="radio"
                                            name="role"
                                            value="recruiter"
                                            checked={fields.role === "recruiter"}
                                            onChange={(e) =>
                                                setFields((prev) => ({ ...prev, role: e.target.value }))
                                            }
                                        />
                                        Recruiter
                                    </label>
                                </div>
                            </div>

                            {/* Submit */}
                            <button type="submit" className="mt-1.5 w-full bg-gradient-to-br from-indigo-500 to-violet-500 border-none rounded-xl p-3.5 text-sm font-semibold text-white cursor-pointer tracking-wide transition-all duration-200 shadow-[0_4px_18px_rgba(99,102,241,0.3)] hover:not-disabled:opacity-90 hover:not-disabled:-translate-y-px active:not-disabled:translate-y-0 disabled:cursor-not-allowed" disabled={loading} style={{ opacity: loading ? 0.72 : 1 }}>
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block shrink-0" />
                                        Creating account…
                                    </span>
                                ) : "Create Account"}
                            </button>
                        </form>

                        <p className="mt-4.5 text-center text-xs sm:text-sm text-white/32">
                            Already have an account?{" "}
                            <Link href="/signin" className="text-indigo-400 no-underline font-medium hover:underline">Sign in</Link>
                        </p>
                    </div>
                )}
            </section>
        </>
    );
}