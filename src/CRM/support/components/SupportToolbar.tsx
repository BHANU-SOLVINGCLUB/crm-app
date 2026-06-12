import { CalendarRange, Download, Filter } from 'lucide-react'
import { useSupportStore } from '../store/useSupportStore'
import type { SupportDateRange } from '../types'
import { pushAppToast } from '../../../store/uiStore'

const ranges: SupportDateRange[] = ['24h', '7d', '30d']

export default function SupportToolbar() {
  const dateRange = useSupportStore((state) => state.dateRange)
  const setDateRange = useSupportStore((state) => state.setDateRange)

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="chip">
          <CalendarRange className="h-3.5 w-3.5" />
          Support window
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
      <div className="flex flex-wrap gap-2">
        <button className="btn-ghost" onClick={() => pushAppToast('Advanced support filters opened.', 'success')}>
          <Filter className="h-4 w-4" /> Filters
        </button>
        <button className="btn-ghost" onClick={() => pushAppToast('Support export started.', 'success')}>
          <Download className="h-4 w-4" /> Export
        </button>
      </div>
    </div>
  )
}
