export function getStartOfDay(date = new Date()) {
  const start = new Date(date)
  start.setHours(0, 0, 0, 0)
  return start
}

export function getEndOfDay(date = new Date()) {
  const end = new Date(date)
  end.setHours(23, 59, 59, 999)
  return end
}

export function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function isWithinLastNDays(date: Date, days: number) {
  const now = new Date()
  const nDaysAgo = new Date(now.setDate(now.getDate() - days))
  return date >= nDaysAgo
} 