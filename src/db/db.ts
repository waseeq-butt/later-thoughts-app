import Dexie, { type EntityTable } from 'dexie'

export interface Thought {
  id: string
  text: string
  createdAt: number
  deletedAt: number | null // null = active, timestamp = in trash
}

export const db = new Dexie('later') as Dexie & {
  thoughts: EntityTable<Thought, 'id'>
}

db.version(1).stores({
  thoughts: 'id, createdAt, deletedAt',
  settings: 'id',
})

// settings table dropped: the PIN is now a hardcoded constant
db.version(2).stores({
  thoughts: 'id, createdAt, deletedAt',
  settings: null,
})
