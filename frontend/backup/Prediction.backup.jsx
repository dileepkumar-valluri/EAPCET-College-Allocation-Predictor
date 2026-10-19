
import { useState } from 'react'
import { motion } from 'motion/react'
import {
  ArrowLeft,
  Search,
  GraduationCap,
  MapPin,
  AlertCircle,
  LoaderCircle,
  BarChart3,
  X,
} from 'lucide-react'

const categories = [
  'OC', 'BC_A', 'BC_B', 'BC_C', 'BC_D', 'BC_E',
  'SC_I', 'SC_II', 'SC_III', 'ST', 'EWS',
]

const initialForm = {
  state: 'TG',
  rank: '',
  category: 'OC',
  gender: 'boys',
  preferred_branch: 'CSE',
  local_area: '',
}

const inputClass =
  'mt-2 w-full rounded-xl border border-white/10 bg-[#0b1224] px-4 py-3 text-sm text-white outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20'

export default function Prediction({ onBack }) {
  const [form, setForm] = useState(initialForm)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)
  const [disclaimer, setDisclaimer] = useState('')
  const [predictionMode, setPredictionMode] = useState('top5')
  const [phaseResults, setPhaseResults] = useState({})
  const [allPhaseResults, setAllPhaseResults] = useState([])
  const [modeLoading, setModeLoading] = useState(false)
  const [modeError, setModeError] = useState('')
  const [modeDisclaimer, setModeDisclaimer] = useState('')

  const [analysis, setAnalysis] = useState([])
  const [analysisCollege, setAnalysisCollege] = useState(null)
  const [analysisLoading, setAnalysisLoading] = useState(false)
  const [analysisError, setAnalysisError] = useState('')
  const [analysisDisclaimer, setAnalysisDisclaimer] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
      ...(name === 'state' ? { local_area: '' } : {}),
    }))

    setError('')
  }
  const handleModePrediction = async () => {
  setModeError('')
  setModeDisclaimer('')
  setPhaseResults({})
  setAllPhaseResults([])

  const rank = Number(form.rank)

  if (!Number.isSafeInteger(rank) || rank <= 0) {
    setModeError('Please enter a valid positive whole-number rank.')
    return
  }

  if (form.state !== 'TG') {
    setModeError(
      'Phase-wise predictions are currently available only for Telangana (TG).',
    )
    return
  }

  if (!form.preferred_branch.trim()) {
    setModeError('Please enter a preferred branch.')
    return
  }

  setModeLoading(true)

  try {
    const payload = {
      state: form.state,
      rank,
      category: form.category,
      gender: form.gender,
      preferred_branch: form.preferred_branch.trim(),
    }

    const endpoint =
      predictionMode === 'phase'
        ? '/api/predict-by-phase'
        : '/api/predict-all-phases'

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(
        data.error || data.message || 'Unable to fetch predictions.',
      )
    }

    if (predictionMode === 'phase') {
      setPhaseResults(data.results || {})
    } else {
      setAllPhaseResults(data.results || [])
    }

    setModeDisclaimer(data.disclaimer || '')
  } catch (err) {
    setModeError(
      err.message || 'Unable to connect to the backend.',
    )
  } finally {
    setModeLoading(false)
  }
}

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setResults([])
    setDisclaimer('')
    setSearched(false)
    setAnalysis([])
    setAnalysisCollege(null)
    setAnalysisError('')

    const rank = Number(form.rank)

    if (!Number.isSafeInteger(rank) || rank <= 0) {
      setError('Please enter a valid positive whole-number rank.')
      return
    }

    if (!form.preferred_branch.trim()) {
      setError('Please enter a preferred branch.')
      return
    }

    if (form.state === 'AP' && !form.local_area) {
      setError('For AP predictions, select a local area.')
      return
    }

    setLoading(true)

    try {
      const payload = {
        ...form,
        rank,
        preferred_branch: form.preferred_branch.trim(),
        local_area: form.state === 'AP' ? form.local_area : '',
      }

      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || data.message || 'Unable to fetch predictions.',
        )
      }

      setResults(data.results || [])
      setDisclaimer(data.disclaimer || '')
      setSearched(true)
    } catch (err) {
      setError(
        err.message ||
          'Unable to connect to the backend. Please check that Flask is running.',
      )
    } finally {
      setLoading(false)
    }
  }

  const handleAnalysis = async (college) => {
    setAnalysisCollege(college)
    setAnalysis([])
    setAnalysisError('')
    setAnalysisDisclaimer('')
    setAnalysisLoading(true)

    try {
      const payload = {
        state: form.state,
        college_code: college.college_code,
        branch_code: college.branch_code,
        rank: Number(form.rank),
        category: form.category,
        gender: form.gender,
        ...(form.state === 'AP' ? { local_area: form.local_area } : {}),
      }

      const response = await fetch('/api/college-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || 'Unable to load college phase analysis.',
        )
      }

      setAnalysis(data.results || [])
      setAnalysisDisclaimer(data.disclaimer || '')
    } catch (err) {
      setAnalysisError(
        err.message || 'Unable to load phase-wise college analysis.',
      )
    } finally {
      setAnalysisLoading(false)
    }
  }

  const closeAnalysis = () => {
    setAnalysisCollege(null)
    setAnalysis([])
    setAnalysisError('')
    setAnalysisDisclaimer('')
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#070b17] text-slate-100">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-blue-600/10 blur-[100px]" />
        <div className="absolute -right-32 top-80 h-80 w-80 rounded-full bg-violet-600/10 blur-[100px]" />
      </div>

      <header className="relative border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-slate-300 transition hover:text-white"
          >
            <ArrowLeft size={18} />
            Back to Home
          </button>

          <div className="flex items-center gap-2 font-semibold">
            <GraduationCap className="text-violet-400" size={25} />
            <span>
              EAPCET<span className="text-violet-400">Guide</span>
            </span>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-5xl px-5 py-12 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-xs font-medium text-violet-300">
            COLLEGE PREDICTION
          </span>

          <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-5xl">
            Find colleges that match
            <span className="block bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              your EAPCET rank
            </span>
          </h1>

          <p className="mt-4 leading-7 text-slate-400">
            Explore college recommendations and compare historical counselling cutoffs.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mx-auto mt-10 max-w-3xl rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-violet-950/20 sm:p-9"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-300">
              EAPCET State
              <select
                name="state"
                value={form.state}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="AP">Andhra Pradesh (AP)</option>
                <option value="TG">Telangana (TG)</option>
              </select>
            </label>

            <label className="text-sm font-medium text-slate-300">
              EAPCET Rank
              <input
                type="number"
                name="rank"
                min="1"
                step="1"
                required
                value={form.rank}
                onChange={handleChange}
                placeholder="e.g. 25000"
                className={inputClass}
              />
            </label>

            {form.state === 'AP' && (
              <label className="text-sm font-medium text-slate-300">
                Local Area
                <select
                  name="local_area"
                  value={form.local_area}
                  onChange={handleChange}
                  required
                  className={inputClass}
                >
                  <option value="">Select local area</option>
                  <option value="ALL">Entire Andhra Pradesh</option>
                  <option value="AU">AU — Andhra University area</option>
                  <option value="SVU">SVU — Sri Venkateswara University area</option>
                </select>
                <span className="mt-2 block text-xs text-slate-500">
                  Results use the local-area labels available in the dataset.
                </span>
              </label>
            )}

            <label className="text-sm font-medium text-slate-300">
              Category
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className={inputClass}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-medium text-slate-300">
              Gender
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="boys">Boys</option>
                <option value="girls">Girls</option>
              </select>
            </label>

            <label className="text-sm font-medium text-slate-300 sm:col-span-2">
              Preferred Branch
              <input
                type="text"
                name="preferred_branch"
                value={form.preferred_branch}
                onChange={handleChange}
                placeholder="e.g. CSE, ECE, EEE"
                className={inputClass}
              />
              <span className="mt-2 block text-xs text-slate-500">
                Enter a branch code or branch name supported by the dataset.
              </span>
            </label>
          </div>

          {error && (
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-300">
              <AlertCircle size={19} className="mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-4 font-semibold text-white shadow-lg shadow-violet-900/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <LoaderCircle className="animate-spin" size={19} />
                Finding Colleges...
              </>
            ) : (
              <>
                <Search size={19} />
                Find Colleges
              </>
            )}
          </button>
        </motion.form>
        
        {/* Prediction Mode Selector */}
        <section className="mx-auto mt-8 max-w-3xl">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Choose Prediction Mode
          </h2>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { id: 'top5', label: 'Top 5 Predictions' },
              { id: 'phase', label: 'Phase-wise Predictions' },
              { id: 'allPhases', label: 'All Three Phases' },
            ].map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => {
                  setPredictionMode(mode.id)
                  setModeError('')
                  setModeDisclaimer('')
                  setPhaseResults({})
                  setAllPhaseResults([])
                }}
                className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                  predictionMode === mode.id
                    ? 'border-violet-400 bg-violet-400/15 text-violet-200'
                    : 'border-white/10 bg-white/[0.035] text-slate-300 hover:border-violet-400/40'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>

          {predictionMode !== 'top5' && (
            <div className="mt-4">
              <p className="mb-3 text-sm text-slate-400">
                {predictionMode === 'phase'
                  ? 'View the top 5 matching colleges separately for each counselling phase.'
                  : 'Find colleges whose historical cutoffs match your rank in all three phases.'}
              </p>

              <button
                type="button"
                onClick={handleModePrediction}
                disabled={modeLoading || form.state !== 'TG'}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3 font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {modeLoading ? (
                  <>
                    <LoaderCircle className="animate-spin" size={18} />
                    Finding Colleges...
                  </>
                ) : (
                  <>
                    <Search size={18} />
                    Find Matching Colleges
                  </>
                )}
              </button>

              {form.state !== 'TG' && (
                <p className="mt-3 text-sm text-amber-300">
                  Phase-wise prediction modes are currently available only for TG.
                </p>
              )}
            </div>
          )}

          {modeError && (
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-300">
              <AlertCircle size={18} className="shrink-0" />
              <p>{modeError}</p>
            </div>
          )}
        </section>
          
        {/* Phase-wise and All-Three-Phases Results */}
        {predictionMode === 'phase' && (
          <section className="mt-12">
            <h2 className="mb-2 text-2xl font-bold">
              Phase-wise College Predictions
            </h2>
            <p className="mb-6 text-sm text-slate-400">
              Historical cutoffs matching your rank for each counselling phase.
            </p>

            <div className="space-y-8">
              {['First', 'Second', 'Final'].map((phase) => {
                const colleges = phaseResults[phase] || []

                return (
                  <div key={phase}>
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">
                        {phase} Phase
                      </h3>
                      <span className="rounded-full bg-violet-400/10 px-3 py-1 text-xs text-violet-200">
                        {colleges.length} colleges
                      </span>
                    </div>

                    {colleges.length === 0 ? (
                      <div className="rounded-xl border border-white/10 p-5 text-sm text-slate-400">
                        No matching historical cutoff records found for this phase.
                      </div>
                    ) : (
                      <div className="grid gap-3">
                        {colleges.map((college) => (
                          <article
                            key={`${phase}-${college.college_code}-${college.branch_code}`}
                            className="rounded-2xl border border-white/10 bg-white/[0.035] p-5"
                          >
                            <div className="flex flex-col justify-between gap-3 sm:flex-row">
                              <div>
                                <h4 className="font-semibold text-white">
                                  {college.college_name}
                                </h4>
                                <p className="mt-2 flex items-center gap-2 text-sm text-slate-400">
                                  <MapPin size={15} />
                                  {college.district || 'District unavailable'}
                                </p>
                                <p className="mt-2 text-sm text-slate-300">
                                  {college.branch_name || college.branch_code}
                                </p>
                              </div>

                              <div className="sm:text-right">
                                <p className="text-xs text-slate-400">
                                  Historical cutoff
                                </p>
                                <p className="mt-1 text-xl font-bold text-violet-300">
                                  {Number(college.cutoff_rank).toLocaleString('en-IN')}
                                </p>
                                <p className="mt-1 text-xs text-emerald-300">
                                  Within historical cutoff
                                </p>
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {modeDisclaimer && (
              <p className="mt-6 rounded-xl border border-amber-400/10 bg-amber-400/5 p-4 text-sm leading-6 text-amber-200/80">
                {modeDisclaimer}
              </p>
            )}
          </section>
        )}

        {predictionMode === 'allPhases' && (
          <section className="mt-12">
            <h2 className="mb-2 text-2xl font-bold">
              Colleges Matching All Three Phases
            </h2>
            <p className="mb-6 text-sm text-slate-400">
              Each listed college must have a matching historical cutoff in First, Second and Final phases.
            </p>

            {allPhaseResults.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 text-center text-slate-300">
                No colleges matched all three phases for the selected criteria.
              </div>
            ) : (
              <div className="grid gap-4">
                {Object.values(
                  allPhaseResults.reduce((groups, record) => {
                    const key = `${record.college_code}-${record.branch_code}`

                    if (!groups[key]) {
                      groups[key] = {
                        ...record,
                        phases: [],
                      }
                    }

                    groups[key].phases.push(record)
                    return groups
                  }, {}),
                ).map((college) => (
                  <article
                    key={`${college.college_code}-${college.branch_code}`}
                    className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 sm:p-6"
                  >
                    <h3 className="text-lg font-semibold text-white">
                      {college.college_name}
                    </h3>

                    <p className="mt-2 flex items-center gap-2 text-sm text-slate-400">
                      <MapPin size={15} />
                      {college.district || 'District unavailable'}
                    </p>

                    <p className="mt-2 text-sm text-slate-300">
                      Branch: {college.branch_name || college.branch_code}
                    </p>

                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      {['First', 'Second', 'Final'].map((phase) => {
                        const record = college.phases.find(
                          (item) => item.phase === phase,
                        )

                        return (
                          <div
                            key={phase}
                            className="rounded-xl border border-white/10 bg-[#0b1224] p-4"
                          >
                            <p className="text-xs text-slate-400">
                              {phase} Phase
                            </p>
                            <p className="mt-2 text-lg font-bold text-violet-300">
                              {record
                                ? Number(record.cutoff_rank).toLocaleString('en-IN')
                                : 'N/A'}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              Historical cutoff
                            </p>
                          </div>
                        )
                      })}
                    </div>

                    <p className="mt-4 text-xs text-emerald-300">
                      Matches historical cutoffs in all three phases
                    </p>
                  </article>
                ))}
              </div>
            )}

            {modeDisclaimer && (
              <p className="mt-6 rounded-xl border border-amber-400/10 bg-amber-400/5 p-4 text-sm leading-6 text-amber-200/80">
                {modeDisclaimer}
              </p>
            )}
          </section>
        )}

        {searched && predictionMode === 'top5' && (
          <section className="mt-12">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">College Results</h2>
                <p className="mt-1 text-sm text-slate-400">
                  {results.length} matching college recommendations
                </p>
              </div>
              <GraduationCap className="text-violet-400" size={30} />
            </div>

            {results.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 text-center text-slate-300">
                No eligible historical cutoff records found for these inputs.
                Try another branch or review the selected criteria.
              </div>
            ) : (
              <div className="grid gap-4">
                {results.map((college, index) => (
                  <motion.article
                    key={`${college.state}-${college.college_code}-${college.branch_code}-${college.local_area}-${index}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.07 }}
                    className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 sm:p-6"
                  >
                    <div className="flex flex-col justify-between gap-4 sm:flex-row">
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {college.college_name || 'College name unavailable'}
                        </h3>

                        <p className="mt-2 flex items-center gap-2 text-sm text-slate-400">
                          <MapPin size={15} />
                          {college.district || 'District unavailable'}
                        </p>

                        <p className="mt-2 text-sm text-slate-300">
                          Branch: {college.branch_name || college.branch_code || 'N/A'}
                        </p>

                        {college.local_area && (
                          <p className="mt-1 text-xs text-slate-500">
                            Dataset local area: {college.local_area}
                          </p>
                        )}
                      </div>

                      <div className="sm:text-right">
                        <span className="inline-block rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                          {college.prediction_status || 'Historical record'}
                        </span>

                        <p className="mt-3 text-sm text-slate-400">
                          Historical cutoff
                        </p>

                        <p className="mt-1 text-xl font-bold text-violet-300">
                          {college.cutoff_rank ?? 'N/A'}
                        </p>

                        {college.phase && (
                          <p className="mt-1 text-xs text-slate-500">
                            Phase: {college.phase}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAnalysis(college)}
                      disabled={analysisLoading}
                      className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-violet-400/30 bg-violet-400/10 px-4 py-3 text-sm font-medium text-violet-200 transition hover:bg-violet-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <BarChart3 size={17} />
                      View Phase-wise Analysis
                    </button>
                  </motion.article>
                ))}
              </div>
            )}

            {disclaimer && (
              <p className="mt-6 rounded-xl border border-amber-400/10 bg-amber-400/5 p-4 text-sm leading-6 text-amber-200/80">
                {disclaimer}
              </p>
            )}
          </section>
        )}

        {analysisCollege && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm">
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="analysis-title"
              className="my-8 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/10 bg-[#0b1224] p-5 shadow-2xl sm:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-violet-300">
                    Historical cutoff analysis
                  </p>
                  <h2 id="analysis-title" className="mt-2 text-xl font-bold sm:text-2xl">
                    {analysisCollege.college_name}
                  </h2>
                  <p className="mt-2 text-sm text-slate-400">
                    {analysisCollege.branch_name || analysisCollege.branch_code}
                    {' · '}Your rank: {Number(form.rank).toLocaleString('en-IN')}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeAnalysis}
                  aria-label="Close analysis"
                  className="rounded-lg border border-white/10 p-2 text-slate-300 hover:bg-white/10"
                >
                  <X size={20} />
                </button>
              </div>

              {analysisLoading ? (
                <div className="flex items-center justify-center gap-3 py-12 text-slate-300">
                  <LoaderCircle className="animate-spin" size={22} />
                  Loading phase-wise cutoffs...
                </div>
              ) : analysisError ? (
                <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-300">
                  <AlertCircle size={19} className="shrink-0" />
                  <p>{analysisError}</p>
                </div>
              ) : analysis.length === 0 ? (
                <div className="mt-6 rounded-xl border border-white/10 p-5 text-sm text-slate-300">
                  No historical phase-wise cutoff records were found for this college, branch and category.
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {analysis.map((record, index) => {
                    const withinCutoff =
                      record.rank_comparison === 'Within historical cutoff'

                    return (
                      <article
                        key={`${record.phase}-${record.cutoff_rank}-${index}`}
                        className="rounded-2xl border border-white/10 bg-white/[0.035] p-5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <h3 className="font-semibold text-white">
                            {record.phase} Phase
                          </h3>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              withinCutoff
                                ? 'bg-emerald-400/10 text-emerald-300'
                                : 'bg-amber-400/10 text-amber-300'
                            }`}
                          >
                            {record.rank_comparison}
                          </span>
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                          <div>
                            <p className="text-xs text-slate-400">Historical cutoff</p>
                            <p className="mt-1 text-lg font-bold text-violet-300">
                              {Number(record.cutoff_rank).toLocaleString('en-IN')}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-400">Your rank</p>
                            <p className="mt-1 text-lg font-semibold text-white">
                              {Number(record.student_rank).toLocaleString('en-IN')}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-400">Cutoff difference</p>
                            <p className="mt-1 text-lg font-semibold text-white">
                              {Number(record.rank_difference).toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>
              )}

              {analysisDisclaimer && (
                <p className="mt-6 rounded-xl border border-amber-400/10 bg-amber-400/5 p-4 text-sm leading-6 text-amber-200/80">
                  {analysisDisclaimer}
                </p>
              )}

              <button
                type="button"
                onClick={closeAnalysis}
                className="mt-6 w-full rounded-xl border border-white/10 px-5 py-3 font-medium text-white transition hover:bg-white/10"
              >
                Close Analysis
              </button>
            </section>
          </div>
        )}
      </main>
    </div>
  )
}
