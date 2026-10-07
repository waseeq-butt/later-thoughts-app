import { db, type Thought } from './db'
import { uuid } from '../lib/id'

export const TRASH_TTL_MS = 24 * 60 * 60 * 1000

export async function saveThought(text: string): Promise<Thought> {
  const thought: Thought = {
    id: uuid(),
    text: text.trim(),
    createdAt: Date.now(),
    deletedAt: null,
  }
  await db.thoughts.add(thought)
  return thought
}

export const trashThought = (id: string) => db.thoughts.update(id, { deletedAt: Date.now() })
export const restoreThought = (id: string) => db.thoughts.update(id, { deletedAt: null })
export const deleteForever = (id: string) => db.thoughts.delete(id)

export async function purgeExpired(): Promise<void> {
  const cutoff = Date.now() - TRASH_TTL_MS
  await db.thoughts.filter((t) => t.deletedAt !== null && t.deletedAt < cutoff).delete()
}
