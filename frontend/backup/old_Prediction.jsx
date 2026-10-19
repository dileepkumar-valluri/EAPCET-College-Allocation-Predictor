
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Search,
  GraduationCap,
  MapPin,
  AlertCircle,
  LoaderCircle,
  BarChart3,
  X,
  Building2,
  GitCompareArrows,
  Layers3,
  CheckCircle2,
  Info,
  ChevronDown,
  Sparkles,
  RotateCcw,
  TrendingUp,
  BookOpen,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";

const API_BASE = "/api";

const categories = [
  { value: "OC", label: "OC" },
  { value: "BC_A", label: "BC-A" },
  { value: "BC_B", label: "BC-B" },
  { value: "BC_C", label: "BC-C" },
  { value: "BC_D", label: "BC-D" },
  { value: "BC_E", label: "BC-E" },
  { value: "SC_I", label: "SC-I" },
  { value: "SC_II", label: "SC-II" },
  { value: "SC_III", label: "SC-III" },
  { value: "ST", label: "ST" },
  { value: "EWS", label: "EWS" },
];

const branches = [
  { value: "CSE", label: "Computer Science (CSE)" },
  { value: "IT", label: "Information Technology (IT)" },
  { value: "ECE", label: "Electronics & Communication (ECE)" },
  { value: "EEE", label: "Electrical & Electronics (EEE)" },
  { value: "ME", label: "Mechanical Engineering (ME)" },
  { value: "CE", label: "Civil Engineering (CE)" },
  { value: "AI", label: "Artificial Intelligence (AI)" },
  { value: "AIML", label: "AI & Machine Learning (AI & ML)" },
  { value: "DS", label: "Data Science (DS)" },
];

const initialForm = {
  state: "TG",
  rank: "",
  category: "OC",
  gender: "boys",
  preferred_branch: "CSE",
  local_area: "",
};

const phases = ["First", "Second", "Final"];

const styles = {
  page: {
    minHeight: "100vh",
    background: "#08090d",
    color: "#f3f0ff",
    fontFamily: "inherit",
  },
  muted: { color: "#92919f" },
  panel: {
    background: "#101116",
    border: "1px solid #25252e",
    borderRadius: "20px",
  },
  label: {
    display: "block",
    color: "#c6c3d2",
    fontSize: "12px",
    fontWeight: 600,
    marginBottom: "9px",
    letterSpacing: "0.02em",
  },
  input: {
    width: "100%",
    background: "#0b0c11",
    border: "1px solid #30303b",
    borderRadius: "11px",
    color: "#f3f0ff",
    padding: "12px 13px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    minHeight: "46px",
  },
};

function formatRank(value) {
  if (value === null || value === undefined || value === "") return "—";
  const number = Number(value);
  return Number.isFinite(number) ? number.toLocaleString("en-IN") : value;
}

function getErrorMessage(data, fallback) {
  if (typeof data?.error === "string") return data.error;
  if (typeof data?.message === "string") return data.message;
  return fallback;
}

function getResults(data) {
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function Field({ label, hint, children }) {
  return (
    <div className="min-w-0">
      <label className="block mb-2 text-xs font-semibold tracking-wide text-[#c6c3d2]">
        {label}
      </label>
      {children}
      {hint && <p className="mt-2 text-xs text-[#777785]">{hint}</p>}
    </div>
  );
}

function SectionHeading({ eyebrow, title, description, icon: Icon }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3 text-[#b7a5ff]">
        {Icon && <Icon size={15} />}
        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
          {eyebrow}
        </span>
      </div>
      <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#f5f2ff]">
        {title}
      </h2>
      {description && (
        <p className="mt-2 text-sm leading-6 text-[#92919f]">{description}</p>
      )}
    </div>
  );
}

function EmptyState({ title, description, icon: Icon = Search }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#30303b] bg-[#0c0d12] px-5 py-12 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#353047] bg-[#171421] text-[#b7a5ff]">
        <Icon size={21} />
      </div>
      <h3 className="text-base font-semibold text-[#e9e5f5]">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#858491]">
        {description}
      </p>
    </div>
  );
}

