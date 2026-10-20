import API_BASE from "./api";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  History,
  RefreshCw,
  AlertCircle,
  CalendarDays,
  GraduationCap,
  GitBranch,
  Users,
  Hash,
  Sparkles,
} from "lucide-react";

function formatRank(value) {
  const rank = Number(value);
  return Number.isFinite(rank) ? rank.toLocaleString("en-IN") : "—";
}

function formatDate(value) {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStateLabel(state) {
  return state === "TG" ? "Telangana EAPCET" : "AP EAPCET";
}

export default function PredictionHistory({ onBack }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchHistory = async () => {
    setRefreshing(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE}/prediction-history`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to load prediction history."
        );
      }

      setHistory(data.history || []);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#08070D] px-4 py-8 text-[#F5F3FF] sm:px-8 sm:py-10">
      {/* Background glow */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -left-32 top-12 h-80 w-80 rounded-full bg-violet-700/10 blur-[120px]" />
        <div className="absolute -right-28 top-72 h-96 w-96 rounded-full bg-purple-500/10 blur-[140px]" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-indigo-600/[0.07] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-5xl">
        {/* Back button */}
        <motion.button
          type="button"
          onClick={onBack}
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.97 }}
          className="mb-8 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-sm text-white/75 backdrop-blur-xl transition-colors hover:border-violet-400/30 hover:bg-violet-500/10 hover:text-white"
        >
          <ArrowLeft size={16} />
          Back
        </motion.button>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"
        >
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/[0.08] px-3 py-1.5 text-violet-200">
              <History size={15} />
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em]">
                Your activity
              </span>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Prediction{" "}
              <span className="bg-gradient-to-r from-violet-300 via-purple-200 to-fuchsia-300 bg-clip-text text-transparent">
                History
              </span>
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/50 sm:text-base">
              Revisit the rank, category, and branch details from
              your previous college prediction searches.
            </p>
          </div>

          <motion.button
            type="button"
            onClick={fetchHistory}
            disabled={refreshing}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-violet-300/20 bg-violet-500/[0.09] px-4 py-3 text-sm font-medium text-violet-100 transition-colors hover:border-violet-300/40 hover:bg-violet-500/[0.16] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={15}
              className={refreshing ? "animate-spin" : ""}
            />
            {refreshing ? "Refreshing..." : "Refresh history"}
          </motion.button>
        </motion.header>

        <div className="mb-6 h-px bg-gradient-to-r from-violet-400/30 via-white/[0.08] to-transparent" />

        {/* Loading, error, empty state and history */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl border border-white/[0.09] bg-[#121019]/80 p-8 backdrop-blur-xl"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10">
                  <RefreshCw
                    size={19}
                    className="animate-spin text-violet-300"
                  />
                </div>

                <div>
                  <p className="font-medium text-white/90">
                    Loading your history
                  </p>
                  <p className="mt-1 text-sm text-white/45">
                    Fetching your saved prediction searches...
                  </p>
                </div>
              </div>

              <div className="mt-7 space-y-3">
                <div className="h-3 w-2/5 animate-pulse rounded-full bg-white/[0.06]" />
                <div className="h-24 animate-pulse rounded-xl bg-white/[0.035]" />
                <div className="h-24 animate-pulse rounded-xl bg-white/[0.035]" />
              </div>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl border border-rose-400/20 bg-rose-500/[0.06] p-6 sm:p-8"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-400/10 text-rose-300">
                  <AlertCircle size={20} />
                </div>

                <div>
                  <p className="font-semibold text-rose-100">
                    Could not load history
                  </p>

                  <p className="mt-1 text-sm leading-6 text-rose-100/65">
                    {error}
                  </p>

                  <button
                    type="button"
                    onClick={fetchHistory}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg border border-rose-300/20 px-3 py-2 text-sm text-rose-100 transition-colors hover:bg-rose-400/10"
                  >
                    <RefreshCw size={14} />
                    Try again
                  </button>
                </div>
              </div>
            </motion.div>
          ) : history.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="relative overflow-hidden rounded-3xl border border-dashed border-violet-300/20 bg-[#121019]/65 px-6 py-16 text-center backdrop-blur-xl sm:py-20"
            >
              <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-64 -translate-x-1/2 rounded-full bg-violet-500/[0.09] blur-3xl" />

              <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/[0.09] text-violet-200 shadow-[0_0_40px_rgba(139,92,246,0.12)]">
                <History size={28} />
              </div>

              <div className="relative mx-auto mb-3 flex w-fit items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-violet-300">
                <Sparkles size={13} />
                Your journey starts here
              </div>

              <h2 className="relative text-xl font-semibold">
                No predictions yet
              </h2>

              <p className="relative mx-auto mt-3 max-w-md text-sm leading-6 text-white/50">
                Your saved prediction searches will appear here
                after you make a prediction while logged in.
              </p>
            </motion.div>
          ) : (
            <motion.section
              key="history"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-white/50">
                  <span className="font-semibold text-white/90">
                    {history.length}
                  </span>{" "}
                  saved prediction
                  {history.length === 1 ? "" : "s"}
                </p>

                <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-xs text-white/45">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-300 shadow-[0_0_8px_rgba(196,181,253,0.8)]" />
                  Saved searches
                </span>
              </div>

              {history.map((item, index) => (
                <motion.article
                  key={item.history_id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: Math.min(index * 0.06, 0.3),
                  }}
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.09] bg-[#121019]/75 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.12)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-300/25 hover:bg-[#171321]/90 sm:p-6"
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/35 to-transparent opacity-60 transition-opacity group-hover:opacity-100" />

                  <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-violet-300/15 bg-violet-500/[0.09] text-violet-200 transition-colors group-hover:bg-violet-500/[0.15]">
                        <GraduationCap size={23} />
                      </div>

                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-300">
                          {getStateLabel(item.state)}
                        </p>

                        <h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                          <span className="text-sm font-medium text-white/45">
                            Rank
                          </span>{" "}
                          {formatRank(item.exam_rank)}
                        </h2>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.09] bg-white/[0.035] px-3 py-1.5 text-xs text-white/65">
                      <Users size={13} className="text-violet-300" />
                      {item.gender || "Not specified"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-white/[0.055] bg-black/20 p-4 transition-colors group-hover:border-violet-300/10">
                      <div className="mb-2 flex items-center gap-2 text-white/40">
                        <Users size={14} />
                        <p className="text-xs">Category</p>
                      </div>

                      <p className="font-medium text-white/90">
                        {item.category || "—"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/[0.055] bg-black/20 p-4 transition-colors group-hover:border-violet-300/10">
                      <div className="mb-2 flex items-center gap-2 text-white/40">
                        <GitBranch size={14} />
                        <p className="text-xs">Preferred branch</p>
                      </div>

                      <p className="font-medium text-white/90">
                        {item.preferred_branch || "—"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/[0.055] bg-black/20 p-4 transition-colors group-hover:border-violet-300/10">
                      <div className="mb-2 flex items-center gap-2 text-white/40">
                        <CalendarDays size={14} />
                        <p className="text-xs">Date</p>
                      </div>

                      <p className="text-sm font-medium leading-5 text-white/85">
                        {formatDate(item.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 border-t border-white/[0.06] pt-4 text-xs text-white/35">
                    <Hash size={13} className="text-violet-300/70" />
                    History ID: {item.history_id}
                  </div>
                </motion.article>
              ))}
            </motion.section>
          )}
        </AnimatePresence>

        {/* Disclaimer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="mt-8 flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
        >
          <AlertCircle
            size={16}
            className="mt-0.5 shrink-0 text-violet-300/70"
          />

          <p className="text-xs leading-5 text-white/40">
            This page shows saved search inputs, not the original
            college result list. Predictions are based on historical
            cutoff data and do not guarantee seat allotment.
          </p>
        </motion.footer>
      </div>
    </main>
  );
}
