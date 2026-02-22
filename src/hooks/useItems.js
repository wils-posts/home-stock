import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '../supabaseClient'
import { getNextState, sortItems } from '../lib/itemUtils'
import { ERRORS } from '../lib/constants'

export function useItems(showToast) {
  const [items, setItems] = useState([])           // server truth
  const [localItems, setLocalItems] = useState([]) // optimistic copy
  const [loading, setLoading] = useState(true)
  const [pendingIds, setPendingIds] = useState(new Set())
  const itemsRef = useRef([])

  const fetchItems = useCallback(async () => {
    const { data, error } = await supabase
      .from('items')
      .select('*')
    if (error) {
      showToast(ERRORS.NETWORK)
      return
    }
    const sorted = sortItems(data)
    itemsRef.current = sorted
    setItems(sorted)
    setLocalItems(sorted)
    setLoading(false)
  }, [showToast])

  useEffect(() => {
    fetchItems()

    const channel = supabase
      .channel('items-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'items' },
        () => fetchItems()
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [fetchItems])

  function addPending(id) {
    setPendingIds(prev => new Set([...prev, id]))
  }
  function removePending(id) {
    setPendingIds(prev => { const s = new Set(prev); s.delete(id); return s })
  }

  async function cycleState(id) {
    const item = localItems.find(i => i.id === id)
    if (!item) return
    const next = getNextState(item.state)

    addPending(id)
    setLocalItems(prev => prev.map(i => i.id === id ? { ...i, state: next } : i))

    const { error } = await supabase
      .from('items')
      .update({ state: next, updated_at: new Date().toISOString() })
      .eq('id', id)

    removePending(id)
    if (error) {
      setLocalItems(itemsRef.current)
      showToast(ERRORS.STATE_UPDATE)
    }
  }

  async function togglePin(id) {
    const item = localItems.find(i => i.id === id)
    if (!item) return
    const newPinned = !item.pinned
    const pinOrder = newPinned
      ? Math.max(0, ...localItems.filter(i => i.pinned).map(i => i.pin_order ?? 0)) + 1
      : null

    addPending(id)
    setLocalItems(prev => prev.map(i =>
      i.id === id ? { ...i, pinned: newPinned, pin_order: pinOrder } : i
    ))

    const { error } = await supabase
      .from('items')
      .update({ pinned: newPinned, pin_order: pinOrder, updated_at: new Date().toISOString() })
      .eq('id', id)

    removePending(id)
    if (error) {
      setLocalItems(itemsRef.current)
      showToast(ERRORS.STATE_UPDATE)
    }
  }

  async function addItem(name) {
    const maxOrder = localItems.length > 0
      ? Math.max(...localItems.map(i => i.created_order))
      : 0
    const { error } = await supabase
      .from('items')
      .insert({ name, state: 'LOW', pinned: false, created_order: maxOrder + 1 })
    if (error) showToast(ERRORS.NETWORK)
  }

  async function markBought(ids) {
    const { error } = await supabase
      .from('items')
      .update({ state: 'OK', updated_at: new Date().toISOString() })
      .in('id', ids)
    if (error) showToast(ERRORS.STATE_UPDATE)
  }

  return { items, localItems, loading, pendingIds, cycleState, togglePin, addItem, markBought }
}
