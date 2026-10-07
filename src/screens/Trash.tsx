import { useEffect, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/db'
import { TRASH_TTL_MS, deleteForever, purgeExpired, restoreThought } from '../db/thoughts'
import LongPressCard from '../components/LongPressCard'
import { formatDate, timeLeft } from '../lib/format'
import { useApp } from '../store/app'
import type { Thought } from '../db/db'

export default function Trash() {
  const showToast = useApp((s) => s.showToast)
  const [selected, setSelected] = useState<Thought | null>(null)
  const [, tick] = useState(0)

  useEffect(() => {
    purgeExpired()
    const i = setInterval(() => {
      purgeExpired()
      tick((n) => n + 1)
    }, 60_000)
    return () => clearInterval(i)
  }, [])

  const items = useLiveQuery(
    () => db.thoughts.orderBy('deletedAt').reverse().filter((t) => t.deletedAt !== null).toArray(),
    [],
  )

  return (
    <div className="h-full overflow-y-auto px-4 pb-4 pt-[calc(env(safe-area-inset-top)+2.5rem)]">
      <h1 className="mb-1 text-2xl font-semibold">Trash</h1>
      <p className="mb-4 text-sm text-muted">Deleted thoughts are removed after 24 hours.</p>
      {items && items.length === 0 && <p className="mt-16 text-center text-muted">Trash is empty.</p>}
      <div className="flex flex-col gap-3">
        {items?.map((t) => (
          <LongPressCard key={t.id} onTap={() => {
              useApp.getState().clearToast()
              setSelected(t)
            }}>
            <p className="whitespace-pre-wrap break-words">{t.text}</p>
            <p className="mt-3 text-xs text-muted">
              {formatDate(t.createdAt)} · {timeLeft(t.deletedAt!, TRASH_TTL_MS)}
            </p>
          </LongPressCard>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-40 flex items-end bg-black/60" onClick={() => setSelected(null)}>
          <div
            className="pb-safe w-full rounded-t-3xl bg-card p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-4 line-clamp-3 px-1 text-muted">{selected.text}</p>
            <div className="flex flex-col gap-3">
              <button
                className="min-h-14 rounded-2xl bg-btn font-semibold text-white active:bg-raised"
                onClick={async () => {
                  await restoreThought(selected.id)
                  setSelected(null)
                  showToast('Restored')
                }}
              >
                Restore
              </button>
              <button
                className="min-h-14 rounded-2xl bg-raised text-danger active:bg-btn"
                onClick={async () => {
                  await deleteForever(selected.id)
                  setSelected(null)
                  showToast('Deleted forever')
                }}
              >
                Delete forever
              </button>
              <button className="min-h-14 rounded-2xl text-muted" onClick={() => setSelected(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
