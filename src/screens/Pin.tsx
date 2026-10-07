import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, useAnimationControls } from 'framer-motion'
import { PIN } from '../lib/config'
import { vibrate } from '../lib/haptics'
import { useApp } from '../store/app'

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫']

export default function Pin() {
  const [digits, setDigits] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const shake = useAnimationControls()
  const unlock = useApp((s) => s.unlock)
  const nav = useNavigate()
  const next = (useLocation().state as { from?: string } | null)?.from ?? '/thoughts'

  const check = async (pin: string) => {
    if (pin === PIN) {
      unlock()
      nav(next, { replace: true })
      return
    }
    setBusy(true)
    setError('Wrong pin')
    vibrate([60, 40, 60])
    await shake.start({ x: [0, -12, 12, -8, 8, 0], transition: { duration: 0.4 } })
    setDigits('')
    setBusy(false)
  }

  const press = (k: string) => {
    if (busy || !k) return
    setError('')
    if (k === '⌫') return setDigits((d) => d.slice(0, -1))
    if (digits.length >= 4) return
    const d = digits + k
    setDigits(d)
    if (d.length === 4) setTimeout(() => check(d), 120)
  }

  return (
    <div className="pb-safe pt-safe flex h-full flex-col items-center justify-center gap-8 px-8">
      <div className="flex flex-col items-center gap-3">
        <h1 className="text-xl font-medium">Enter PIN</h1>
        <p className="h-5 text-sm text-danger">{error}</p>
      </div>
      <motion.div animate={shake} className="flex gap-5" aria-label="PIN entry">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`size-4 rounded-full border transition-colors ${
              i < digits.length ? 'border-ink bg-ink' : 'border-muted'
            } ${error && 'border-danger'}`}
          />
        ))}
      </motion.div>
      <div className="grid w-full max-w-xs grid-cols-3 gap-4">
        {KEYS.map((k, i) =>
          k ? (
            <button
              key={i}
              onClick={() => press(k)}
              aria-label={k === '⌫' ? 'Backspace' : k}
              className="aspect-square min-h-16 rounded-full bg-btn text-2xl active:bg-raised"
            >
              {k}
            </button>
          ) : (
            <div key={i} />
          ),
        )}
      </div>
    </div>
  )
}
