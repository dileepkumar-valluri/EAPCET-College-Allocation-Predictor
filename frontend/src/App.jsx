import API_BASE from "./api";
import { useEffect, useState } from 'react'
import Prediction from './Prediction.jsx'
import PredictionHistory from './PredictionHistory.jsx'
import Auth from './Auth.jsx'
import MyProfile from './MyProfile.jsx'
import AIAssistant from './AIAssistant.jsx'
import { motion } from 'motion/react'
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Check,
  ChevronRight,
  Command,
  Compass,
  GraduationCap,
  Layers3,
  Menu,
  ShieldCheck,
  Sparkles,
  Target,
  X,
} from 'lucide-react'

const features = [
  {
    number: '01',
    icon: Target,
    title: 'Rank-first discovery',
    description:
      'Start with your EAPCET rank. Explore colleges and branches whose historical cutoffs match your profile.',
    tag: 'PERSONALIZED',
  },
  {
    number: '02',
    icon: BarChart3,
    title: 'Cutoffs, with context',
    description:
      'Compare your rank against available historical admission records instead of relying on guesswork.',
    tag: 'DATA-DRIVEN',
  },
  {
    number: '03',
    icon: Layers3,
    title: 'Explore every phase',
    description:
      'Review available first, second and final phase cutoff records for Telangana EAPCET.',
    tag: 'PHASE INSIGHTS',
  },
]

const steps = [
  {
    number: '01',
    title: 'Tell us your rank',
    description:
      'Choose your state, category, gender and preferred engineering branch.',
  },
  {
    number: '02',
    title: 'Find relevant colleges',
    description:
      'Compare matching historical cutoffs with your rank and preferences.',
  },
  {
    number: '03',
    title: 'Make an informed shortlist',
    description:
      'Explore the available results and use them to guide your next steps.',
  },
]

