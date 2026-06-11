import { tickets } from '../../services/mockSupportData'
import SupportPriorityBadge from '../../components/SupportPriorityBadge'
import SupportStatusBadge from '../../components/SupportStatusBadge'
import { Link } from 'react-router-dom'

export default function MyTicketsPage() {
  const rows = tickets.filter((ticket) => ticket.assignedAgent === 'Rohan Shah' || ticket.assignedAgent === 'Maya Joseph')

  return (
    <div className="space-y-6 fade-up">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card p-5"><div className="text-xs font-semibold uppercase tracking-[0.14em] text-theme-muted">Assigned now</div><div className="mt-3 text-3xl font-bold text-theme-primary">{rows.length}</div></div>
        <div className="card p-5"><div className="text-xs font-semibold uppercase tracking-[0.14em] text-theme-muted">Critical in queue</div><div className="mt-3 text-3xl font-bold text-theme-primary">{rows.filter((ticket) => ticket.priority === 'Critical').length}</div></div>
        <div className="card p-5"><div className="text-xs font-semibold uppercase tracking-[0.14em] text-theme-muted">Waiting customer</div><div className="mt-3 text-3xl font-bold text-theme-primary">{rows.filter((ticket) => ticket.status === 'Waiting Customer').length}</div></div>
      </div>

      <section className="grid gap-4">
        {rows.map((ticket) => (
          <Link key={ticket.id} to={`/support/tickets/${ticket.id}`} className="card block p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-brand-blue">{ticket.id}</div>
                <h3 className="mt-2 text-lg font-semibold text-theme-primary">{ticket.subject}</h3>
                <p className="mt-2 text-sm text-theme-secondary">{ticket.company} • SLA {ticket.slaTimer}</p>
              </div>
              <div className="flex items-center gap-2">
                <SupportPriorityBadge priority={ticket.priority} />
                <SupportStatusBadge status={ticket.status} />
              </div>
            </div>
          </Link>
        ))}
      </section>
    </div>
  )
}
