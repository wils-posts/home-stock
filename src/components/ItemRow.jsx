import StatePill from './StatePill'
import PinButton from './PinButton'

export default function ItemRow({ item, onCycleState, onTogglePin, pending }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 border-b border-slate-100 last:border-b-0">
      <StatePill
        state={item.state}
        onClick={() => onCycleState(item.id)}
        disabled={pending}
      />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-slate-800 truncate">{item.name}</p>
        {item.note && (
          <p className="text-sm text-slate-500 truncate">{item.note}</p>
        )}
      </div>
      <PinButton pinned={item.pinned} onClick={() => onTogglePin(item.id)} />
    </div>
  )
}
