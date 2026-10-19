
import { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Atom,
  Eye,
  EyeOff,
  GraduationCap,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  UserRound,
} from "lucide-react";

const API_BASE = "/api";

export default function Auth({ onBack, onLoginSuccess }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    mobile: "",
    location: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const endpoint = mode === "login" ? "/login" : "/register";

      const payload =
        mode === "login"
          ? {
              email: form.email.trim(),
              password: form.password,
            }
          : {
              full_name: form.full_name.trim(),
              email: form.email.trim(),
              mobile: form.mobile.trim(),
              location: form.location.trim(),
              password: form.password,
            };

      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.error || data.message || "Request failed. Please try again."
        );
      }

      if (mode === "register") {
        setMessage("Registration successful! Please log in.");
        setMode("login");
        setForm((previous) => ({ ...previous, password: "" }));
        return;
      }

      setMessage("Login successful!");
      onLoginSuccess(data.student);
    } catch (err) {
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-[#0b0912]/80 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-violet-400/70 focus:bg-[#100c19] focus:ring-4 focus:ring-violet-500/10";

  const toggleMode = () => {
    setMode((previous) =>
      previous === "login" ? "register" : "login"
    );
    setError("");
    setMessage("");
    setShowPassword(false);
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-x-hidden bg-[#08070D] px-4 py-5 text-[#F5F3FF] sm:px-6 sm:py-7">
      <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-violet-600/15 blur-[130px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[30rem] w-[30rem] rounded-full bg-fuchsia-600/10 blur-[140px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.08),transparent_48%)]" />

      <button
        type="button"
        onClick={onBack}
        className="absolute left-5 top-5 z-10 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-sm text-white/65 backdrop-blur-xl transition hover:border-violet-300/30 hover:bg-white/[0.07] hover:text-white sm:left-8 sm:top-8"
      >
        <ArrowLeft size={16} />
        Back to home
      </button>

      <motion.section
        initial={{ opacity: 0, y: 22, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative z-[1] my-5 grid w-full max-w-5xl overflow-hidden rounded-3xl border border-violet-200/15 bg-[#121019]/85 shadow-[0_30px_100px_rgba(0,0,0,0.48),0_0_60px_rgba(139,92,246,0.08)] backdrop-blur-2xl lg:grid-cols-[0.9fr_1.1fr]"
      >
        <aside className="relative hidden flex-col justify-between overflow-hidden border-r border-white/[0.08] bg-gradient-to-br from-violet-500/[0.12] via-[#15101f] to-[#0c0a12] p-10 lg:flex xl:p-12">
          <div className="pointer-events-none absolute -right-20 top-24 h-64 w-64 rounded-full bg-violet-500/15 blur-[90px]" />

          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#A78BFA] text-[#111019] shadow-[0_0_30px_rgba(167,139,250,0.2)]">
                <Atom size={24} />
              </div>
              <div>
                <p className="text-lg font-bold tracking-[-0.06em]">
                  EAPCET<span className="text-[#A78BFA]">.AI</span>
                </p>
                <p className="mt-0.5 text-[9px] tracking-[0.2em] text-white/40">
                  ADMISSION INTELLIGENCE
                </p>
              </div>
            </div>

            <div className="mt-12 xl:mt-16">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-300/15 bg-violet-300/[0.06] px-3 py-2 text-[10px] font-medium tracking-[0.14em] text-violet-200">
                <Sparkles size={13} />
                YOUR NEXT CHAPTER STARTS HERE
              </div>

              <h2 className="max-w-sm text-4xl font-medium leading-[1.08] tracking-[-0.06em] xl:text-5xl">
                Your future,
                <br />
                <span className="font-serif italic text-violet-200/75">
                  with more clarity.
                </span>
              </h2>

              <p className="mt-5 max-w-sm text-sm leading-7 text-white/50">
                Keep your college predictions in one place and explore
                engineering options using historical EAPCET cutoff data.
              </p>
            </div>
          </div>

          <div className="relative mt-8 rounded-2xl border border-white/[0.09] bg-white/[0.035] p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-400/10 text-violet-200">
                <GraduationCap size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-white/85">
                  A more informed college search
                </p>
                <p className="mt-1.5 text-xs leading-5 text-white/45">
                  AP and Telangana engineering admission insights, guided by
                  your rank and preferences.
                </p>
              </div>
            </div>
          </div>
        </aside>

        <div className="p-5 sm:p-8 lg:p-9 xl:p-10">
          <div className="mb-6 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#A78BFA] text-[#111019]">
              <Atom size={22} />
            </div>
            <div>
              <p className="font-bold tracking-[-0.05em]">
                EAPCET<span className="text-[#A78BFA]">.AI</span>
              </p>
              <p className="text-[9px] tracking-[0.18em] text-white/40">
                ADMISSION INTELLIGENCE
              </p>
            </div>
          </div>

          <div className="mb-6">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-300/15 bg-violet-300/[0.08] text-violet-200">
              {mode === "login" ? (
                <LockKeyhole size={23} />
              ) : (
                <GraduationCap size={24} />
              )}
            </div>

            <p className="mb-2 text-[10px] font-semibold tracking-[0.2em] text-violet-300">
              {mode === "login" ? "WELCOME BACK" : "JOIN EAPCET"}
            </p>

            <h1 className="text-3xl font-medium tracking-[-0.055em] sm:text-4xl">
              {mode === "login" ? (
                <>
                  Sign in to your
                  <br />
                  <span className="font-serif italic text-white/50">
                    workspace.
                  </span>
                </>
              ) : (
                <>
                  Create your
                  <br />
                  <span className="font-serif italic text-white/50">
                    account.
                  </span>
                </>
              )}
            </h1>

            <p className="mt-3 max-w-md text-sm leading-6 text-white/50">
              {mode === "login"
                ? "Access your saved EAPCET predictions and continue exploring your options."
                : "Create an account to save and revisit your college predictions."}
            </p>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              role="alert"
              className="mb-4 rounded-xl border border-red-400/20 bg-red-400/[0.08] p-3.5 text-sm leading-5 text-red-200"
            >
              {error}
            </motion.p>
          )}

          {message && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              role="status"
              className="mb-4 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.07] p-3.5 text-sm leading-5 text-emerald-200"
            >
              {message}
            </motion.p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <>
                <div className="relative">
                  <UserRound
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35"
                  />
                  <input
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                    placeholder="Full name"
                    autoComplete="name"
                    className={inputClass}
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="relative">
                    <Phone
                      size={16}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35"
                    />
                    <input
                      name="mobile"
                      value={form.mobile}
                      onChange={handleChange}
                      placeholder="Mobile (optional)"
                      autoComplete="tel"
                      inputMode="tel"
                      className={inputClass}
                    />
                  </div>

                  <div className="relative">
                    <MapPin
                      size={16}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35"
                    />
                    <input
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      placeholder="City / State"
                      autoComplete="address-level2"
                      className={inputClass}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="relative">
              <Mail
                size={17}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35"
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email address"
                autoComplete="email"
                className={inputClass}
                required
              />
            </div>

            <div className="relative">
              <LockKeyhole
                size={17}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35"
              />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password (minimum 8 characters)"
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
                minLength={8}
                className={`${inputClass} pr-12`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((previous) => !previous)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-white/45 transition hover:text-violet-200"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group mt-2 flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#A78BFA] px-5 py-3.5 text-sm font-semibold text-[#111019] shadow-[0_8px_28px_rgba(139,92,246,0.15)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#C4B5FD] hover:shadow-[0_12px_35px_rgba(139,92,246,0.23)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                  ? "Log in to your account"
                  : "Create your account"}
              {!loading && (
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              )}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/[0.08]" />
            <span className="text-[10px] tracking-[0.08em] text-white/30">
              {mode === "login" ? "NEW TO EAPCET?" : "ALREADY A MEMBER?"}
            </span>
            <div className="h-px flex-1 bg-white/[0.08]" />
          </div>

          <p className="text-center text-sm text-white/55">
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={toggleMode}
              className="font-semibold text-violet-300 transition hover:text-violet-200"
            >
              {mode === "login" ? "Register" : "Log in"}
            </button>
          </p>

          <p className="mt-5 text-center text-[10px] leading-5 text-white/30">
            Historical cutoff insights only. Actual seat allotment follows
            official counselling rules.
          </p>
        </div>
      </motion.section>
    </main>
  );
}
