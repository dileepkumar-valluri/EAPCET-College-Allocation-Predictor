import API_BASE from "./api";
import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import {
  ArrowLeft,
  ArrowRight,
  UserRound,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  LoaderCircle,
  LogOut,
  Atom,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

function MyProfile({ onBack, onLogout }) {
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_BASE}/profile`, {
          credentials: 'include',
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Unable to load profile.')
        }

        setStudent(data.student ?? data)
      } catch (err) {
        setError(err.message || 'Unable to load profile.')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const formatDate = (date) => {
    if (!date) return 'Not available'

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) {
      return 'Not available'
    }

    return parsedDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const details = [
    {
      label: 'Email Address',
      value: student?.email,
      icon: Mail,
    },
    {
      label: 'Mobile Number',
      value: student?.mobile,
      icon: Phone,
    },
    {
      label: 'Location',
      value: student?.location,
      icon: MapPin,
    },
    {
      label: 'Member Since',
      value: formatDate(student?.created_at),
      icon: CalendarDays,
    },
  ]

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#08070D] px-5 py-8 text-[#F5F3FF] sm:px-8 sm:py-12">
      <div className="pointer-events-none absolute -left-40 top-24 h-96 w-96 rounded-full bg-violet-600/10 blur-[130px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-fuchsia-600/[0.07] blur-[130px]" />

      <div className="relative mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white/65 transition hover:border-violet-300/30 hover:bg-white/[0.06] hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>

          <div className="flex items-center gap-2 text-xs text-white/35">
            <Atom size={16} className="text-violet-300" />
            EAPCET<span className="-ml-2 text-violet-300">.AI</span>
            <span className="mx-1 text-white/15">/</span>
            My Profile
          </div>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="overflow-hidden rounded-3xl border border-violet-200/15 bg-[#121019]/85 shadow-[0_25px_90px_rgba(0,0,0,0.35),0_0_50px_rgba(139,92,246,0.06)] backdrop-blur-2xl"
        >
          <div className="relative overflow-hidden border-b border-white/[0.08] bg-gradient-to-br from-violet-500/[0.12] via-transparent to-fuchsia-500/[0.05] px-6 py-9 sm:px-10 sm:py-12">
            <div className="pointer-events-none absolute -right-16 -top-28 h-72 w-72 rounded-full bg-violet-500/10 blur-[90px]" />

            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-violet-200/20 bg-gradient-to-br from-violet-300 to-violet-500 text-[#100D18] shadow-[0_0_40px_rgba(139,92,246,0.18)]">
                <UserRound size={36} strokeWidth={1.7} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-300/15 bg-violet-300/[0.06] px-3 py-1.5">
                  <Sparkles size={12} className="text-violet-200" />
                  <span className="text-[9px] font-semibold tracking-[0.18em] text-violet-200">
                    STUDENT ACCOUNT
                  </span>
                </div>

                <h1 className="break-words text-3xl font-medium tracking-[-0.055em] sm:text-4xl">
                  {loading
                    ? 'Loading profile...'
                    : student?.full_name || 'My Profile'}
                  <span className="text-violet-300">.</span>
                </h1>

                <p className="mt-2 text-sm leading-6 text-white/45">
                  Manage and view your registered account information.
                </p>
              </div>

              {!loading && !error && student && (
                <div className="flex items-center gap-2 self-start rounded-full border border-emerald-300/15 bg-emerald-300/[0.06] px-3 py-2 sm:self-center">
                  <ShieldCheck size={15} className="text-emerald-300" />
                  <span className="text-[10px] font-medium text-emerald-200">
                    Account loaded
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 sm:p-10">
            {loading ? (
              <div className="flex min-h-56 flex-col items-center justify-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-300/[0.07]">
                  <LoaderCircle
                    size={22}
                    className="animate-spin text-violet-300"
                  />
                </div>
                <p className="text-sm text-white/50">
                  Loading your account details...
                </p>
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-400/20 bg-red-400/[0.05] p-6">
                <p className="text-sm font-medium text-red-200">
                  Unable to load your profile
                </p>
                <p className="mt-2 text-sm leading-6 text-red-200/70">
                  {error}
                </p>
                <button
                  type="button"
                  onClick={onBack}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white/75 transition hover:bg-white/[0.05]"
                >
                  Back to Home
                  <ArrowRight size={15} />
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.2em] text-violet-300">
                      ACCOUNT OVERVIEW
                    </p>
                    <h2 className="mt-2 text-xl font-medium tracking-tight">
                      Personal information
                    </h2>
                  </div>
                  <p className="text-xs text-white/35">
                    Your registered details
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {details.map(({ label, value, icon: Icon }, index) => (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.35,
                        delay: index * 0.07,
                      }}
                      className="group min-w-0 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 transition duration-300 hover:border-violet-300/20 hover:bg-violet-300/[0.035]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-300/10 bg-violet-300/[0.07] text-violet-200 transition group-hover:bg-violet-300/[0.12]">
                          <Icon size={18} strokeWidth={1.7} />
                        </div>
                        <span className="text-xs text-white/45">
                          {label}
                        </span>
                      </div>

                      <p className="mt-5 break-words text-sm font-medium leading-6 text-white/90">
                        {value || 'Not provided'}
                      </p>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-7 flex items-start gap-3 rounded-2xl border border-violet-300/15 bg-violet-300/[0.045] p-5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-300/10 text-violet-200">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-violet-100">
                      Your information, in one place
                    </p>
                    <p className="mt-1.5 text-xs leading-6 text-white/45">
                      These details are retrieved from your registered
                      account. Your password is never displayed here.
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex flex-col justify-between gap-4 border-t border-white/[0.08] pt-6 sm:flex-row sm:items-center">
                  <p className="text-xs leading-5 text-white/35">
                    Need to leave your account? You can safely log out below.
                  </p>

                  <button
                    type="button"
                    onClick={onLogout}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-400/[0.04] px-5 py-3 text-sm font-semibold text-red-300 transition hover:border-red-400/35 hover:bg-red-400/[0.09]"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.section>

        <p className="mt-6 text-center text-[10px] leading-5 text-white/25">
          EAPCET · Historical cutoff insights only. Actual seat allotment
          follows official counselling rules.
        </p>
      </div>
    </main>
  )
}

export default MyProfile
