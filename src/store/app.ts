import { create } from 'zustand'

export interface Toast {
  id: number
  message: string
  actionLabel?: string
  onAction?: () => void
}

interface AppState {
  unlocked: boolean
  toast: Toast | null
  unlock: () => void
  showToast: (message: string, action?: { label: string; run: () => void }) => void
  clearToast: () => void
}

let toastId = 0
let toastTimer: ReturnType<typeof setTimeout> | undefined

// Unlock lasts for the browser session (survives reloads, ends when the tab/app is closed).
const KEY = 'later:unlocked'
const wasUnlocked = () => {
  try { return sessionStorage.getItem(KEY) === '1' } catch { return false }
}

export const useApp = create<AppState>((set) => ({
  unlocked: wasUnlocked(),
  toast: null,
  unlock: () => {
    try { sessionStorage.setItem(KEY, '1') } catch { /* ignore */ }
    set({ unlocked: true })
  },
  showToast: (message, action) => {
    clearTimeout(toastTimer)
    const id = ++toastId
    set({ toast: { id, message, actionLabel: action?.label, onAction: action?.run } })
    toastTimer = setTimeout(() => set({ toast: null }), action ? 5000 : 1800)
  },
  clearToast: () => {
    clearTimeout(toastTimer)
    set({ toast: null })
  },
}))
