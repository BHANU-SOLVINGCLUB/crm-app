import { Bot } from 'lucide-react'
import { useState } from 'react'
import SupportModal from '../../components/SupportModal'
import SupportPriorityBadge from '../../components/SupportPriorityBadge'
import SupportTable, { type SupportTableColumn } from '../../components/SupportTable'
import { tickets } from '../../services/mockSupportData'
import type { TicketRecord } from '../../types'
import { pushAppToast } from '../../../../store/uiStore'

export default function UnassignedTicketsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const rows = tickets.filter((ticket) => ticket.assignedAgent === 'Unassigned')

  const columns: Array<SupportTableColumn<TicketRecord>> = [
    { key: 'id', header: 'Ticket ID', render: (row) => <span className="font-semibold text-brand-blue">{row.id}</span> },
    { key: 'subject', header: 'Subject', render: (row) => row.subject },
    { key: 'category', header: 'Category', render: (row) => <span className="chip">{row.category}</span> },
    { key: 'priority', header: 'Priority', render: (row) => <SupportPriorityBadge priority={row.priority} /> },
    { key: 'slaTimer', header: 'SLA Timer', render: (row) => row.slaTimer },
    { key: 'action', header: 'Action', render: (row) => <button className="btn-ghost !py-1.5" onClick={() => setSelectedId(row.id)}>Assign</button> },
  ]

  return (
    <div className="space-y-6 fade-up">
      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <section className="card overflow-hidden">
          <SupportTable columns={columns} rows={rows} getRowKey={(row) => row.id} />
        </section>
        <section className="card p-5">
          <div className="icon-tile bg-theme-surface text-theme-primary">
            <Bot className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-theme-primary">Auto-assignment placeholder</h3>
          <p className="mt-2 text-sm leading-6 text-theme-secondary">Skill-based routing can prioritize technical specialists, enterprise account owners, and SLA-risk tickets automatically from this queue.</p>
          <div className="mt-5 rounded-2xl border border-dashed border-theme bg-theme-surface p-4 text-sm text-theme-secondary">
            Suggested rule: route integration and security issues to senior specialists first, then balance medium-priority ticket load across available agents.
          </div>
        </section>
      </div>

      <SupportModal open={selectedId !== null} title="Assign ticket" description="Select an available agent for this unassigned ticket." onClose={() => setSelectedId(null)}>
        <select className="input default:bg-white">
          <option>Rohan Shah</option>
          <option>Maya Joseph</option>
          <option>Neha Kapoor</option>
          <option>Arun Mathew</option>
        </select>
        <div className="mt-6 flex justify-end gap-2">
          <button className="btn-ghost" onClick={() => setSelectedId(null)}>Cancel</button>
          <button className="btn-primary" onClick={() => { pushAppToast(`${selectedId} assigned successfully.`, 'success'); setSelectedId(null) }}>Assign ticket</button>
        </div>
      </SupportModal>
    </div>
  )
}
