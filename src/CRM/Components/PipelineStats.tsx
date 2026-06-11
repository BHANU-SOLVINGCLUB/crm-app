import type { Deal } from '../data/pipeline'
import { fmt } from '../data/pipeline'
import './PipelineStats.css'

interface Props {
  deals: Deal[]
  wonDeals: Deal[]
}

export default function PipelineStats({ deals, wonDeals }: Props) {
  const totalVal = deals.reduce((s, d) => s + d.value, 0)
  const weighted = deals.reduce((s, d) => s + d.value * d.prob / 100, 0)
  const wonVal = wonDeals.reduce((s, d) => s + d.value, 0) + 540000

  const cards = [
    { emoji: '🏢', label: 'Active Deals', value: deals.length.toString(), sub: 'across all 6 stages', trend: '+2 this week' },
    { emoji: '💰', label: 'Pipeline Value', value: fmt(totalVal), sub: 'if all deals close', trend: '+₹6.7L this month' },
    { emoji: '🎯', label: 'Weighted Forecast', value: fmt(Math.round(weighted)), sub: 'realistic estimate', trend: '62% avg win rate' },
    { emoji: '🏆', label: 'Closed Won', value: (wonDeals.length + 1).toString(), sub: fmt(wonVal) + ' earned', trend: 'this quarter' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 px-5 lg:px-8 pt-5">
      {cards.map((card, index) => (
        <div
          key={card.label}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 hover:border-blue-500/30 hover:-translate-y-0.5 transition-all cursor-default"
        >
          <div className={`pipeline-stat-icon pipeline-stat-${index + 1}`}>{card.emoji}</div>
          <div className="text-[12px] text-theme-muted font-medium mb-1">{card.label}</div>
          <div className="text-[22px] font-bold tracking-tight text-white">{card.value}</div>
          <div className="text-[11px] text-theme-secondary mt-0.5">{card.sub}</div>
          <div className={`pipeline-stat-trend pipeline-stat-${index + 1}`}>↑ {card.trend}</div>
        </div>
      ))}
    </div>
  )
}
