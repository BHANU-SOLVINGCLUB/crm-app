import { formatINR, formatNumber } from '../../../lib/format'

export function formatFinanceCurrency(value: number, compact = false) {
  return formatINR(value, compact ? { compact: true } : {})
}

export function formatFinanceCount(value: number) {
  return formatNumber(value)
}

export function formatFinanceDate(value: string | undefined | null) {
  if (!value) return 'N/A'
  const date = new Date(value)
  if (isNaN(date.getTime())) return 'Invalid Date'
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}
