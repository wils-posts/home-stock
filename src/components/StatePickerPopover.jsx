import { STATE_LABELS, STATE_COLORS } from '../lib/constants'

const STATES = ['NEED', 'LOW', 'OK']

export default function StatePickerPopover({ current, onSelect, onClose }) {
  return (
    <>
      {/* Fullscreen overlay — absorbs the outside tap so it doesn't hit any other row */}
      <div
        className="fixed inset-0 z-10"
        onTouchStart={e => { e.stopPropagation(); onClose() }}
        onClick={onClose}
      />

      {/* Picker buttons — above the overlay */}
      <div className="relative z-20 flex items-center gap-2 py-1">
        {STATES.map(state => {
          const isCurrent = state === current
          return (
            <button
              key={state}
              onTouchEnd={e => { e.stopPropagation(); onSelect(state) }}
              onClick={e => { e.stopPropagation(); onSelect(state) }}
              className={`
                min-w-[48px] min-h-[40px] px-3 rounded-full text-sm font-semibold
                flex items-center justify-center shrink-0 transition-all duration-100
                ${isCurrent
                  ? `${STATE_COLORS[state]} ring-2 ring-offset-2 ring-slate-400 dark:ring-offset-slate-800`
                  : `${STATE_COLORS[state]} opacity-40 active:opacity-100`
                }
              `}
              aria-label={`Set state to ${STATE_LABELS[state]}`}
            >
              {STATE_LABELS[state]}
            </button>
          )
        })}
      </div>
    </>
  )
}
