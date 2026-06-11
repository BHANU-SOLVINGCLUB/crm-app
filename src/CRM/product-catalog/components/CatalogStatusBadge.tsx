import clsx from 'clsx'
import { stockLabel, type CatalogProduct, type CatalogStatus } from '../data'

export function statusTone(status: CatalogStatus) {
  if (status === 'Active') return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  if (status === 'Draft') return 'bg-amber-50 text-amber-700 border-amber-200'
  return 'bg-theme-surface text-theme-secondary border-slate-200'
}

export function stockTone(product: CatalogProduct) {
  const label = stockLabel(product)
  if (label === 'In stock') return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  if (label === 'Low stock') return 'bg-amber-50 text-amber-700 border-amber-200'
  if (label === 'Out of stock') return 'bg-rose-50 text-rose-700 border-rose-200'
  return 'bg-theme-surface text-theme-secondary border-slate-200'
}

export default function CatalogStatusBadge({
  status,
  label,
  className,
}: {
  status: CatalogStatus
  label?: string
  className?: string
}) {
  return (
    <span className={clsx('inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold', statusTone(status), className)}>
      {label ?? status}
    </span>
  )
}