function Notice({ children, type = "info" }) {
  const warning = type === "warning";
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border p-4 text-sm leading-6 ${
        warning
          ? "border-amber-900/60 bg-amber-950/20 text-amber-200"
          : "border-[#39314f] bg-[#171421] text-[#c8c0e8]"
      }`}
    >
      <Info size={17} className="mt-0.5 shrink-0" />
      <div>{children}</div>
    </div>
  );
}

function getCollegeKey(college, state = "") {
  return `${state || college.state || ""}-${college.college_code || college.college_name || college.name || "college"}-${college.branch_code || college.branch_name || "branch"}`;
}

function readSavedColleges() {
  try {
    const saved = localStorage.getItem("eapcet_saved_colleges");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function CollegeCard({ college, index, onAnalyze, onToggleSave, isSaved }) {
  const collegeName =
    college.college_name || college.name || "College name unavailable";
  const branchName =
    college.branch_name || college.branch_code || "Branch unavailable";
  const rankDifference =
    college.rank_difference ?? college.difference;
  const cutoff = college.cutoff_rank;
  const collegeCode = college.college_code;

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.055, 0.3) }}
      className="group rounded-2xl border border-[#292832] bg-[#101116] p-5 transition-colors hover:border-[#64558e]"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#38304d] bg-[#191523] text-[#c0b0ff]">
          <Building2 size={19} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-[#38304d] bg-[#191523] px-2 py-1 text-[10px] font-bold tracking-wider text-[#c0b0ff]">
              {college.college_code || "COLLEGE"}
            </span>
            {college.phase && (
              <span className="rounded-md border border-[#30303b] px-2 py-1 text-[10px] text-[#a4a1b1]">
                {college.phase} phase
              </span>
            )}
          </div>
          <h3 className="text-base font-semibold leading-6 text-[#f0edf8]">
            {collegeName}
          </h3>
          <p className="mt-1 text-sm text-[#a09dac]">{branchName}</p>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-[#83818e]">
            <MapPin size={13} />
            <span>
              {[college.district, college.local_area]
                .filter(Boolean)
                .join(" · ") || "Location details unavailable"}
            </span>
          </div>
        </div>
      </div>

      <div className="my-5 h-px bg-[#282832]" />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-[#898796]">Historical cutoff</p>
          <p className="mt-1 text-xl font-semibold tracking-tight text-[#f0edf8]">
            {formatRank(cutoff)}
          </p>
        </div>
        <div>
          <p className="text-xs text-[#898796]">Rank difference</p>
          <p className="mt-1 text-xl font-semibold tracking-tight text-[#c0b0ff]">
            {formatRank(rankDifference)}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-300">
          <CheckCircle2 size={14} />
          Historical cutoff match
        </span>
        <button
          type="button"
          onClick={() => onToggleSave?.(college)}
          aria-pressed={Boolean(isSaved)}
          className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition ${
            isSaved
              ? "border-[#76679f] bg-[#211b2e] text-[#d7cbff]"
              : "border-[#383342] text-[#d2c7f5] hover:border-[#8270b4] hover:bg-[#191523]"
          }`}
        >
          {isSaved ? <BookmarkCheck size={13} /> : <Bookmark size={13} />}
          {isSaved ? "Saved" : "Save college"}
        </button>
        {collegeCode && college.branch_code && onAnalyze && (
          <button
            type="button"
            onClick={() => onAnalyze(college)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#383342] px-3 py-2 text-xs font-medium text-[#d2c7f5] transition hover:border-[#8270b4] hover:bg-[#191523]"
          >
            Phase analysis <ArrowRight size={13} />
          </button>
        )}
      </div>
    </motion.article>
  );
}

