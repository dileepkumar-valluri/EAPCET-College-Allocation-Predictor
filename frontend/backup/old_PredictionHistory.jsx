
import { useEffect, useState } from "react";
import { ArrowLeft, History, RefreshCw, AlertCircle } from "lucide-react";

const API_BASE = "/api";

function formatRank(value) {
  return Number(value).toLocaleString("en-IN");
}

export default function PredictionHistory({ onBack }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHistory = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/prediction-history`, {
        method: "GET",
        credentials: "include",
      });

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
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <main className="min-h-screen bg-[#08090d] px-4 py-8 text-[#f4f3ef] sm:px-8">
      <div className="mx-auto max-w-5xl">
        <button
          type="button"
          onClick={onBack}
          className="mb-8 inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-violet-300">
              <History size={18} />
              <span className="text-xs font-semibold uppercase tracking-widest">
                Student Dashboard
              </span>
            </div>

            <h1 className="text-3xl font-semibold sm:text-4xl">
              Prediction History
            </h1>

            <p className="mt-2 text-sm text-white/55">
              Review your previously submitted college prediction searches.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchHistory}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-3 text-sm hover:bg-white/5 disabled:opacity-50"
          >
            <RefreshCw size={15} />
            Refresh
          </button>
        </div>

        {loading && (
          <p className="rounded-xl border border-white/10 p-6 text-white/65">
            Loading prediction history...
          </p>
        )}

        {!loading && error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-400/5 p-5 text-red-200">
            <AlertCircle size={20} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">Could not load history</p>
              <p className="mt-1 text-sm">{error}</p>

              <button
                type="button"
                onClick={fetchHistory}
                className="mt-3 text-sm underline"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {!loading && !error && history.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/15 px-6 py-16 text-center">
            <History size={32} className="mx-auto mb-4 text-violet-300" />
            <h2 className="text-lg font-semibold">No predictions yet</h2>
            <p className="mt-2 text-sm text-white/55">
              Your saved prediction searches will appear here after you make a prediction while logged in.
            </p>
          </div>
        )}

        {!loading && !error && history.length > 0 && (
          <div className="space-y-4">
            <p className="text-sm text-white/55">
              {history.length} saved prediction
              {history.length === 1 ? "" : "s"}
            </p>

            {history.map((item) => (
              <article
                key={item.history_id}
                className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-6"
              >
                <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-violet-300">
                      {item.state === "TG" ? "Telangana EAPCET" : "AP EAPCET"}
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold">
                      Rank {formatRank(item.exam_rank)}
                    </h2>
                  </div>

                  <span className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/65">
                    {item.gender}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-xl bg-white/[0.035] p-4">
                    <p className="text-xs text-white/45">Category</p>
                    <p className="mt-2 font-medium">{item.category}</p>
                  </div>

                  <div className="rounded-xl bg-white/[0.035] p-4">
                    <p className="text-xs text-white/45">Preferred Branch</p>
                    <p className="mt-2 font-medium">{item.preferred_branch}</p>
                  </div>

                  <div className="rounded-xl bg-white/[0.035] p-4">
                    <p className="text-xs text-white/45">Date</p>
                    <p className="mt-2 font-medium">
                      {new Date(item.created_at).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-xs text-white/35">
                  History ID: {item.history_id}
                </p>
              </article>
            ))}
          </div>
        )}

        <p className="mt-8 text-xs leading-5 text-white/40">
          This page shows saved search inputs, not the original college result
          list. Predictions are based on historical cutoff data and do not
          guarantee seat allotment.
        </p>
      </div>
    </main>
  );
}
