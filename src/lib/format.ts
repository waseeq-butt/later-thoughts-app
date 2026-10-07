const dateFmt = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})
export const formatDate = (ts: number) => dateFmt.format(ts)

export function timeLeft(deletedAt: number, ttl: number): string {
  const ms = Math.max(0, deletedAt + ttl - Date.now())
  const h = Math.floor(ms / 3_600_000)
  const m = Math.floor((ms % 3_600_000) / 60_000)
  if (h > 0) return `${h}h ${m}m left`
  return `${Math.max(1, m)}m left`
}
