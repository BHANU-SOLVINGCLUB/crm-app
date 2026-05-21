import type { Deal } from '../data/pipeline'
import { fmt } from '../data/pipeline'
import './DealCard.css'

interface Props {
  deal: Deal
  onDragStart: () => void
  onDragEnd: () => void
  onClick: () => void
}

export default function DealCard({ deal: d, onDragStart, onDragEnd, onClick }: Props) {
  const stale = d.lastActDays >= 5
  const daysLeft = Math.ceil((new Date(d.closeDate).getTime() - Date.now()) / 864e5)
  const urgent = daysLeft <= 7
  const probTone = d.prob >= 70 ? 'high' : d.prob >= 40 ? 'medium' : 'low'
  const probWidth = `prob-width-${Math.round(d.prob / 5) * 5}`

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className="rounded-xl border border-white/10 bg-white/[0.04] p-3 cursor-grab active:cursor-grabbing hover:border-blue-500/40 hover:-translate-y-0.5 hover:shadow-lg transition-all select-none"
    >
      <div className="flex items-start justify-between mb-1">
        <span className="text-[13px] font-bold text-white leading-tight">{d.company}</span>
        <span className={`deal-priority-dot priority-${d.priority}`} title={`${d.priority} priority`} />
      </div>

      <div className="text-[11px] text-slate-400 mb-2 flex items-center gap-1">
        <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
        {d.contact}
      </div>

      <div className="text-[16px] font-bold text-white mb-2">{fmt(d.value)}</div>

      <div className="flex items-center gap-2 mb-2">
        <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
          <div className={`deal-prob-fill prob-${probTone} ${probWidth}`} />
        </div>
        <span className="text-[11px] text-slate-400 font-medium w-7">{d.prob}%</span>
      </div>

      <div className="flex gap-1 flex-wrap mb-2">
        <span className={`deal-priority-pill priority-${d.priority}`}>{d.priority}</span>
        {stale && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400">Stale</span>
        )}
        {urgent && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-500/10 text-red-400">{daysLeft}d left</span>
        )}
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-white/5">
        <span>{d.sector}</span>
        <span className={urgent ? 'deal-date-urgent' : undefined}>{d.closeDate}</span>
      </div>
    </div>
  )
}
