import { useEffect, useRef } from 'react'
import { STATE_LABELS, STATE_COLORS } from '../lib/constants'

const STATES = ['NEED', 'LOW', 'OK']

export default function StatePickerPopover({ current, onSelect, onClose }) {
  const ref = useRef(null)

  // Close on tap outside
  useEffect(() => {
    function handleTouch(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose()
      }
    }
    // Slight delay so the opening tap doesn't immediately close it
    const id = setTimeout(() => {
      document.addEventListener('touchstart', handleTouch)
      document.addEventListener('mousedown', handleTouch)
    }, 50)
    return () => {
      clearTimeout(id)
      document.removeEventListener('touchstart', handleTouch)
      document.removeEventListener('mousedown', handleTouch)
    }
  }, [onClose])

  return (
    <div
      ref={ref}
      className="flex items-center gap-2 py-1"
    >
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
  )
}
