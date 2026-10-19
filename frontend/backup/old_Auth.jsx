
import { useState } from "react";
import { ArrowLeft, GraduationCap, Eye, EyeOff } from "lucide-react";

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
      const endpoint =
        mode === "login" ? "/login" : "/register";

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
        setForm((previous) => ({
          ...previous,
          password: "",
        }));
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
    "w-full rounded-xl border border-white/15 bg-[#0b0c11] px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-violet-400";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#08090d] px-4 py-10 text-white">
      <section className="w-full max-w-md rounded-2xl border border-white/10 bg-[#101116] p-6 shadow-2xl sm:p-8">
        <button
          type="button"
          onClick={onBack}
          className="mb-7 inline-flex items-center gap-2 text-sm text-white/65 hover:text-white"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-400/15 text-violet-300">
          <GraduationCap size={25} />
        </div>

        <h1 className="text-3xl font-semibold">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-2 text-sm leading-6 text-white/55">
          {mode === "login"
            ? "Log in to access your saved EAPCET predictions."
            : "Register to save and review your college predictions."}
        </p>

        {error && (
          <p role="alert" className="mt-5 rounded-lg border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">
            {error}
          </p>
        )}

        {message && (
          <p role="status" className="mt-5 rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm text-emerald-200">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === "register" && (
            <>
              <input
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                placeholder="Full name"
                autoComplete="name"
                className={inputClass}
                required
              />

              <input
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                placeholder="Mobile number (optional)"
                autoComplete="tel"
                inputMode="tel"
                className={inputClass}
              />

              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="City / State (optional)"
                autoComplete="address-level2"
                className={inputClass}
              />
            </>
          )}

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

          <div className="relative">
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/55 hover:text-white"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#b7a5ff] px-4 py-3 font-semibold text-[#111019] transition hover:bg-[#c9bcff] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Please wait..."
              : mode === "login"
                ? "Log in"
                : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/60">
          {mode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => {
              setMode((previous) =>
                previous === "login" ? "register" : "login"
              );
              setError("");
              setMessage("");
            }}
            className="font-semibold text-violet-300 hover:text-violet-200"
          >
            {mode === "login" ? "Register" : "Log in"}
          </button>
        </p>
      </section>
    </main>
  );
}
