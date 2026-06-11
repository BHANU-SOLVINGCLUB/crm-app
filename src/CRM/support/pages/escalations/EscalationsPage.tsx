import SupportPriorityBadge from '../../components/SupportPriorityBadge'
import SupportStatusBadge from '../../components/SupportStatusBadge'
import SupportTimeline from '../../components/SupportTimeline'
import { tickets } from '../../services/mockSupportData'

export default function EscalationsPage() {
  const rows = tickets.filter((ticket) => ticket.status === 'Escalated' || ticket.escalationType)

  return (
    <div className="space-y-6 fade-up">
      {rows.map((ticket) => (
        <section key={ticket.id} className="card p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-brand-blue">{ticket.id}</div>
              <h3 className="mt-2 text-xl font-semibold text-theme-primary">{ticket.subject}</h3>
              <p className="mt-2 text-sm text-theme-secondary">{ticket.company} • escalation type {ticket.escalationType ?? 'General'}</p>
            </div>
            <div className="flex items-center gap-2">
              <SupportPriorityBadge priority={ticket.priority} />
              <SupportStatusBadge status={ticket.status} />
            </div>
          </div>
          <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_1.2fr]">
            <div className="space-y-3">
              <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">SLA indicator: {ticket.slaTimer}</div>
              <div className="rounded-2xl border border-theme p-4 text-sm leading-6 text-theme-primary">{ticket.summary}</div>
            </div>
            <SupportTimeline items={ticket.timeline} />
          </div>
        </section>
      ))}
    </div>
  )
}
