import React from 'react'

export interface TimelineEvent {
  id: string | number
  title: string
  description?: string
  date: string
  icon?: React.ReactNode
  iconBg?: string
  iconColor?: string
}

interface TimelineProps {
  events: TimelineEvent[]
}

export default function Timeline({ events }: TimelineProps) {
  if (!events || events.length === 0) {
    return <div className="text-sm text-slate-400 py-4">No activity yet.</div>
  }

  return (
    <div className="relative border-l border-line ml-4 space-y-6 pb-4">
      {events.map((event, idx) => (
        <div key={event.id} className="relative pl-6">
          {/* Timeline Dot/Icon */}
          <span 
            className="absolute -left-[17px] top-1 flex h-8 w-8 items-center justify-center rounded-full border-[3px] border-panel2"
            style={{ 
              backgroundColor: event.iconBg || '#1e293b', 
              color: event.iconColor || '#94a3b8' 
            }}
          >
            {event.icon ? (
              <div className="h-3.5 w-3.5">{event.icon}</div>
            ) : (
              <div className="h-2 w-2 rounded-full bg-current" />
            )}
          </span>

          {/* Content */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1">
            <div>
              <h4 className="text-[14px] font-semibold text-white">{event.title}</h4>
              {event.description && (
                <p className="text-[13px] text-slate-400 mt-1 leading-relaxed">
                  {event.description}
                </p>
              )}
            </div>
            <time className="text-[11px] font-medium text-slate-500 whitespace-nowrap mt-0.5">
              {event.date}
            </time>
          </div>
        </div>
      ))}
    </div>
  )
}