function PhaseTable({ results }) {
  if (!Array.isArray(results) || results.length === 0) {
    return (
      <p className="py-5 text-sm text-[#858491]">
        No matching historical cutoffs found for this phase.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[#292832]">
      <table className="w-full min-w-[540px] text-left text-sm">
        <thead className="bg-[#171820] text-xs text-[#9693a3]">
          <tr>
            <th className="px-4 py-3 font-medium">College</th>
            <th className="px-4 py-3 font-medium">Branch</th>
            <th className="px-4 py-3 font-medium">Cutoff</th>
            <th className="px-4 py-3 font-medium">Difference</th>
          </tr>
        </thead>
        <tbody>
          {results.map((item, index) => (
            <tr
              key={`${item.college_code}-${item.branch_code}-${item.phase}-${index}`}
              className="border-t border-[#292832] text-[#e6e2ef]"
            >
              <td className="px-4 py-3">
                <div className="font-medium">
                  {item.college_name || item.college_code}
                </div>
                <div className="mt-1 text-xs text-[#858491]">
                  {item.college_code}
                </div>
              </td>
              <td className="px-4 py-3">
                {item.branch_name || item.branch_code || "—"}
              </td>
              <td className="px-4 py-3 tabular-nums">
                {formatRank(item.cutoff_rank)}
              </td>
              <td className="px-4 py-3 tabular-nums text-[#c0b0ff]">
                {formatRank(item.rank_difference)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Prediction({ onBack }) {
  const [form, setForm] = useState(initialForm);
  const [results, setResults] = useState([]);
  const [savedColleges, setSavedColleges] = useState(() => readSavedColleges());
  const [shortlistMessage, setShortlistMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [disclaimer, setDisclaimer] = useState("");

  const [predictionMode, setPredictionMode] = useState("top5");
  const [phaseResults, setPhaseResults] = useState({});
  const [allPhaseResults, setAllPhaseResults] = useState([]);
  const [modeLoading, setModeLoading] = useState(false);
  const [modeError, setModeError] = useState("");
  const [modeDisclaimer, setModeDisclaimer] = useState("");
  const [modeSearched, setModeSearched] = useState(false);

  const [analysis, setAnalysis] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState("");
  const [analysisDisclaimer, setAnalysisDisclaimer] = useState("");

  const isTG = form.state === "TG";
  const isAP = form.state === "AP";

  const toggleSavedCollege = (college) => {
    const key = getCollegeKey(college, form.state);
    const exists = savedColleges.some((item) => item.key === key);
    const next = exists
      ? savedColleges.filter((item) => item.key !== key)
      : [
          ...savedColleges,
          {
            key,
            college: { ...college },
            state: form.state,
            rank: Number(form.rank),
            category: form.category,
            gender: form.gender,
            preferred_branch: form.preferred_branch,
            saved_at: new Date().toISOString(),
          },
        ];
    setSavedColleges(next);
    setShortlistMessage(exists ? "College removed from your shortlist." : "College saved to your shortlist.");
    try {
      localStorage.setItem("eapcet_saved_colleges", JSON.stringify(next));
    } catch {
      setShortlistMessage("Could not save this college in browser storage.");
    }
  };

  const removeSavedCollege = (key) => {
    const next = savedColleges.filter((item) => item.key !== key);
    setSavedColleges(next);
    try {
      localStorage.setItem("eapcet_saved_colleges", JSON.stringify(next));
    } catch {
      // Keep the in-memory shortlist available for this session.
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
      ...(name === "state" ? { local_area: "" } : {}),
    }));

    setError("");
    setModeError("");
  };

  const validateForm = () => {
    if (!String(form.rank).trim()) {
      return "Please enter your EAPCET rank.";
    }

    const rank = Number(form.rank);

    if (!Number.isInteger(rank) || rank <= 0) {
      return "Rank must be a positive whole number.";
    }

    if (!form.preferred_branch) {
      return "Please select your preferred branch.";
    }

    if (isAP && !form.local_area) {
      return "Please select your AP local area.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setSearched(false);
      return;
    }

    setLoading(true);
    setError("");
    setResults([]);
    setSearched(false);
    setDisclaimer("");

    try {
      const payload = {
        ...form,
        rank: Number(form.rank),
        ...(isAP ? { local_area: form.local_area } : {}),
      };

      const response = await fetch(`${API_BASE}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          getErrorMessage(data, "Unable to generate predictions.")
        );
      }

      setResults(getResults(data));
      setDisclaimer(data.disclaimer || "");
      setSearched(true);
    } catch (err) {
      setError(
        err.message || "Unable to connect to the prediction service."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleModePrediction = async () => {
    const validationError = validateForm();

    if (validationError) {
      setModeError(validationError);
      setModeSearched(false);
      return;
    }

    if (!isTG) {
      setModeError(
        "Phase-wise predictions are currently available for Telangana (TG) only."
      );
      setModeSearched(false);
      return;
    }

    setModeLoading(true);
    setModeError("");
    setPhaseResults({});
    setAllPhaseResults([]);
    setModeSearched(false);
    setModeDisclaimer("");

    const endpoint =
      predictionMode === "phase"
        ? `${API_BASE}/predict-by-phase`
        : `${API_BASE}/predict-all-phases`;

    try {
      const payload = {
        state: form.state,
        rank: Number(form.rank),
        category: form.category,
        gender: form.gender,
        preferred_branch: form.preferred_branch,
      };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          getErrorMessage(data, "Unable to generate phase predictions.")
        );
      }

      if (predictionMode === "phase") {
        setPhaseResults(data.results || {});
      } else {
        setAllPhaseResults(getResults(data));
      }

      setModeDisclaimer(data.disclaimer || "");
      setModeSearched(true);
    } catch (err) {
      setModeError(
        err.message || "Unable to connect to the prediction service."
      );
    } finally {
      setModeLoading(false);
    }
  };

  const handleAnalysis = async (college) => {
    setSelectedCollege(college);
    setAnalysis([]);
    setAnalysisError("");
    setAnalysisDisclaimer("");
    setAnalysisLoading(true);

    try {
      const payload = {
        state: form.state,
        college_code: college.college_code,
        branch_code: college.branch_code,
        rank: Number(form.rank),
        category: form.category,
        gender: form.gender,
        ...(isAP ? { local_area: form.local_area } : {}),
      };

      const response = await fetch(`${API_BASE}/college-analysis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          getErrorMessage(data, "Unable to load college phase analysis.")
        );
      }

      setAnalysis(getResults(data));
      setAnalysisDisclaimer(data.disclaimer || "");
    } catch (err) {
      setAnalysisError(
        err.message || "Unable to load the college analysis."
      );
    } finally {
      setAnalysisLoading(false);
    }
  };

  const closeAnalysis = () => {
    setSelectedCollege(null);
    setAnalysis([]);
    setAnalysisError("");
    setAnalysisDisclaimer("");
  };

  const resetSearch = () => {
    setForm(initialForm);
    setResults([]);
    setError("");
    setSearched(false);
    setDisclaimer("");
    setPhaseResults({});
    setAllPhaseResults([]);
    setModeError("");
    setModeSearched(false);
    setModeDisclaimer("");
    setPredictionMode("top5");
  };

  const modes = [
    {
      value: "top5",
      title: "Top 5 colleges",
      description: "Find colleges matching your rank",
      icon: Search,
    },
    {
      value: "phase",
      title: "Phase-wise",
      description: "Compare first, second and final phases",
      icon: Layers3,
    },
    {
      value: "allPhases",
      title: "All-phase comparison",
      description: "Find colleges matching across all phases",
      icon: GitCompareArrows,
    },
  ];

  return (
    <div style={styles.page} className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-[#25252e] bg-[#08090d]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-3 text-left"
            aria-label="Back to home"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#3a3150] bg-[#191523] text-[#c0b0ff]">
              <GraduationCap size={21} />
            </span>
            <span>
              <span className="block text-sm font-bold tracking-tight text-[#f5f2ff]">
                EAPCET<span className="text-[#b7a5ff]">.AI</span>
              </span>
              <span className="block text-[10px] tracking-[0.15em] text-[#858491]">
                COLLEGE DISCOVERY
              </span>
            </span>
          </button>

          <div className="flex items-center gap-3">
            <span className="hidden rounded-full border border-[#30303b] px-3 py-1.5 text-xs text-[#a7a4b3] sm:inline-flex">
              <span className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Historical data mode
            </span>
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 rounded-xl border border-[#30303b] px-3 py-2.5 text-xs font-medium text-[#ded9eb] transition hover:border-[#76679f] hover:bg-[#15141c] sm:px-4 sm:text-sm"
            >
              <ArrowLeft size={15} />
              <span className="hidden sm:inline">Home</span>
              <span className="sm:hidden">Back</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-9 sm:px-6 sm:pt-14 lg:px-8">
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative mb-10 overflow-hidden rounded-3xl border border-[#302a40] bg-[#101016] p-6 sm:p-9 lg:p-11"
        >
          <div className="pointer-events-none absolute -right-16 -top-28 h-80 w-80 rounded-full bg-[#9b7bff]/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-[#6354a5]/10 blur-3xl" />

          <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_270px]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#443858] bg-[#1b1725] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#c6b8ff]">
                <Sparkles size={13} />
                Your next chapter starts here
              </div>

              <h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-[-0.045em] text-[#f7f4ff] sm:text-5xl lg:text-6xl">
                Find your college.
                <br />
                <span className="text-[#b7a5ff]">Know your options.</span>
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#a09dac] sm:text-base">
                Enter your EAPCET details to explore colleges using historical
                closing ranks. Compare phases and review the options that match
                your selected criteria.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs text-[#a09dac]">
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#b7a5ff]" />
                  AP & Telangana
                </span>
                <span className="inline-flex items-center gap-2">
                  <BarChart3 size={15} className="text-[#b7a5ff]" />
                  Rank-based matching
                </span>
                <span className="inline-flex items-center gap-2">
                  <BookOpen size={15} className="text-[#b7a5ff]" />
                  Historical cutoffs
                </span>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="relative rounded-2xl border border-[#393244] bg-[#0c0d12] p-5">
                <div className="mb-5 flex items-center justify-between">
                  <span className="text-xs text-[#a09dac]">
                    Your search profile
                  </span>
                  <span className="h-2 w-2 rounded-full bg-[#b7a5ff]" />
                </div>
                <div className="space-y-4">
                  <div className="rounded-xl border border-[#292832] bg-[#12131a] p-4">
                    <div className="mb-2 text-xs text-[#8f8c9b]">
                      Exam region
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <MapPin size={15} className="text-[#b7a5ff]" />
                      {form.state === "TG" ? "Telangana" : "Andhra Pradesh"}
                    </div>
                  </div>
                  <div className="rounded-xl border border-[#292832] bg-[#12131a] p-4">
                    <div className="mb-2 text-xs text-[#8f8c9b]">
                      Preferred branch
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <GraduationCap size={16} className="text-[#b7a5ff]" />
                      {form.preferred_branch}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-[#393244] bg-[#1a1624] p-4">
                    <TrendingUp size={19} className="text-[#b7a5ff]" />
                    <div>
                      <p className="text-sm font-medium">Explore by rank</p>
                      <p className="mt-1 text-xs text-[#a09dac]">
                        Your criteria, your options
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <div className="grid items-start gap-8 lg:grid-cols-[350px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-24">
            <section
              style={styles.panel}
              className="overflow-hidden p-5 sm:p-6"
            >
              <div className="mb-6 flex items-start justify-between gap-3">
                <div>
                  <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#b7a5ff]">
                    Search configuration
                  </div>
                  <h2 className="text-xl font-semibold tracking-tight">
                    Your preferences
                  </h2>
                  <p className="mt-2 text-xs leading-5 text-[#92919f]">
                    Set your rank and admission preferences.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={resetSearch}
                  title="Reset form"
                  className="rounded-lg border border-[#30303b] p-2 text-[#a09dac] transition hover:border-[#76679f] hover:text-[#d4c7ff]"
                >
                  <RotateCcw size={15} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <Field label="EAPCET state">
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: "TG", label: "Telangana" },
                      { value: "AP", label: "Andhra Pradesh" },
                    ].map((state) => (
                      <button
                        key={state.value}
                        type="button"
                        onClick={() =>
                          handleChange({
                            target: { name: "state", value: state.value },
                          })
                        }
                        className={`rounded-xl border px-3 py-3 text-sm font-medium transition ${
                          form.state === state.value
                            ? "border-[#8673bc] bg-[#211b2e] text-[#d7cbff]"
                            : "border-[#30303b] bg-[#0b0c11] text-[#9c99a8] hover:border-[#555064]"
                        }`}
                      >
                        {state.label}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field
                  label="Your EAPCET rank"
                  hint="Enter your actual rank as a positive whole number."
                >
                  <input
                    style={styles.input}
                    type="number"
                    name="rank"
                    min="1"
                    step="1"
                    inputMode="numeric"
                    placeholder="e.g. 25000"
                    value={form.rank}
                    onChange={handleChange}
                    onFocus={(event) => {
                      event.currentTarget.style.borderColor = "#8673bc";
                    }}
                    onBlur={(event) => {
                      event.currentTarget.style.borderColor = "#30303b";
                    }}
                  />
                </Field>

                <Field label="Reservation category">
                  <div className="relative">
                    <select
                      style={styles.input}
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="appearance-none pr-9"
                    >
                      {categories.map((category) => (
                        <option
                          key={category.value}
                          value={category.value}
                          className="bg-[#101116]"
                        >
                          {category.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={15}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8d899b]"
                    />
                  </div>
                </Field>

                <Field label="Gender">
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: "boys", label: "Boys" },
                      { value: "girls", label: "Girls" },
                    ].map((gender) => (
                      <button
                        key={gender.value}
                        type="button"
                        onClick={() =>
                          handleChange({
                            target: {
                              name: "gender",
                              value: gender.value,
                            },
                          })
                        }
                        className={`rounded-xl border px-3 py-3 text-sm font-medium transition ${
                          form.gender === gender.value
                            ? "border-[#8673bc] bg-[#211b2e] text-[#d7cbff]"
                            : "border-[#30303b] bg-[#0b0c11] text-[#9c99a8] hover:border-[#555064]"
                        }`}
                      >
                        {gender.label}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="Preferred engineering branch">
                  <div className="relative">
                    <select
                      style={styles.input}
                      name="preferred_branch"
                      value={form.preferred_branch}
                      onChange={handleChange}
                      className="appearance-none pr-9"
                    >
                      {branches.map((branch) => (
                        <option
                          key={branch.value}
                          value={branch.value}
                          className="bg-[#101116]"
                        >
                          {branch.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={15}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8d899b]"
                    />
                  </div>
                </Field>

                {isAP && (
                  <Field
                    label="AP local area"
                    hint="Select the applicable local area for AP predictions."
                  >
                    <div className="relative">
                      <select
                        style={styles.input}
                        name="local_area"
                        value={form.local_area}
                        onChange={handleChange}
                        className="appearance-none pr-9"
                      >
                        <option value="" className="bg-[#101116]">
                          Select local area
                        </option>
                        <option value="ALL" className="bg-[#101116]">
                          All areas
                        </option>
                        <option value="AU" className="bg-[#101116]">
                          Andhra University (AU)
                        </option>
                        <option value="SVU" className="bg-[#101116]">
                          Sri Venkateswara University (SVU)
                        </option>
                      </select>
                      <ChevronDown
                        size={15}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8d899b]"
                      />
                    </div>
                  </Field>
                )}

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-start gap-2 rounded-xl border border-red-900/60 bg-red-950/25 p-3 text-sm leading-5 text-red-300"
                    >
                      <AlertCircle size={16} className="mt-0.5 shrink-0" />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#b7a5ff] px-4 py-3.5 text-sm font-bold text-[#171222] transition hover:bg-[#c9bbff] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <LoaderCircle size={17} className="animate-spin" />
                      Finding colleges...
                    </>
                  ) : (
                    <>
                      <Search size={17} />
                      Find matching colleges
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                <p className="text-center text-[11px] leading-5 text-[#777583]">
                  Predictions are based on historical cutoffs, not guaranteed
                  seat allotments.
                </p>
              </form>
            </section>
          </aside>

          <section className="min-w-0">
            <SectionHeading
              eyebrow="Prediction workspace"
              title="Explore your college options"
              description="Choose how you want to compare historical cutoff data."
              icon={Sparkles}
            />

            {savedColleges.length > 0 && (
              <section className="mb-6 rounded-2xl border border-[#393244] bg-[#101116] p-4 sm:p-5">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-[#eeeaf8]">
                      <BookmarkCheck size={16} className="text-[#c0b0ff]" />
                      My college shortlist
                    </h3>
                    <p className="mt-1 text-xs text-[#92919f]">Saved in this browser · {savedColleges.length} college{savedColleges.length === 1 ? "" : "s"}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSavedColleges([]);
                      setShortlistMessage("Shortlist cleared.");
                      try { localStorage.removeItem("eapcet_saved_colleges"); } catch {}
                    }}
                    className="rounded-lg border border-[#383342] px-3 py-2 text-xs text-[#c6c3d2] hover:border-red-800 hover:text-red-300"
                  >
                    Clear shortlist
                  </button>
                </div>
                <div className="space-y-2">
                  {savedColleges.map((item) => (
                    <div key={item.key} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#292832] bg-[#0c0d12] p-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-[#eeeaf8]">{item.college?.college_name || item.college?.name || item.college?.college_code || "Saved college"}</p>
                        <p className="mt-1 text-xs text-[#92919f]">{item.state} · {item.college?.branch_name || item.college?.branch_code || item.preferred_branch} · Cutoff {formatRank(item.college?.cutoff_rank)}</p>
                      </div>
                      <button type="button" onClick={() => removeSavedCollege(item.key)} className="rounded-lg border border-[#383342] px-3 py-2 text-xs text-[#c6c3d2] hover:border-red-800 hover:text-red-300">Remove</button>
                    </div>
                  ))}
                </div>
                {shortlistMessage && <p className="mt-3 text-xs text-[#c0b0ff]">{shortlistMessage}</p>}
              </section>
            )}

            <div className="mb-6 grid gap-3 sm:grid-cols-3">
              {modes.map((mode) => {
                const Icon = mode.icon;
                const active = predictionMode === mode.value;

                return (
                  <button
                    key={mode.value}
                    type="button"
                    onClick={() => {
                      setPredictionMode(mode.value);
                      setError("");
                      setModeError("");
                      setModeSearched(false);
                    }}
                    className={`rounded-2xl border p-4 text-left transition ${
                      active
                        ? "border-[#716094] bg-[#1b1725]"
                        : "border-[#292832] bg-[#101116] hover:border-[#4b435f]"
                    }`}
                  >
                    <div
                      className={`mb-4 flex h-9 w-9 items-center justify-center rounded-xl ${
                        active
                          ? "bg-[#b7a5ff] text-[#171222]"
                          : "border border-[#30303b] text-[#a7a1b8]"
                      }`}
                    >
                      <Icon size={17} />
                    </div>
                    <h3 className="text-sm font-semibold text-[#eeeaf8]">
                      {mode.title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-5 text-[#92919f]">
                      {mode.description}
                    </p>
                    {active && (
                      <div className="mt-3 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#c7baff]">
                        Selected <CheckCircle2 size={12} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {predictionMode !== "top5" && (
              <div className="mb-6">
                <Notice type={!isTG ? "warning" : "info"}>
                  {!isTG ? (
                    <>
                      Phase-wise prediction is currently available for{" "}
                      <strong>Telangana (TG) only</strong>. Select Telangana
                      to use this mode. AP phase-wise source data is not
                      available in the current standardized dataset.
                    </>
                  ) : (
                    <>
                      This mode compares historical First, Second and Final
                      phase cutoffs. Results are based on your selected
                      category, gender, rank and branch.
                    </>
                  )}
                </Notice>
                <button
                  type="button"
                  onClick={handleModePrediction}
                  disabled={modeLoading || !isTG}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#655580] bg-[#1b1725] px-4 py-3.5 text-sm font-semibold text-[#d6caff] transition hover:bg-[#252035] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  {modeLoading ? (
                    <>
                      <LoaderCircle size={17} className="animate-spin" />
                      Comparing phases...
                    </>
                  ) : (
                    <>
                      <BarChart3 size={17} />
                      Compare historical phases
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
                {modeError && (
                  <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-900/60 bg-red-950/25 p-3 text-sm text-red-300">
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    {modeError}
                  </div>
                )}
              </div>
            )}

            {predictionMode === "top5" && (
              <AnimatePresence mode="wait">
                {!searched && !loading && !error && (
                  <motion.div
                    key="top5-empty"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                  >
                    <EmptyState
                      title="Your results will appear here"
                      description="Enter your rank, choose your category and preferred branch, then select Find matching colleges to see historical cutoff matches."
                      icon={GraduationCap}
                    />
                  </motion.div>
                )}

                {loading && (
                  <motion.div
                    key="top5-loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-2xl border border-[#292832] bg-[#101116] px-5 py-16 text-center"
                  >
                    <LoaderCircle
                      size={32}
                      className="mx-auto animate-spin text-[#b7a5ff]"
                    />
                    <h3 className="mt-4 text-base font-semibold">
                      Finding matching colleges
                    </h3>
                    <p className="mt-2 text-sm text-[#92919f]">
                      Matching your criteria against historical cutoff data.
                    </p>
                  </motion.div>
                )}

                {searched && !loading && (
                  <motion.div
                    key="top5-results"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
                      <div>
                        <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#b7a5ff]">
                          Search results
                        </div>
                        <h3 className="text-2xl font-semibold tracking-tight">
                          Matching colleges
                        </h3>
                        <p className="mt-2 text-sm text-[#92919f]">
                          {form.state} · {form.preferred_branch} ·{" "}
                          {categories.find(
                            (category) => category.value === form.category
                          )?.label || form.category}{" "}
                          · Rank {formatRank(form.rank)}
                        </p>
                      </div>
                      <span className="rounded-full border border-[#38304d] bg-[#191523] px-3 py-1.5 text-xs font-semibold text-[#c6b8ff]">
                        {results.length} result{results.length === 1 ? "" : "s"}
                      </span>
                    </div>

                    {results.length > 0 ? (
                      <div className="space-y-4">
                        {results.map((college, index) => (
                          <CollegeCard
                            key={`${college.college_code}-${college.branch_code}-${index}`}
                            college={college}
                            index={index}
                            onAnalyze={handleAnalysis}
                            onToggleSave={toggleSavedCollege}
                            isSaved={savedColleges.some((item) => item.key === getCollegeKey(college, form.state))}
                          />
                        ))}
                      </div>
                    ) : (
                      <EmptyState
                        title="No matching colleges found"
                        description="No historical cutoff matches were returned for these criteria. Try another branch or review your rank, category, gender and local-area selection."
                        icon={Search}
                      />
                    )}

                    {disclaimer && (
                      <div className="mt-5">
                        <Notice>{disclaimer}</Notice>
                      </div>
                    )}
                    <p className="mt-4 text-xs leading-5 text-[#777583]">
                      Results represent historical cutoff matches only. They
                      do not guarantee admission or seat allotment.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            )}

            {predictionMode === "phase" && (
              <AnimatePresence mode="wait">
                {!modeSearched && !modeLoading && !modeError && (
                  <motion.div
                    key="phase-empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <EmptyState
                      title="Compare all three phases"
                      description="Choose Telangana and your preferences, then run the comparison to view First, Second and Final phase historical cutoff matches."
                      icon={Layers3}
                    />
                  </motion.div>
                )}

                {modeLoading && (
                  <div className="rounded-2xl border border-[#292832] bg-[#101116] px-5 py-16 text-center">
                    <LoaderCircle
                      size={30}
                      className="mx-auto animate-spin text-[#b7a5ff]"
                    />
                    <p className="mt-4 text-sm text-[#bcb8c9]">
                      Comparing phase data...
                    </p>
                  </div>
                )}

                {modeSearched && !modeLoading && (
                  <motion.div
                    key="phase-results"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-5"
                  >
                    {phases.map((phase, index) => {
                      const phaseData = phaseResults?.[phase];
                      const phaseRows = Array.isArray(phaseData)
                        ? phaseData
                        : Array.isArray(phaseData?.results)
                          ? phaseData.results
                          : [];

                      return (
                        <section
                          key={phase}
                          className="rounded-2xl border border-[#292832] bg-[#101116] p-4 sm:p-5"
                        >
                          <div className="mb-4 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#393244] bg-[#191523] text-xs font-bold text-[#c6b8ff]">
                                0{index + 1}
                              </span>
                              <div>
                                <h3 className="font-semibold text-[#eeeaf8]">
                                  {phase} Phase
                                </h3>
                                <p className="mt-1 text-xs text-[#858491]">
                                  Historical cutoff matches
                                </p>
                              </div>
                            </div>
                            <span className="rounded-full border border-[#30303b] px-2.5 py-1 text-xs text-[#b6b2c3]">
                              {phaseRows.length} colleges
                            </span>
                          </div>
                          <PhaseTable results={phaseRows} />
                        </section>
                      );
                    })}

                    {modeDisclaimer && <Notice>{modeDisclaimer}</Notice>}
                    <p className="text-xs leading-5 text-[#777583]">
                      Phase-wise historical matches do not guarantee
                      allotment. Actual results depend on official
                      counselling rules and seat availability.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            )}

            {predictionMode === "allPhases" && (
              <AnimatePresence mode="wait">
                {!modeSearched && !modeLoading && !modeError && (
                  <motion.div
                    key="all-empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <EmptyState
                      title="Compare colleges across every phase"
                      description="This view focuses on colleges and branches with qualifying historical cutoff matches across First, Second and Final phases."
                      icon={GitCompareArrows}
                    />
                  </motion.div>
                )}

                {modeLoading && (
                  <div className="rounded-2xl border border-[#292832] bg-[#101116] px-5 py-16 text-center">
                    <LoaderCircle
                      size={30}
                      className="mx-auto animate-spin text-[#b7a5ff]"
                    />
                    <p className="mt-4 text-sm text-[#bcb8c9]">
                      Comparing all three phases...
                    </p>
                  </div>
                )}

                {modeSearched && !modeLoading && (
                  <motion.div
                    key="all-results"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                      <div>
                        <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#b7a5ff]">
                          Cross-phase comparison
                        </div>
                        <h3 className="text-2xl font-semibold">
                          Colleges across all phases
                        </h3>
                      </div>
                      <span className="rounded-full border border-[#38304d] bg-[#191523] px-3 py-1.5 text-xs font-semibold text-[#c6b8ff]">
                        {allPhaseResults.length} groups
                      </span>
                    </div>

                    {allPhaseResults.length > 0 ? (
                      <div className="space-y-4">
                        {allPhaseResults.map((group, index) => {
                          const groupRows = Array.isArray(group)
                            ? group
                            : Array.isArray(group.phases)
                              ? group.phases
                              : Array.isArray(group.results)
                                ? group.results
                                : [group];

                          const first = groupRows[0] || {};
                          const groupName =
                            first.college_name ||
                            group.college_name ||
                            first.college_code ||
                            group.college_code ||
                            `College ${index + 1}`;

                          const branchName =
                            first.branch_name ||
                            first.branch_code ||
                            group.branch_name ||
                            group.branch_code ||
                            "Branch";

                          const phaseMap = {};
                          groupRows.forEach((row) => {
                            if (row.phase) phaseMap[row.phase] = row;
                          });

                          return (
                            <article
                              key={`${first.college_code || group.college_code}-${first.branch_code || group.branch_code}-${index}`}
                              className="rounded-2xl border border-[#292832] bg-[#101116] p-5"
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#393244] bg-[#191523] text-[#c0b0ff]">
                                  <Building2 size={18} />
                                </div>
                                <div className="min-w-0">
                                  <h4 className="font-semibold leading-6 text-[#f0edf8]">
                                    {groupName}
                                  </h4>
                                  <p className="mt-1 text-sm text-[#9693a3]">
                                    {branchName}
                                  </p>
                                  <p className="mt-1 text-xs text-[#777583]">
                                    {first.college_code ||
                                      group.college_code ||
                                      ""}
                                  </p>
                                </div>
                              </div>

                              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                                {phases.map((phase, phaseIndex) => {
                                  const row = phaseMap[phase];
                                  return (
                                    <div
                                      key={phase}
                                      className="rounded-xl border border-[#292832] bg-[#0c0d12] p-4"
                                    >
                                      <div className="mb-3 flex items-center justify-between gap-2">
                                        <span className="text-xs text-[#9d99aa]">
                                          {phase} phase
                                        </span>
                                        <span className="text-[10px] text-[#777583]">
                                          0{phaseIndex + 1}
                                        </span>
                                      </div>
                                      <p className="text-xl font-semibold tabular-nums text-[#eeeaf8]">
                                        {formatRank(row?.cutoff_rank)}
                                      </p>
                                      <p className="mt-2 text-xs text-[#858491]">
                                        Rank difference:{" "}
                                        <span className="text-[#c0b0ff]">
                                          {formatRank(row?.rank_difference)}
                                        </span>
                                      </p>
                                      {!row && (
                                        <p className="mt-2 text-xs text-amber-300">
                                          No phase record
                                        </p>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    ) : (
                      <EmptyState
                        title="No colleges matched all phases"
                        description="No college and branch groups were returned for all three qualifying historical phases. Try another rank or branch."
                        icon={GitCompareArrows}
                      />
                    )}

                    {modeDisclaimer && (
                      <div className="mt-5">
                        <Notice>{modeDisclaimer}</Notice>
                      </div>
                    )}
                    <p className="mt-4 text-xs leading-5 text-[#777583]">
                      Only the historical data returned by the backend is
                      displayed. Historical cutoff matches do not guarantee
                      future admission.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            )}

            <div className="mt-8 rounded-2xl border border-[#292832] bg-[#0d0e13] p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#393244] bg-[#191523] text-[#c0b0ff]">
                  <Info size={17} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#e8e4f2]">
                    How to interpret your results
                  </h3>
                  <p className="mt-2 text-xs leading-6 text-[#92919f]">
                    A historical cutoff match means the recorded closing rank
                    meets the matching criteria used by this application. It
                    is not a prediction of guaranteed admission. Counselling
                    outcomes depend on the official rules, current-year
                    cutoffs, seat availability and your choices.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-[#25252e]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-[#777583] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span>
            <span className="font-semibold text-[#c9c3d8]">EAPCET</span>{" "}
            · College discovery and historical cutoff analysis
          </span>
          <span>Use official counselling sources for final decisions.</span>
        </div>
      </footer>

      <AnimatePresence>
        {selectedCollege && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) closeAnalysis();
            }}
          >
            <motion.section
              role="dialog"
              aria-modal="true"
              aria-labelledby="analysis-title"
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-[#393244] bg-[#101116] p-5 shadow-2xl sm:p-7"
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#b7a5ff]">
                    Historical analysis
                  </div>
                  <h2
                    id="analysis-title"
                    className="text-xl font-semibold text-[#f4f0ff] sm:text-2xl"
                  >
                    College phase analysis
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[#92919f]">
                    {selectedCollege.college_name ||
                      selectedCollege.college_code}{" "}
                    ·{" "}
                    {selectedCollege.branch_name ||
                      selectedCollege.branch_code}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeAnalysis}
                  aria-label="Close analysis"
                  className="rounded-xl border border-[#30303b] p-2.5 text-[#aaa6b7] transition hover:border-[#76679f] hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {analysisLoading && (
                <div className="py-14 text-center">
                  <LoaderCircle
                    size={30}
                    className="mx-auto animate-spin text-[#b7a5ff]"
                  />
                  <p className="mt-4 text-sm text-[#a09dac]">
                    Loading historical phase data...
                  </p>
                </div>
              )}

              {analysisError && (
                <div className="flex items-start gap-2 rounded-xl border border-red-900/60 bg-red-950/25 p-4 text-sm text-red-300">
                  <AlertCircle size={17} className="mt-0.5 shrink-0" />
                  {analysisError}
                </div>
              )}

              {!analysisLoading && !analysisError && (
                <>
                  {analysis.length > 0 ? (
                    <PhaseTable results={analysis} />
                  ) : (
                    <EmptyState
                      title="No qualifying phase records"
                      description="No historical phase records matching this rank and college were returned by the backend."
                      icon={BarChart3}
                    />
                  )}
                  {analysisDisclaimer && (
                    <div className="mt-4">
                      <Notice>{analysisDisclaimer}</Notice>
                    </div>
                  )}
                </>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={closeAnalysis}
                  className="rounded-xl border border-[#393244] px-5 py-2.5 text-sm font-medium text-[#d6caff] transition hover:bg-[#1a1723]"
                >
                  Close analysis
                </button>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
