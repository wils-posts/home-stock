import { useState } from 'react'

export default function AddItemBar({ onAdd }) {
  const [value, setValue] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const name = value.trim()
    if (!name) return
    onAdd(name)
    setValue('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="fixed bottom-0 left-0 right-0 flex items-center gap-2 px-4 py-3 bg-white border-t border-slate-200 safe-area-bottom"
    >
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Add item…"
        enterKeyHint="done"
        className="flex-1 h-11 px-3 rounded-lg border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
      />
      <button
        type="submit"
        className="h-11 px-4 bg-slate-800 text-white rounded-lg font-medium text-sm active:scale-95 transition-transform"
      >
        Add
      </button>
    </form>
  )
}
