import type { Deal } from '../../data/pipeline'
import { fmt, pColor, pBg, probColor } from '../../data/pipeline'

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

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className="rounded-xl border border-white/10 bg-white/[0.04] p-3 cursor-grab active:cursor-grabbing hover:border-blue-500/40 hover:-translate-y-0.5 hover:shadow-lg transition-all select-none"
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-1">
        <span className="text-[13px] font-bold text-white leading-tight">{d.company}</span>
        <span className="h-2.5 w-2.5 rounded-full flex-shrink-0 mt-0.5" style={{ background: pColor(d.priority) }} title={d.priority + ' priority'} />
      </div>

      {/* Contact */}
      <div className="text-[11px] text-slate-400 mb-2 flex items-center gap-1">
        <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
        {d.contact}
      </div>

      {/* Value */}
      <div className="text-[16px] font-bold text-white mb-2">{fmt(d.value)}</div>

      {/* Probability bar */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${d.prob}%`, background: probColor(d.prob) }} />
        </div>
        <span className="text-[11px] text-slate-400 font-medium w-7">{d.prob}%</span>
      </div>

      {/* Tags */}
      <div className="flex gap-1 flex-wrap mb-2">
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: pBg(d.priority), color: pColor(d.priority) }}>
          {d.priority}
        </span>
        {stale && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400">⏱ Stale</span>
        )}
        {urgent && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-500/10 text-red-400">⚠ {daysLeft}d left</span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-white/5">
        <span>{d.sector}</span>
        <span style={{ color: urgent ? '#f87171' : undefined }}>{d.closeDate}</span>
      </div>
    </div>
  )
}
