import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useItems } from '../hooks/useItems'
import { useToast } from '../hooks/useToast'
import { groupItems, sortItems } from '../lib/itemUtils'
import { SECTIONS } from '../lib/constants'
import ItemRow from '../components/ItemRow'
import SectionAccordion from '../components/SectionAccordion'
import AddItemBar from '../components/AddItemBar'
import ToastContainer from '../components/ToastContainer'

export default function DashboardView({ auth, dark, toggleDark }) {
  const navigate = useNavigate()
  const { toasts, showToast } = useToast()
  const { localItems, loading, pendingIds, cycleState, togglePin, addItem, deleteItem } = useItems(showToast)

  const [compact, setCompact] = useState(() => localStorage.getItem('compact') === 'true')

  function toggleCompact() {
    setCompact(c => {
      const next = !c
      localStorage.setItem('compact', String(next))
      return next
    })
  }

  const sorted = sortItems(localItems)
  const groups = groupItems(sorted)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
        <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">Home Stock</h1>
        <div className="flex items-center gap-1">
          {/* Compact toggle */}
          <button
            onClick={toggleCompact}
            title={compact ? 'Comfortable view' : 'Compact view'}
            className="h-9 w-9 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 active:scale-95 transition-transform"
          >
            {compact ? (
              // Comfortable icon (wider lines)
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            ) : (
              // Compact icon (tighter lines)
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <line x1="3" y1="5" x2="21" y2="5"/>
                <line x1="3" y1="9" x2="21" y2="9"/>
                <line x1="3" y1="13" x2="21" y2="13"/>
                <line x1="3" y1="17" x2="21" y2="17"/>
                <line x1="3" y1="21" x2="21" y2="21"/>
              </svg>
            )}
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDark}
            title={dark ? 'Light mode' : 'Dark mode'}
            className="h-9 w-9 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 active:scale-95 transition-transform"
          >
            {dark ? (
              // Sun icon
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              // Moon icon
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>

          {/* Shop button */}
          <button
            onClick={() => navigate('/shopping')}
            className="h-9 px-3 bg-slate-800 dark:bg-slate-600 text-white rounded-lg text-sm font-medium active:scale-95 transition-transform"
          >
            Shop
          </button>

          {/* Sign out */}
          <button
            onClick={auth.signOut}
            className="h-9 px-3 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 text-sm active:scale-95 transition-transform"
          >
            Out
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="pt-1">
        {loading ? (
          <div className="flex justify-center pt-16">
            <div className="w-8 h-8 border-4 border-slate-300 border-t-slate-700 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {SECTIONS.map(section => {
              const sectionItems = groups[section.key] ?? []
              return (
                <SectionAccordion
                  key={section.key}
                  title={section.label}
                  items={sectionItems}
                  defaultOpen={section.defaultOpen}
                >
                  {sectionItems.map(item => (
                    <ItemRow
                      key={item.id}
                      item={item}
                      onCycleState={cycleState}
                      onTogglePin={togglePin}
                      onDelete={deleteItem}
                      pending={pendingIds.has(item.id)}
                      compact={compact}
                    />
                  ))}
                </SectionAccordion>
              )
            })}
            {localItems.length === 0 && (
              <p className="text-center text-slate-400 dark:text-slate-500 text-sm pt-12">
                No items yet. Add one below.
              </p>
            )}
          </>
        )}
      </main>

      <AddItemBar onAdd={addItem} />
      <ToastContainer toasts={toasts} />
    </div>
  )
}
