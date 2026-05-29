import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SupportEmptyState from '../../components/SupportEmptyState'
import SupportPriorityBadge from '../../components/SupportPriorityBadge'
import SupportStatusBadge from '../../components/SupportStatusBadge'
import SupportTable, { type SupportTableColumn } from '../../components/SupportTable'
import { tickets } from '../../services/mockSupportData'
import type { TicketRecord, TicketStatus } from '../../types'
import { formatSupportDate } from '../../utils/formatters'

const tabs: Array<'All' | TicketStatus> = ['All', 'Open', 'In Progress', 'Waiting Customer', 'Resolved', 'Closed', 'Escalated']

export default function AllTicketsPage() {
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<(typeof tabs)[number]>('All')

  const rows = useMemo(() => tickets.filter((ticket) => {
    const q = query.toLowerCase()
    const matchesQuery =
      ticket.id.toLowerCase().includes(q) ||
      ticket.subject.toLowerCase().includes(q) ||
      ticket.customer.toLowerCase().includes(q) ||
      ticket.company.toLowerCase().includes(q)
    const matchesTab = tab === 'All' || ticket.status === tab
    return matchesQuery && matchesTab
  }), [query, tab])

  const columns: Array<SupportTableColumn<TicketRecord>> = [
    { key: 'id', header: 'Ticket ID', render: (row) => <Link to={`/support/tickets/${row.id}`} className="font-semibold text-brand-blue hover:underline">{row.id}</Link> },
    { key: 'subject', header: 'Subject', render: (row) => <div><div className="font-medium text-slate-900">{row.subject}</div><div className="text-xs text-slate-500">{row.company}</div></div> },
    { key: 'customer', header: 'Customer', render: (row) => row.customer },
    { key: 'category', header: 'Category', render: (row) => <span className="chip">{row.category}</span> },
    { key: 'priority', header: 'Priority', render: (row) => <SupportPriorityBadge priority={row.priority} /> },
    { key: 'status', header: 'Status', render: (row) => <SupportStatusBadge status={row.status} /> },
    { key: 'assignedAgent', header: 'Assigned Agent', render: (row) => row.assignedAgent },
    { key: 'slaTimer', header: 'SLA Timer', render: (row) => row.slaTimer },
    { key: 'createdDate', header: 'Created', render: (row) => formatSupportDate(row.createdDate) },
    { key: 'updatedDate', header: 'Updated', render: (row) => formatSupportDate(row.updatedDate) },
  ]

  return (
    <div className="space-y-6 fade-up">
      <section className="card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="input pl-9" placeholder="Search ticket, subject, customer, or company" />
          </div>
          <div className="chip">Bulk actions and exports ready for queue managers</div>
        </div>
        <div className="mt-4 flex gap-2 overflow-x-auto">
          {tabs.map((item) => (
            <button
              key={item}
              type="button"
              className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${tab === item ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              onClick={() => setTab(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="card overflow-hidden">
        {rows.length > 0 ? <SupportTable columns={columns} rows={rows} getRowKey={(row) => row.id} /> : <div className="p-5"><SupportEmptyState icon={Search} title="No tickets found" description="Try a different search or switch to another queue status." /></div>}
      </section>
    </div>
  )
}
