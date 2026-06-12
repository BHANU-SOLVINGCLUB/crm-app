import { CalendarRange, Download, Filter } from 'lucide-react'
import type { ReactNode } from 'react'
import { useFinanceStore } from '../store/useFinanceStore'
import type { FinanceDateRange } from '../types'
import { pushAppToast } from '../../store/uiStore'

interface Props {
  primaryAction?: ReactNode
}

const ranges: FinanceDateRange[] = ['30d', '90d', 'ytd']

export default function FinanceToolbar({ primaryAction }: Props) {
  const dateRange = useFinanceStore((state) => state.dateRange)
  const setDateRange = useFinanceStore((state) => state.setDateRange)

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="chip">
          <CalendarRange className="h-3.5 w-3.5" />
          Date range
        </span>
        <div className="flex rounded-xl border border-theme bg-white p-1 shadow-sm">
          {ranges.map((range) => (
            <button
              key={range}
              type="button"
              className={`rounded-lg px-3 py-1.5 text-[12px] font-semibold uppercase transition ${dateRange === range ? 'bg-slate-900 text-white' : 'text-theme-secondary hover:bg-theme-surface'}`}
              onClick={() => setDateRange(range)}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button className="btn-ghost" onClick={() => pushAppToast('Advanced finance filters opened.', 'success')}>
          <Filter className="h-4 w-4" /> Filters
        </button>
        <button className="btn-ghost" onClick={() => pushAppToast('Finance export started.', 'success')}>
          <Download className="h-4 w-4" /> Export
        </button>
        {primaryAction}
      </div>
    </div>
  )
}
