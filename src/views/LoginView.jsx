import { useState } from 'react'
import { ERRORS } from '../lib/constants'

export default function LoginView({ auth }) {
  const [step, setStep] = useState('email') // 'email' | 'otp'
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSendOtp(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await auth.sendOtp(email.trim())
      setStep('otp')
    } catch {
      setError(ERRORS.OTP_SEND)
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifyOtp(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await auth.verifyOtp(email.trim(), otp.trim())
      // App.jsx picks up the session change via useAuth
    } catch {
      setError(ERRORS.OTP_VERIFY)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Home Stock</h1>
      <p className="text-slate-500 text-sm mb-8">Sign in to your household</p>

      {step === 'email' ? (
        <form onSubmit={handleSendOtp} className="w-full max-w-sm flex flex-col gap-3">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email address"
            required
            autoFocus
            inputMode="email"
            className="h-12 px-4 rounded-xl border border-slate-300 text-slate-800 text-base focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
          {error && <p className="text-need text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="h-12 bg-slate-800 text-white rounded-xl font-semibold text-base disabled:opacity-50 active:scale-95 transition-transform"
          >
            {loading ? 'Sending…' : 'Send code'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="w-full max-w-sm flex flex-col gap-3">
          <p className="text-slate-600 text-sm text-center">
            Enter the 6-digit code sent to <strong>{email}</strong>
          </p>
          <input
            type="text"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            placeholder="000000"
            required
            autoFocus
            inputMode="numeric"
            maxLength={6}
            className="h-12 px-4 rounded-xl border border-slate-300 text-slate-800 text-xl text-center tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
          {error && <p className="text-need text-sm text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading || otp.trim().length < 6}
            className="h-12 bg-slate-800 text-white rounded-xl font-semibold text-base disabled:opacity-50 active:scale-95 transition-transform"
          >
            {loading ? 'Verifying…' : 'Verify'}
          </button>
          <button
            type="button"
            onClick={() => { setStep('email'); setOtp(''); setError('') }}
            className="text-slate-500 text-sm underline"
          >
            Use a different email
          </button>
        </form>
      )}
    </div>
  )
}
