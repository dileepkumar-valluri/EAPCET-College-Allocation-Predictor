
import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  UserRound,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  LoaderCircle,
  LogOut,
} from 'lucide-react'

function MyProfile({ onBack, onLogout }) {
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile', {
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
    <div className="min-h-screen bg-[#08090d] px-5 py-8 text-[#f4f3ef] sm:px-8">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={onBack}
          className="mb-8 inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-sm text-white/75 transition hover:bg-white/5"
        >
          <ArrowLeft size={17} />
          Back to Home
        </button>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#101117]">
          <div className="border-b border-white/10 bg-gradient-to-r from-[#b7a5ff]/10 to-transparent px-6 py-8 sm:px-9">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#b7a5ff] text-[#111019]">
                <UserRound size={32} />
              </div>

              <div className="min-w-0">
                <p className="text-xs tracking-[0.18em] text-[#b7a5ff]">
                  STUDENT ACCOUNT
                </p>
                <h1 className="mt-2 break-words text-2xl font-semibold sm:text-3xl">
                  {loading ? 'Loading profile...' : student?.full_name || 'My Profile'}
                </h1>
                <p className="mt-1 text-sm text-white/45">
                  Your registered account details
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-9">
            {loading ? (
              <div className="flex items-center justify-center gap-3 py-12 text-white/60">
                <LoaderCircle className="animate-spin" size={20} />
                Loading your details...
              </div>
            ) : error ? (
              <div className="rounded-xl border border-red-400/20 bg-red-400/5 p-5">
                <p className="text-sm text-red-300">{error}</p>
                <button
                  type="button"
                  onClick={onBack}
                  className="mt-4 rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
                >
                  Back to Home
                </button>
              </div>
            ) : (
              <>
                <h2 className="mb-5 text-sm font-semibold text-white/80">
                  Personal Information
                </h2>

                <div className="grid gap-4 sm:grid-cols-2">
                  {details.map(({ label, value, icon: Icon }) => (
                    <div
                      key={label}
                      className="min-w-0 rounded-xl border border-white/[0.08] bg-white/[0.025] p-4"
                    >
                      <div className="flex items-center gap-2 text-white/45">
                        <Icon size={16} />
                        <span className="text-xs">{label}</span>
                      </div>

                      <p className="mt-3 break-words text-sm font-medium text-white/90">
                        {value || 'Not provided'}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-xl border border-[#b7a5ff]/15 bg-[#b7a5ff]/5 p-4">
                  <p className="text-sm font-medium text-[#d5cbff]">
                    Your account is ready
                  </p>
                  <p className="mt-1 text-xs leading-5 text-white/50">
                    These details are retrieved from your registered account.
                    Your password is never displayed here.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onLogout}
                  className="mt-6 inline-flex items-center gap-2 rounded-lg border border-red-400/20 px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-400/10"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyProfile
