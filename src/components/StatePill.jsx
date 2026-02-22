import { STATE_LABELS, STATE_COLORS } from '../lib/constants'

export default function StatePill({ state, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        min-w-[48px] min-h-[48px] rounded-full px-3 font-semibold text-sm
        flex items-center justify-center shrink-0
        transition-opacity duration-150
        ${STATE_COLORS[state] ?? 'bg-slate-400 text-white'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}
      `}
    >
      {STATE_LABELS[state] ?? state}
    </button>
  )
}
