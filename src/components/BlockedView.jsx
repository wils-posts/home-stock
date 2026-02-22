import { ERRORS } from '../lib/constants'

export default function BlockedView({ signOut }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center bg-white dark:bg-slate-900">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-12 h-12 text-slate-400 mb-4">
        <circle cx="12" cy="12" r="10" />
        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
      </svg>
      <p className="text-slate-700 dark:text-slate-300 font-medium mb-2">Access denied</p>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">{ERRORS.NOT_ALLOWLISTED}</p>
      <button
        onClick={signOut}
        className="px-6 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-medium active:scale-95 transition-transform"
      >
        Sign out
      </button>
    </div>
  )
}
