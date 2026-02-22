import { useNavigate } from 'react-router-dom'
import { useItems } from '../hooks/useItems'
import { useToast } from '../hooks/useToast'
import { groupItems, sortItems } from '../lib/itemUtils'
import { SECTIONS } from '../lib/constants'
import ItemRow from '../components/ItemRow'
import SectionAccordion from '../components/SectionAccordion'
import AddItemBar from '../components/AddItemBar'
import ToastContainer from '../components/ToastContainer'

export default function DashboardView({ auth }) {
  const navigate = useNavigate()
  const { toasts, showToast } = useToast()
  const { localItems, loading, pendingIds, cycleState, togglePin, addItem } = useItems(showToast)

  const sorted = sortItems(localItems)
  const groups = groupItems(sorted)

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 bg-white border-b border-slate-200">
        <h1 className="text-lg font-bold text-slate-800">Home Stock</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/shopping')}
            className="h-9 px-4 bg-slate-800 text-white rounded-lg text-sm font-medium active:scale-95 transition-transform"
          >
            Shop
          </button>
          <button
            onClick={auth.signOut}
            className="h-9 px-3 rounded-lg border border-slate-300 text-slate-600 text-sm active:scale-95 transition-transform"
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
                      pending={pendingIds.has(item.id)}
                    />
                  ))}
                </SectionAccordion>
              )
            })}
            {localItems.length === 0 && (
              <p className="text-center text-slate-400 text-sm pt-12">
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
