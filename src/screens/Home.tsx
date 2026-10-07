import { useEffect, useRef, useState } from 'react'
import { saveThought } from '../db/thoughts'
import { useApp } from '../store/app'

export default function Home() {
  const [text, setText] = useState(() => {
    try { return sessionStorage.getItem('later:draft') ?? '' } catch { return '' }
  })
  const ref = useRef<HTMLTextAreaElement>(null)
  const showToast = useApp((s) => s.showToast)
  const empty = text.trim().length === 0

  useEffect(() => {
    try { sessionStorage.setItem('later:draft', text) } catch { /* ignore */ }
  }, [text])

  const save = async () => {
    if (empty) return
    await saveThought(text)
    setText('')
    showToast('Saved')
    ref.current?.focus()
  }

  return (
    <div className="relative flex h-full flex-col justify-center gap-4 p-4">
      <h1 className="absolute inset-x-4 top-[calc(env(safe-area-inset-top)+2.5rem)] text-2xl font-semibold">
        Later
      </h1>
      <textarea
        ref={ref}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your thoughts"
        className="h-1/2 resize-none rounded-2xl bg-card p-5 text-2xl leading-relaxed text-ink placeholder:text-muted outline-none ring-1 ring-transparent transition focus:bg-raised focus:ring-btn"
      />
      <div className="flex gap-3">
        <button
          onClick={() => setText('')}
          disabled={empty}
          className="min-h-14 flex-1 rounded-2xl bg-card text-muted active:bg-raised disabled:opacity-40"
        >
          Cancel
        </button>
        <button
          onClick={save}
          disabled={empty}
          className="min-h-14 flex-1 rounded-2xl bg-btn font-semibold text-white active:bg-raised disabled:opacity-40"
        >
          Save
        </button>
      </div>
    </div>
  )
}