function App() {
  const [showPrediction, setShowPrediction] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [student, setStudent] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  
useEffect(() => {
  const restoreSession = async () => {
    try {
      const response = await fetch(`${API_BASE}/profile`, {
        credentials: 'include',
      })

      if (!response.ok) {
        setStudent(null)
        return
      }

      const data = await response.json()
      setStudent(data.student ?? data)
    } catch (error) {
      console.error('Session restore error:', error)
    }
  }

  restoreSession()
}, [])

  const goToPredict = () => {
    setMenuOpen(false)
    setShowPrediction(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToSection = (sectionId) => {
    setMenuOpen(false)

    window.requestAnimationFrame(() => {
      const section = document.getElementById(sectionId)
      if (!section) return

      const navbar = document.querySelector('header')
      const navbarHeight = navbar?.getBoundingClientRect().height ?? 80
      const targetPosition =
        section.getBoundingClientRect().top +
        window.scrollY -
        navbarHeight -
        16

      window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: 'smooth',
      })
    })
  }

  const goHome = () => {
    setMenuOpen(false)
    setShowPrediction(false)
    setShowProfile(false)
    setShowHistory(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_BASE}/logout`, {
        method: 'POST',
        credentials: 'include',
      })

      if (!response.ok) throw new Error('Logout failed')

      setStudent(null)
      setShowHistory(false)
      setShowPrediction(false)
      setShowProfile(false)
      setShowAuth(false)
      setMenuOpen(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      console.error('Logout error:', error)
      alert('Logout failed. Please try again.')
    }
  }
  if (showAuth) {
    return (
      <>
        <Auth
          onBack={() => setShowAuth(false)}
          onLoginSuccess={(studentData) => {
            setStudent(studentData)
            setShowAuth(false)
            setShowProfile(true)
          }}
        />
        <AIAssistant />
      </>
    )
  }
  if (showProfile) {
    return (
      <>
        <MyProfile
          onBack={() => {
            setShowProfile(false)
            setMenuOpen(false)
          }}
          onLogout={handleLogout}
        />
        <AIAssistant />
      </>
    )
  }

  if (showHistory) {
    return (
      <>
        <PredictionHistory onBack={() => setShowHistory(false)} />
        <AIAssistant />
      </>
    )
  }
  if (showPrediction) {
    return (
      <>
        <Prediction onBack={goHome} student={student} onRequireLogin={() => setShowAuth(true)} />
        <AIAssistant />
      </>
    )
  }

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#08070D] text-[#F5F3FF] selection:bg-violet-400/30 selection:text-white">
      {/* Navigation */}
      <header className="sticky top-0 z-30 border-b border-violet-200/[0.10] bg-[#08070D]/80 shadow-[0_8px_35px_rgba(0,0,0,0.22)] backdrop-blur-2xl">
        <nav className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
          <button
            type="button"
            onClick={goHome}
            className="group flex items-center gap-3 text-left"
            aria-label="EAPCET home"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#DDD0FF] via-[#A78BFA] to-[#8B5CF6] text-[#100B1B] shadow-[0_0_28px_rgba(139,92,246,0.28)] transition-all duration-300 group-hover:rotate-[-8deg] group-hover:shadow-[0_0_38px_rgba(139,92,246,0.42)]">
              <GraduationCap size={23} strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-[17px] font-bold tracking-[-0.06em]">
                EAPCET
              </p>
              <p className="mt-0.5 text-[9px] font-medium tracking-[0.22em] text-white/40">
                ADMISSION INTELLIGENCE
              </p>
            </div>
          </button>

          <div className="hidden items-center gap-8 md:flex">
            <button type="button" onClick={() => scrollToSection('platform')} className="text-[13px] text-white/55 transition hover:text-white">
              Platform
            </button>
            <button type="button" onClick={() => scrollToSection('method')} className="text-[13px] text-white/55 transition hover:text-white">
              How it works
            </button>
            <button type="button" onClick={() => scrollToSection('about-data')} className="text-[13px] text-white/55 transition hover:text-white">
              Our approach
            </button>
            <button
              type="button"
              onClick={goToPredict}
              className="group flex items-center gap-2 rounded-lg border border-violet-200/30 bg-gradient-to-r from-[#C4B5FD] to-[#8B5CF6] px-4 py-2.5 text-[13px] font-semibold text-[#100B1B] shadow-[0_4px_20px_rgba(139,92,246,0.16)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(139,92,246,0.30)]"
            >
              Find my colleges
              <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false)
                if (student) {
                  setShowProfile(true)
                } else {
                  setShowAuth(true)
                }
              }}
              className="rounded-lg border border-white/10 px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-white/5"
            >
              {student ? 'My Profile' : 'Login / Register'}
            </button>
            {student && (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-red-400/20 px-4 py-2.5 text-[13px] font-semibold text-red-300 transition hover:bg-red-400/10"
              >
                Logout
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false)
                if (student) {
                  setShowHistory(true)
                } else {
                  setShowAuth(true)
                }
              }}
              className="rounded-lg border border-white/10 px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-white/5"
            >
              Prediction History
            </button>
          </div>

          <button
            type="button"
            className="rounded-lg border border-white/10 p-2 text-white md:hidden"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((previous) => !previous)}
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </nav>

        {menuOpen && (
          <div className="space-y-4 border-t border-white/10 bg-[#121019] px-5 py-5 md:hidden">
            <button type="button" onClick={() => scrollToSection('platform')} className="block py-1 text-left text-sm text-white/70 transition hover:text-white">
              Platform
            </button>
            <button type="button" onClick={() => scrollToSection('method')} className="block py-1 text-left text-sm text-white/70 transition hover:text-white">
              How it works
            </button>
            <button type="button" onClick={() => scrollToSection('about-data')} className="block py-1 text-left text-sm text-white/70 transition hover:text-white">
              Our approach
            </button>
            <button
              type="button"
              onClick={goToPredict}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-violet-200/30 bg-gradient-to-r from-[#C4B5FD] to-[#8B5CF6] px-5 py-3 text-sm font-semibold text-[#100B1B] shadow-[0_4px_20px_rgba(139,92,246,0.16)]"
            >
              Find my colleges <ArrowRight size={16} />
            </button>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false)
                if (student) {
                  setShowProfile(true)
                } else {
                  setShowAuth(true)
                }
              }}
              className="flex w-full items-center justify-center rounded-lg border border-white/10 px-5 py-3 text-sm font-semibold text-white"
            >
              {student ? 'My Profile' : 'Login / Register'}
            </button>
            {student && (
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center justify-center rounded-lg border border-red-400/20 px-5 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-400/10"
              >
                Logout
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false)
                if (student) {
                  setShowHistory(true)
                } else {
                  setShowAuth(true)
                }
              }}
              className="flex w-full items-center justify-center rounded-lg border border-white/10 px-5 py-3 text-sm font-semibold text-white"
            >
              Prediction History
            </button>
          </div>
        )}
      </header>

      <main>
        {/* Hero */}
        <section className="relative mx-auto max-w-[1440px] px-5 pb-8 pt-3 sm:px-8 sm:pt-5 lg:px-12 lg:pb-10 lg:pt-6">
          <div className="pointer-events-none absolute right-[-150px] top-20 h-[420px] w-[420px] rounded-full bg-violet-600/[0.10] blur-[130px]" />
          <div className="pointer-events-none absolute left-[-180px] top-[360px] h-[340px] w-[340px] rounded-full bg-fuchsia-500/[0.07] blur-[130px]" />

          <div className="relative grid items-start gap-8 lg:grid-cols-[1.04fr_0.96fr] lg:gap-10">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65 }}
            >
              <div className="mb-4 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.035] px-3.5 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#A78BFA] shadow-[0_0_12px_#A78BFA]" />
                <span className="text-[10px] font-medium tracking-[0.14em] text-white/65 sm:text-[11px]">
                  ENGINEERING ADMISSION, REIMAGINED
                </span>
              </div>

              <h1 className="max-w-[720px] text-[clamp(2.8rem,5.7vw,5.3rem)] font-medium leading-[0.92] tracking-[-0.075em]">
                Your rank is a
                <br />
                starting point<span className="text-[#A78BFA]">.</span>
                <br />
                <span className="font-serif font-normal italic text-white/45">
                  Not a limitation.
                </span>
              </h1>

              <p className="mt-4 max-w-[490px] text-[14px] leading-6 text-white/55 sm:text-[15px] sm:leading-7">
                Discover engineering college options through historical AP and
                TG EAPCET cutoff data. Understand your possibilities before
                deciding your next move.
              </p>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={goToPredict}
                  className="group flex items-center justify-center gap-3 rounded-lg border border-violet-200/30 bg-gradient-to-r from-[#C4B5FD] to-[#8B5CF6] px-6 py-4 text-sm font-semibold text-[#100B1B] shadow-[0_6px_24px_rgba(139,92,246,0.18)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_34px_rgba(139,92,246,0.32)]"
                >
                  Explore my options
                  <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
                </button>
                <a
                  href="#platform"
                  className="flex items-center justify-center gap-2 rounded-lg border border-white/10 px-6 py-4 text-sm font-medium text-white/75 transition hover:border-white/25 hover:bg-white/[0.035]"
                >
                  Discover the platform
                  <ArrowDownRight size={16} />
                </a>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 text-[11px] text-white/45 sm:text-xs">
                <span className="flex items-center gap-2">
                  <Check size={14} className="text-[#A78BFA]" /> Andhra Pradesh
                </span>
                <span className="h-3 w-px bg-white/15" />
                <span className="flex items-center gap-2">
                  <Check size={14} className="text-[#A78BFA]" /> Telangana
                </span>
                <span className="h-3 w-px bg-white/15" />
                <span className="flex items-center gap-2">
                  <Check size={14} className="text-[#A78BFA]" /> Engineering
                </span>
              </div>
            </motion.div>

            {/* Editorial product preview */}
            <motion.div
              initial={{ opacity: 0, y: 25, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.75, delay: 0.12 }}
              className="relative mx-auto w-full max-w-[570px] lg:ml-auto lg:scale-[0.94] lg:origin-top-right"
            >
              <div className="absolute -inset-5 rounded-[30px] bg-gradient-to-br from-violet-400/[0.08] via-transparent to-fuchsia-500/[0.06] blur-2xl" />

              <div className="relative overflow-hidden rounded-2xl border border-violet-300/20 bg-gradient-to-br from-[#191426]/95 via-[#121019]/90 to-[#0E0B14]/95 shadow-[0_25px_100px_rgba(0,0,0,0.5),0_0_55px_rgba(139,92,246,0.13)] backdrop-blur-2xl transition duration-500 hover:border-violet-300/35 hover:shadow-[0_25px_100px_rgba(0,0,0,0.5),0_0_65px_rgba(139,92,246,0.19)]">
                <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#A78BFA]/15 text-[#C4B5FD]">
                      <Command size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white/90">College discovery</p>
                      <p className="mt-0.5 text-[10px] text-white/40">YOUR WORKSPACE</p>
                    </div>
                  </div>
                  <span className="rounded-full border border-emerald-300/15 bg-emerald-300/[0.07] px-2.5 py-1 text-[9px] font-medium text-emerald-200">
                    HISTORICAL DATA
                  </span>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-4">
                      <p className="text-[10px] tracking-wide text-white/45">EXAM REGION</p>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-400/10 text-[10px] font-bold text-blue-200">AP</span>
                        <span className="text-sm font-semibold">Andhra Pradesh</span>
                      </div>
                    </div>
                    <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-4">
                      <p className="text-[10px] tracking-wide text-white/45">PREDICTION BASIS</p>
                      <div className="mt-3 flex items-center gap-2">
                        <BarChart3 size={17} className="text-[#A78BFA]" />
                        <span className="text-sm font-semibold">Past cutoffs</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex items-end justify-between">
                    <div>
                      <p className="text-[10px] tracking-[0.15em] text-white/40">YOUR NEXT STEP</p>
                      <h2 className="mt-2 text-xl font-medium tracking-tight sm:text-2xl">
                        Find your fit<span className="text-[#A78BFA]">.</span>
                      </h2>
                    </div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/55">
                      <Compass size={17} />
                    </div>
                  </div>

                  <div className="mt-4 space-y-2.5">
                    {[
                      {
                        icon: Target,
                        title: 'Rank-based matching',
                        detail: 'Explore relevant college options',
                        color: 'text-[#C4B5FD]',
                        bg: 'bg-[#A78BFA]/10',
                      },
                      {
                        icon: BarChart3,
                        title: 'Cutoff comparisons',
                        detail: 'Review historical closing ranks',
                        color: 'text-blue-200',
                        bg: 'bg-blue-300/10',
                      },
                      {
                        icon: GraduationCap,
                        title: 'College exploration',
                        detail: 'Compare available branches',
                        color: 'text-emerald-200',
                        bg: 'bg-emerald-300/10',
                      },
                    ].map((item, index) => {
                      const Icon = item.icon
                      return (
                        <motion.div
                          key={item.title}
                          initial={{ opacity: 0, x: 12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.45, delay: 0.35 + index * 0.12 }}
                          className="flex items-center gap-3.5 rounded-xl border border-white/[0.07] bg-white/[0.018] p-3.5 transition hover:border-white/[0.15] hover:bg-white/[0.035]"
                        >
                          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.bg} ${item.color}`}>
                            <Icon size={19} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[13px] font-semibold text-white/90">{item.title}</p>
                            <p className="mt-1 text-[11px] text-white/45">{item.detail}</p>
                          </div>
                          <ChevronRight size={16} className="text-white/25" />
                        </motion.div>
                      )
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={goToPredict}
                    className="mt-4 flex w-full items-center justify-between rounded-xl bg-[#A78BFA] px-4 py-3 text-sm font-semibold text-[#111019] transition hover:bg-[#C4B5FD]"
                  >
                    Open college predictor
                    <ArrowUpRight size={17} />
                  </button>
                  <p className="mt-3 text-center text-[10px] leading-5 text-white/35">
                    Preview only · Actual results depend on available historical records
                  </p>
                </div>
              </div>

              <div className="pointer-events-none absolute -bottom-5 -left-4 hidden items-center gap-2 rounded-xl border border-white/10 bg-[#15151d] px-4 py-3 shadow-2xl sm:flex">
                <Sparkles size={16} className="text-[#A78BFA]" />
                <span className="text-[11px] font-medium text-white/75">Make your next move informed.</span>
              </div>
            </motion.div>
          </div>

          <div className="relative mt-8 grid grid-cols-2 border-y border-violet-200/[0.12] bg-gradient-to-r from-transparent via-violet-500/[0.025] to-transparent py-4 sm:mt-10 sm:grid-cols-4">
            {[
              ['02', 'EAPCET regions'],
              ['2025', 'Historical dataset year'],
              ['01', 'Rank-led experience'],
              ['∞', 'Options to explore'],
            ].map(([value, label], index) => (
              <div
                key={label}
                className={`px-3 py-3 sm:px-6 ${index > 1 ? 'border-t border-white/[0.08] sm:border-t-0' : ''} ${index % 2 === 1 ? 'border-l border-white/[0.08] sm:border-l' : ''} ${index === 2 ? 'sm:border-l' : ''}`}
              >
                <p className="text-2xl font-medium tracking-[-0.06em] sm:text-3xl">{value}</p>
                <p className="mt-1.5 text-[10px] text-white/40 sm:text-xs">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Platform features */}
        <section id="platform" className="scroll-mt-24 border-y border-white/[0.07] bg-[#0D0B14]">
          <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div>
                <p className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.22em] text-[#A78BFA]">
                  <span className="h-px w-6 bg-[#A78BFA]" /> THE PLATFORM
                </p>
                <h2 className="mt-5 max-w-xl text-4xl font-medium leading-[1.08] tracking-[-0.06em] sm:text-5xl">
                  Less guesswork.
                  <br />
                  <span className="font-serif italic text-white/40">More perspective.</span>
                </h2>
              </div>
              <p className="max-w-lg text-sm leading-7 text-white/50 lg:ml-auto lg:text-base">
                College choices deserve more than scattered information. Explore
                available cutoff records in one focused experience built around
                your rank and preferences.
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <motion.article
                    key={feature.number}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.45, delay: index * 0.1 }}
                    className="group relative overflow-hidden rounded-2xl border border-violet-200/15 bg-gradient-to-br from-[#1B1527]/90 via-[#17121F]/80 to-[#100D18]/90 p-6 shadow-[0_12px_35px_rgba(0,0,0,0.22)] backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-violet-300/40 hover:shadow-[0_16px_48px_rgba(139,92,246,0.16)] sm:p-7"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#A78BFA]/15 bg-[#A78BFA]/[0.07] text-[#C4B5FD]">
                        <Icon size={21} strokeWidth={1.7} />
                      </div>
                      <span className="font-mono text-xs text-white/25">{feature.number}</span>
                    </div>
                    <p className="mt-7 text-[9px] font-semibold tracking-[0.18em] text-[#A78BFA]/80">
                      {feature.tag}
                    </p>
                    <h3 className="mt-2 text-xl font-medium tracking-tight">{feature.title}</h3>
                    <p className="mt-3 text-[13px] leading-6 text-white/50">
                      {feature.description}
                    </p>
                    <div className="mt-7 flex items-center justify-between border-t border-white/[0.08] pt-4">
                      <span className="text-[10px] text-white/35">Explore the possibilities</span>
                      <ArrowUpRight size={16} className="text-white/40 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#A78BFA]" />
                    </div>
                  </motion.article>
                )
              })}
            </div>
          </div>
        </section>

        {/* Method */}
        <section id="method" className="scroll-mt-24 mx-auto max-w-[1440px] px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <p className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.22em] text-[#A78BFA]">
                <span className="h-px w-6 bg-[#A78BFA]" /> A SIMPLE PROCESS
              </p>
              <h2 className="mt-5 text-4xl font-medium leading-[1.08] tracking-[-0.06em] sm:text-5xl">
                Three steps.
                <br />
                <span className="font-serif italic text-white/40">A clearer direction.</span>
              </h2>
              <p className="mt-6 max-w-md text-sm leading-7 text-white/50">
                A straightforward way to begin exploring engineering colleges.
                You remain in control of the choices you make.
              </p>
              <button
                type="button"
                onClick={goToPredict}
                className="mt-8 group inline-flex items-center gap-3 rounded-lg border border-[#A78BFA]/35 px-5 py-3.5 text-sm font-medium text-[#DDD0FF] transition hover:bg-[#A78BFA]/10"
              >
                Start your search
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            <div className="border-t border-white/[0.1]">
              {steps.map((step) => (
                <div key={step.number} className="grid gap-4 border-b border-white/[0.1] py-6 sm:grid-cols-[70px_1fr] sm:gap-6 sm:py-8">
                  <p className="font-mono text-sm text-[#A78BFA]">{step.number}</p>
                  <div>
                    <h3 className="text-lg font-medium tracking-tight sm:text-xl">{step.title}</h3>
                    <p className="mt-2 max-w-lg text-sm leading-6 text-white/45">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Data transparency */}
        <section id="about-data" className="scroll-mt-24 mx-auto max-w-[1440px] px-5 pb-12 sm:px-8 sm:pb-16 lg:px-12 lg:pb-20">
          <div className="relative overflow-hidden rounded-2xl border border-violet-200/15 bg-[#17121F]/80 p-7 shadow-[0_18px_55px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:p-10 lg:p-14">
            <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-violet-500/[0.10] blur-[100px]" />
            <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="max-w-2xl">
                <p className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.2em] text-[#A78BFA]">
                  <ShieldCheck size={15} /> TRANSPARENT BY DESIGN
                </p>
                <h2 className="mt-5 text-3xl font-medium leading-tight tracking-[-0.05em] sm:text-4xl">
                  Insights you can understand.
                  <br />
                  <span className="font-serif italic text-white/40">Decisions you own.</span>
                </h2>
                <p className="mt-5 max-w-xl text-sm leading-7 text-white/50">
                  Results are based on historical cutoff records available in the
                  platform. Actual seat allotment depends on official counselling
                  rules, seat availability, reservation and other factors.
                </p>
              </div>
              <button
                type="button"
                onClick={goToPredict}
                className="group flex items-center justify-center gap-3 rounded-lg bg-[#f1eff8] px-6 py-4 text-sm font-semibold text-[#14121c] transition hover:bg-white"
              >
                Explore college options
                <ArrowUpRight size={17} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </div>
        </section>
      </main>

     
{/* Footer */}
<footer className="border-t border-violet-200/[0.10] bg-[#07060B]/95">
  <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-5 px-5 py-8 pr-28 sm:px-8 sm:pr-36 lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-10 lg:px-12 lg:pr-40">
    <button
      type="button"
      onClick={goHome}
      className="flex items-center gap-3 self-start text-left"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#A78BFA] text-[#111019]">
        <GraduationCap size={20} />
      </div>
      <div>
        <p className="text-sm font-bold tracking-[-0.05em]">
          EAPCET
        </p>
        <p className="mt-0.5 text-[9px] tracking-[0.16em] text-white/35">
          ADMISSION INTELLIGENCE
        </p>
      </div>
    </button>

    <p className="text-xs leading-6 text-white/35 lg:justify-self-center">
      Historical cutoff insights only. No seat allotment guarantee.
    </p>

    <p className="text-xs text-white/30 lg:justify-self-start">
      © 2026 EAPCET
    </p>
  </div>
</footer>

      <AIAssistant />
    </div>
  )
}

export default App