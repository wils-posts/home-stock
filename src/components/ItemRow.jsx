import { useRef, useState } from 'react'
import StatePill from './StatePill'
import PinButton from './PinButton'

export default function ItemRow({ item, onCycleState, onTogglePin, onDelete, pending, compact }) {
  const [swipeX, setSwipeX] = useState(0)
  const [swiping, setSwiping] = useState(false)
  const touchStartX = useRef(null)
  const DELETE_THRESHOLD = 72

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX
    setSwiping(true)
  }

  function handleTouchMove(e) {
    if (touchStartX.current === null) return
    const delta = e.touches[0].clientX - touchStartX.current
    setSwipeX(Math.max(-DELETE_THRESHOLD, Math.min(0, delta)))
  }

  function handleTouchEnd() {
    setSwiping(false)
    if (swipeX <= -DELETE_THRESHOLD / 2) {
      setSwipeX(-DELETE_THRESHOLD) // snap open
    } else {
      setSwipeX(0) // snap closed
    }
    touchStartX.current = null
  }

  function handleDelete() {
    setSwipeX(0)
    onDelete(item.id)
  }

  function handleRowTap() {
    if (swipeX !== 0) setSwipeX(0)
  }

  const py = compact ? 'py-1' : 'py-2'
  const gap = compact ? 'gap-2' : 'gap-3'
  const nameSize = compact ? 'text-sm' : 'text-base'
  const noteSize = compact ? 'text-xs' : 'text-sm'

  return (
    <div className="relative overflow-hidden border-b border-slate-100 dark:border-slate-700 last:border-b-0">
      {/* Delete button revealed on swipe */}
      <div className="absolute right-0 top-0 bottom-0 w-[72px] flex items-center justify-center bg-need">
        <button
          onClick={handleDelete}
          className="w-full h-full flex items-center justify-center"
          aria-label="Delete item"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-5 h-5">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4h6v2" />
          </svg>
        </button>
      </div>

      {/* Row content — slides left on swipe */}
      <div
        className={`relative flex items-center ${gap} px-4 ${py} bg-white dark:bg-slate-800`}
        style={{
          transform: `translateX(${swipeX}px)`,
          transition: swiping ? 'none' : 'transform 0.2s ease',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleRowTap}
      >
        <StatePill
          state={item.state}
          onClick={() => { if (swipeX === 0) onCycleState(item.id) }}
          disabled={pending}
          compact={compact}
        />
        <div className="flex-1 min-w-0">
          <p className={`font-medium text-slate-800 dark:text-slate-100 truncate ${nameSize}`}>{item.name}</p>
          {item.note && (
            <p className={`text-slate-500 dark:text-slate-400 truncate ${noteSize}`}>{item.note}</p>
          )}
        </div>
        <PinButton pinned={item.pinned} onClick={() => { if (swipeX === 0) onTogglePin(item.id) }} />
      </div>
    </div>
  )
}
