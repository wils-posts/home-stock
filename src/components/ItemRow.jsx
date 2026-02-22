import { useRef, useState, useEffect } from 'react'
import StatePill from './StatePill'
import PinButton from './PinButton'

export default function ItemRow({
  item, onCycleState, onTogglePin, onDelete, onUpdate,
  onMoveUp, onMoveDown, isFirst, isLast,
  pending, compact,
}) {
  const [swipeX, setSwipeX] = useState(0)
  const [swiping, setSwiping] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(item.name)
  const [editNote, setEditNote] = useState(item.note ?? '')
  const touchStartX = useRef(null)
  const touchStartY = useRef(null)
  const touchStartTime = useRef(null)
  const nameInputRef = useRef(null)
  const DELETE_THRESHOLD = 72
  const LONGPRESS_MS = 500

  // Auto-focus name input when entering edit mode
  useEffect(() => {
    if (editing && nameInputRef.current) {
      nameInputRef.current.focus()
    }
  }, [editing])

  // Keep edit state in sync if item updates externally
  useEffect(() => {
    if (!editing) {
      setEditName(item.name)
      setEditNote(item.note ?? '')
    }
  }, [item.name, item.note, editing])

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
    touchStartTime.current = Date.now()
    setSwiping(true)
  }

  function handleTouchMove(e) {
    if (touchStartX.current === null || editing) return
    const delta = e.touches[0].clientX - touchStartX.current
    setSwipeX(Math.max(-DELETE_THRESHOLD, Math.min(0, delta)))
  }

  function handleTouchEnd() {
    setSwiping(false)
    const elapsed = Date.now() - (touchStartTime.current ?? 0)
    const deltaX = Math.abs((touchStartX.current ?? 0) - (touchStartX.current ?? 0))

    // Long-press: held ≥ 500ms with minimal movement
    if (elapsed >= LONGPRESS_MS && swipeX === 0 && !editing) {
      setEditing(true)
      touchStartX.current = null
      return
    }

    // Swipe snap
    if (swipeX <= -DELETE_THRESHOLD / 2) {
      setSwipeX(-DELETE_THRESHOLD)
    } else {
      setSwipeX(0)
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

  function handleConfirmEdit() {
    const name = editName.trim()
    if (!name) return
    onUpdate(item.id, { name, note: editNote.trim() || null })
    setEditing(false)
  }

  function handleCancelEdit() {
    setEditName(item.name)
    setEditNote(item.note ?? '')
    setEditing(false)
  }

  const py = compact ? 'py-1' : 'py-2'
  const gap = compact ? 'gap-2' : 'gap-3'
  const nameSize = compact ? 'text-sm' : 'text-base'
  const noteSize = compact ? 'text-xs' : 'text-sm'
  const showReorder = onMoveUp !== undefined || onMoveDown !== undefined

  return (
    <div className="relative overflow-hidden border-b border-slate-100 dark:border-slate-700 last:border-b-0">
      {/* Delete button revealed on swipe */}
      {!editing && (
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
      )}

      {/* Row content */}
      <div
        className={`relative flex items-center ${gap} px-4 ${py} bg-white dark:bg-slate-800`}
        style={{
          transform: editing ? 'none' : `translateX(${swipeX}px)`,
          transition: swiping ? 'none' : 'transform 0.2s ease',
        }}
        onTouchStart={editing ? undefined : handleTouchStart}
        onTouchMove={editing ? undefined : handleTouchMove}
        onTouchEnd={editing ? undefined : handleTouchEnd}
        onClick={editing ? undefined : handleRowTap}
      >
        {editing ? (
          /* Edit mode */
          <>
            <div className="flex-1 min-w-0 flex flex-col gap-1 py-1">
              <input
                ref={nameInputRef}
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleConfirmEdit(); if (e.key === 'Escape') handleCancelEdit() }}
                className={`w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-slate-400 ${nameSize}`}
                placeholder="Item name"
              />
              <input
                type="text"
                value={editNote}
                onChange={e => setEditNote(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleConfirmEdit(); if (e.key === 'Escape') handleCancelEdit() }}
                className={`w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 ${noteSize}`}
                placeholder="Add a note…"
              />
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={handleConfirmEdit}
                className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg bg-ok text-white active:scale-95 transition-transform"
                aria-label="Confirm edit"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </button>
              <button
                onClick={handleCancelEdit}
                className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg border border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 active:scale-95 transition-transform"
                aria-label="Cancel edit"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </>
        ) : (
          /* Normal display mode */
          <>
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

            {/* Reorder arrows for pinned items */}
            {showReorder && (
              <div className="flex flex-col gap-0.5 shrink-0">
                <button
                  onClick={onMoveUp}
                  disabled={isFirst}
                  className="min-w-[28px] min-h-[22px] flex items-center justify-center text-slate-400 dark:text-slate-500 disabled:opacity-25 active:scale-95 transition-transform"
                  aria-label="Move up"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
                    <polyline points="18 15 12 9 6 15" />
                  </svg>
                </button>
                <button
                  onClick={onMoveDown}
                  disabled={isLast}
                  className="min-w-[28px] min-h-[22px] flex items-center justify-center text-slate-400 dark:text-slate-500 disabled:opacity-25 active:scale-95 transition-transform"
                  aria-label="Move down"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
              </div>
            )}

            <PinButton pinned={item.pinned} onClick={() => { if (swipeX === 0) onTogglePin(item.id) }} />
          </>
        )}
      </div>
    </div>
  )
}
