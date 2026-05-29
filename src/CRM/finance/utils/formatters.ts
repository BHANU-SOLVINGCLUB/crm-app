import { formatINR, formatNumber } from '../../lib/format'

export function formatFinanceCurrency(value: number, compact = false) {
  return formatINR(value, compact ? { compact: true } : {})
}

export function formatFinanceCount(value: number) {
  return formatNumber(value)
}

export function formatFinanceDate(value: string) {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}
