
import { useState } from 'react'
import Prediction from './Prediction.jsx'
import { motion } from 'motion/react'
import {
  ArrowRight,
  Atom,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  GraduationCap,
  Menu,
  Sparkles,
  Target,
  X,
} from 'lucide-react'

const features = [
  {
    icon: Target,
    title: 'Personalized predictions',
    description:
      'Explore engineering colleges using your rank, category, gender and preferred branch.',
  },
  {
    icon: BarChart3,
    title: 'Cutoff insights',
    description:
      'Compare your rank against historical AP and TG EAPCET cutoff data.',
  },
  {
    icon: BrainCircuit,
    title: 'Smarter decisions',
    description:
      'Understand your options with clear results based on historical admission records.',
  },
]

function App() {
  const [showPrediction, setShowPrediction] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const goToPredict = () => {
    setMenuOpen(false)
    setShowPrediction(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (showPrediction) {
    return (
      <Prediction
        onBack={() => {
          setShowPrediction(false)
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
      />
    )
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#070b17] text-slate-100">
      <header className="relative z-20 border-b border-white/[0.08] bg-[#070b17]/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 text-left"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10">
              <Atom className="h-6 w-6 text-cyan-300" />
            </div>
            <div>
              <p className="text-lg font-bold tracking-tight">
                EAPCET<span className="text-cyan-300">.AI</span>
              </p>
              <p className="text-[10px] tracking-[0.2em] text-slate-500">
                COLLEGE DISCOVERY
              </p>
            </div>
          </button>

          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm text-slate-400 transition hover:text-white"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm text-slate-400 transition hover:text-white"
            >
              How it works
            </a>
            <button
              type="button"
              onClick={goToPredict}
              className="flex items-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
            >
              Predict colleges <ArrowRight size={16} />
            </button>
          </div>

          <button
            type="button"
            className="rounded-lg border border-white/10 p-2 md:hidden"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((previous) => !previous)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </nav>

        {menuOpen && (
          <div className="space-y-4 border-t border-white/10 px-6 py-5 md:hidden">
            <a
              href="#features"
              onClick={() => setMenuOpen(false)}
              className="block text-slate-300"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMenuOpen(false)}
              className="block text-slate-300"
            >
              How it works
            </a>
            <button
              type="button"
              onClick={goToPredict}
              className="w-full rounded-xl bg-cyan-300 px-5 py-3 font-semibold text-slate-950"
            >
              Predict colleges
            </button>
          </div>
        )}
      </header>

      <main>
        <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 md:min-h-[650px] md:grid-cols-2 md:py-24">
          <div className="pointer-events-none absolute left-1/4 top-12 h-72 w-72 rounded-full bg-blue-600/15 blur-[120px]" />
          <div className="pointer-events-none absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-violet-600/15 blur-[120px]" />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative z-10"
          >
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.07] px-4 py-2 text-xs text-cyan-200 sm:text-sm">
              <Sparkles size={15} />
              Your engineering admission journey, simplified
            </div>

            <h1 className="max-w-2xl text-4xl font-semibold leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl">
              Your rank.
              <br />
              Your future.
              <br />
              <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                More possibilities.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-400 sm:text-lg">
              Discover engineering college options with historical AP and TG
              EAPCET cutoff data. Make your next decision with greater clarity.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                onClick={goToPredict}
                className="group flex items-center justify-center gap-3 rounded-xl bg-cyan-300 px-6 py-4 font-semibold text-slate-950 shadow-[0_0_35px_rgba(103,232,249,0.12)] transition hover:-translate-y-0.5 hover:bg-cyan-200"
              >
                Explore my options
                <ArrowRight
                  className="transition group-hover:translate-x-1"
                  size={18}
                />
              </button>

              <a
                href="#how-it-works"
                className="rounded-xl border border-white/10 px-6 py-4 text-center font-medium text-slate-300 transition hover:border-white/25 hover:bg-white/[0.04]"
              >
                How it works
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs text-slate-500 sm:text-sm">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-cyan-300" />
                AP EAPCET
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-cyan-300" />
                TG EAPCET
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-cyan-300" />
                Engineering
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="relative mx-auto flex min-h-[340px] w-full max-w-lg items-center justify-center sm:min-h-[440px]"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
              className="absolute h-72 w-72 rounded-full border border-cyan-300/20 sm:h-96 sm:w-96"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 36, repeat: Infinity, ease: 'linear' }}
              className="absolute h-56 w-56 rounded-full border border-violet-400/25 sm:h-72 sm:w-72"
            />
            <div className="absolute h-56 w-56 rounded-full bg-blue-500/20 blur-[65px] sm:h-72 sm:w-72" />

            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative z-10 flex h-48 w-48 flex-col items-center justify-center rounded-full border border-cyan-200/20 bg-gradient-to-br from-cyan-300/15 via-blue-500/10 to-violet-500/20 shadow-[inset_0_0_45px_rgba(103,232,249,0.08),0_0_100px_rgba(59,130,246,0.12)] backdrop-blur-xl sm:h-60 sm:w-60"
            >
              <GraduationCap size={56} strokeWidth={1.2} className="text-cyan-200" />
              <p className="mt-4 text-xs tracking-[0.25em] text-cyan-100/80">
                YOUR NEXT CHAPTER
              </p>
              <p className="mt-2 text-2xl font-semibold">Starts here.</p>
            </motion.div>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute right-0 top-12 rounded-2xl border border-white/10 bg-[#111a2d]/90 p-4 shadow-2xl backdrop-blur-xl sm:-right-2"
            >
              <p className="text-xs text-slate-400">Explore states</p>
              <p className="mt-2 text-sm font-semibold">
                AP <span className="text-slate-600">/</span> TG
              </p>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-12 left-0 rounded-2xl border border-white/10 bg-[#111a2d]/90 p-4 shadow-2xl backdrop-blur-xl sm:-left-2"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-violet-400/10 p-2 text-violet-300">
                  <BarChart3 size={21} />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Historical insights</p>
                  <p className="mt-1 text-sm font-semibold">Cutoff analysis</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        <section
          id="features"
          className="border-y border-white/[0.06] bg-white/[0.015]"
        >
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold tracking-[0.25em] text-cyan-300">
                BUILT FOR YOUR JOURNEY
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Clarity for your next move.
              </h2>
              <p className="mt-4 leading-7 text-slate-400">
                Useful admission insights, presented in a clear and accessible way.
              </p>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {features.map((feature, index) => {
                const Icon = feature.icon

                return (
                  <motion.article
                    key={feature.title}
                    initial={{ opacity: 0, y: 22 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: index * 0.12 }}
                    className="group rounded-2xl border border-white/[0.08] bg-[#0c1222]/80 p-7 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/25 hover:bg-[#10192b]"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-300/15 bg-cyan-300/[0.08] text-cyan-200 transition group-hover:border-cyan-300/30">
                      <Icon size={23} />
                    </div>
                    <h3 className="mt-6 text-lg font-semibold">{feature.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-400">
                      {feature.description}
                    </p>
                  </motion.article>
                )
              })}
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="mx-auto max-w-7xl px-5 py-20 sm:px-8"
        >
          <div className="grid gap-10 rounded-3xl border border-white/[0.08] bg-gradient-to-br from-blue-500/[0.08] via-[#0c1222] to-violet-500/[0.08] p-8 sm:p-12 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-xs font-semibold tracking-[0.25em] text-violet-300">
                SIMPLE. INFORMED. PERSONAL.
              </p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
                Turn your rank into a starting point.
              </h2>
              <p className="mt-5 leading-8 text-slate-400">
                Enter your EAPCET details, explore matching historical cutoffs,
                and compare engineering college options for your chosen state.
              </p>
              <button
                type="button"
                onClick={goToPredict}
                className="mt-7 inline-flex items-center gap-3 rounded-xl bg-cyan-300 px-6 py-4 font-semibold text-slate-950 transition hover:bg-cyan-200"
              >
                Start exploring <ArrowRight size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {[
                [
                  '01',
                  'Enter your details',
                  'Choose AP or TG, rank, category, gender and branch.',
                ],
                [
                  '02',
                  'Compare historical cutoffs',
                  'Review relevant records from the available dataset.',
                ],
                [
                  '03',
                  'Explore your options',
                  'Use the results as guidance, not an allotment guarantee.',
                ],
              ].map(([number, title, description]) => (
                <div
                  key={number}
                  className="flex gap-4 rounded-2xl border border-white/[0.07] bg-[#070b17]/60 p-5"
                >
                  <span className="font-mono text-sm text-cyan-300">{number}</span>
                  <div>
                    <h3 className="font-medium">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/[0.08]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-slate-500 sm:px-8 md:flex-row md:items-center md:justify-between">
          <p>© 2026 EAPCET.AI · College Discovery</p>
          <p>Historical cutoff insights · No seat allotment guarantee</p>
        </div>
      </footer>
    </div>
  )
}

export default App
