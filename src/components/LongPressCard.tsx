import { useRef, type ReactNode } from 'react'

interface Props {
  onLongPress?: () => void
  onTap?: () => void
  children: ReactNode
}

const HOLD_MS = 1100
const MOVE_TOLERANCE = 10

export default function LongPressCard({ onLongPress, onTap, children }: Props) {
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const start = useRef<{ x: number; y: number } | null>(null)
  const fired = useRef(false)
  const pressed = useRef(false)

  const cancel = () => {
    clearTimeout(timer.current)
    start.current = null
    pressed.current = false
  }

  return (
    <div
      className="no-select min-h-12 rounded-2xl bg-card p-4 active:bg-raised"
      style={{ touchAction: 'pan-y' }}
      onContextMenu={(e) => e.preventDefault()}
      onPointerDown={(e) => {
        fired.current = false
        pressed.current = true
        start.current = { x: e.clientX, y: e.clientY }
        if (onLongPress) {
          timer.current = setTimeout(() => {
            fired.current = true
            start.current = null
            onLongPress()
          }, HOLD_MS)
        }
      }}
      onPointerMove={(e) => {
        const s = start.current
        if (s && Math.hypot(e.clientX - s.x, e.clientY - s.y) > MOVE_TOLERANCE) cancel()
      }}
      onPointerUp={() => {
        const wasTap = pressed.current && !fired.current
        cancel()
        if (wasTap) onTap?.()
      }}
      onPointerCancel={cancel}
      onPointerLeave={cancel}
    >
      {children}
    </div>
  )
}
