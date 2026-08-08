export type DateRangePreset = '7d' | '30d' | '90d' | 'all'

export const DATE_RANGE_LABELS: Record<DateRangePreset, string> = {
  '7d': 'Last 7 Days',
  '30d': 'Last 30 Days',
  '90d': 'Last 90 Days',
  all: 'All Time',
}

function toISODate(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function resolveDateRange(preset: DateRangePreset) {
  if (preset === 'all') return { from: undefined, to: undefined }

  const days = { '7d': 7, '30d': 30, '90d': 90 }[preset]
  const to = new Date()
  const from = new Date()
  from.setDate(from.getDate() - days)

  return { from: toISODate(from), to: toISODate(to) }
}
