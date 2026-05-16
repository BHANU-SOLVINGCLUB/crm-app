import type { Deal } from '../../data/pipeline'
import { fmt } from '../../data/pipeline'

interface Props {
  deals: Deal[]
  wonDeals: Deal[]
}

export default function PipelineStats({ deals, wonDeals }: Props) {
  const totalVal = deals.reduce((s, d) => s + d.value, 0)
  const weighted = deals.reduce((s, d) => s + d.value * d.prob / 100, 0)
  const wonVal = wonDeals.reduce((s, d) => s + d.value, 0) + 540000

  const cards = [
    {
      emoji: '🏢',
      label: 'Active Deals',
      value: deals.length.toString(),
      sub: 'across all 6 stages',
      trend: '+2 this week',
      color: '#3b82f6',
      bg: 'rgba(59,130,246,0.1)',
    },
    {
      emoji: '💰',
      label: 'Pipeline Value',
      value: fmt(totalVal),
      sub: 'if all deals close',
      trend: '+₹6.7L this month',
      color: '#10b981',
      bg: 'rgba(16,185,129,0.1)',
    },
    {
      emoji: '🎯',
      label: 'Weighted Forecast',
      value: fmt(Math.round(weighted)),
      sub: 'realistic estimate',
      trend: '62% avg win rate',
      color: '#f59e0b',
      bg: 'rgba(245,158,11,0.1)',
    },
    {
      emoji: '🏆',
      label: 'Closed Won',
      value: (wonDeals.length + 1).toString(),
      sub: fmt(wonVal) + ' earned',
      trend: 'this quarter',
      color: '#16a34a',
      bg: 'rgba(22,163,74,0.1)',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 px-5 lg:px-8 pt-5">
      {cards.map(c => (
        <div
          key={c.label}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 hover:border-blue-500/30 hover:-translate-y-0.5 transition-all cursor-default"
        >
          <div className="h-9 w-9 rounded-xl flex items-center justify-center text-[18px] mb-3" style={{ background: c.bg }}>
            {c.emoji}
          </div>
          <div className="text-[12px] text-slate-400 font-medium mb-1">{c.label}</div>
          <div className="text-[22px] font-bold tracking-tight text-white">{c.value}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{c.sub}</div>
          <div className="text-[11px] font-semibold mt-2 flex items-center gap-1" style={{ color: c.color }}>
            ↑ {c.trend}
          </div>
        </div>
      ))}
    </div>
  )
}
