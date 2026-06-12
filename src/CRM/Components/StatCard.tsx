import type { LucideIcon } from 'lucide-react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import clsx from 'clsx'
import './StatCard.css'

interface Props {
  label: string
  value: string
  delta?: number
  hint?: string
  icon?: LucideIcon
  accent?: string
  invertDelta?: boolean
}

export default function StatCard({ label, value, delta, hint, icon: Icon, accent = '#3b82f6', invertDelta }: Props) {
  const positive = (delta ?? 0) >= 0
  const goodDirection = invertDelta ? !positive : positive
  const accentClass = {
    '#3b82f6': 'stat-accent-blue',
    '#10b981': 'stat-accent-green',
    '#8b5cf6': 'stat-accent-purple',
    '#f59e0b': 'stat-accent-amber',
    '#ec4899': 'stat-accent-pink',
    '#06b6d4': 'stat-accent-cyan',
    '#f43f5e': 'stat-accent-rose',
  }[accent] ?? 'stat-accent-blue'

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[12px] uppercase tracking-widest text-theme-muted font-semibold">{label}</div>
          <div className="mt-2.5 text-[24px] font-bold tracking-tight leading-none text-theme-primary whitespace-nowrap">{value}</div>
        </div>
        {Icon && (
          <div className={`stat-card-icon ${accentClass}`}>
            <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
          </div>
        )}
      </div>
      <div className="mt-3 flex items-center gap-2">
        {typeof delta === 'number' && (
          <span
            className={clsx(
              'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11.5px] font-semibold',
              goodDirection ? 'bg-brand-green/15 text-brand-green' : 'bg-brand-pink/15 text-brand-pink'
            )}
          >
            {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(delta).toFixed(1)}%
          </span>
        )}
        {hint && <span className="text-[12px] text-theme-muted">{hint}</span>}
      </div>
    </div>
  )
}

