import { MessageSquareText, ShieldAlert, StickyNote, TimerReset, UserRoundCheck } from 'lucide-react'
import type { SupportTimelineEntry } from '../types'
import { formatSupportDateTime } from '../utils/formatters'

interface Props {
  items: SupportTimelineEntry[]
}

function iconFor(type: SupportTimelineEntry['type']) {
  switch (type) {
    case 'reply':
      return MessageSquareText
    case 'escalation':
      return ShieldAlert
    case 'assignment':
      return UserRoundCheck
    case 'note':
      return StickyNote
    default:
      return TimerReset
  }
}

export default function SupportTimeline({ items }: Props) {
  return (
    <div className="relative ml-3 border-l border-line pl-5">
      <div className="space-y-5">
        {items.map((item) => {
          const Icon = iconFor(item.type)
          return (
            <div key={item.id} className="relative">
              <div className="absolute -left-[30px] top-1 flex h-7 w-7 items-center justify-center rounded-full border border-line bg-white shadow-sm">
                <Icon className="h-3.5 w-3.5 text-slate-600" />
              </div>
              <div className="rounded-2xl border border-line bg-slate-50/70 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm font-semibold text-slate-900">{item.title}</div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">{formatSupportDateTime(item.timestamp)}</div>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                <div className="mt-3 text-xs font-medium text-slate-500">{item.actor}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
