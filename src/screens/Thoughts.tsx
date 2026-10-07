import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/db'
import { restoreThought, trashThought } from '../db/thoughts'
import LongPressCard from '../components/LongPressCard'
import { formatDate } from '../lib/format'
import { vibrate } from '../lib/haptics'
import { useApp } from '../store/app'

export default function Thoughts() {
  const showToast = useApp((s) => s.showToast)
  const thoughts = useLiveQuery(
    () => db.thoughts.orderBy('createdAt').reverse().filter((t) => t.deletedAt === null).toArray(),
    [],
  )

  const remove = async (id: string) => {
    vibrate(40)
    await trashThought(id)
    showToast('Moved to Trash', { label: 'Undo', run: () => restoreThought(id) })
  }

  return (
    <div className="h-full overflow-y-auto px-4 pb-4 pt-[calc(env(safe-area-inset-top)+2.5rem)]">
      <h1 className="mb-4 text-2xl font-semibold">Thoughts</h1>
      {thoughts && thoughts.length === 0 && (
        <p className="mt-16 text-center text-muted">Nothing here yet.</p>
      )}
      <div className="flex flex-col gap-3">
        {thoughts?.map((t) => (
          <LongPressCard key={t.id} onLongPress={() => remove(t.id)}>
            <p className="whitespace-pre-wrap break-words">{t.text}</p>
            <p className="mt-3 text-xs text-muted">{formatDate(t.createdAt)}</p>
          </LongPressCard>
        ))}
      </div>
      {thoughts && thoughts.length > 0 && (
        <p className="mt-6 text-center text-xs text-muted">Press and hold a thought to delete it</p>
      )}
    </div>
  )
}
