import { ArrowUpCircle, MessageSquareReply, Paperclip, UserRoundPlus } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import SupportEmptyState from '../../components/SupportEmptyState'
import SupportModal from '../../components/SupportModal'
import SupportPriorityBadge from '../../components/SupportPriorityBadge'
import SupportStatusBadge from '../../components/SupportStatusBadge'
import SupportTimeline from '../../components/SupportTimeline'
import { tickets } from '../../services/mockSupportData'
import { formatSupportDateTime } from '../../utils/formatters'
import { pushAppToast } from '../../../store/uiStore'

export default function TicketDetailPage() {
  const { ticketId } = useParams()
  const ticket = tickets.find((item) => item.id === ticketId)
  const [assignOpen, setAssignOpen] = useState(false)

  if (!ticket) {
    return <div className="card p-6"><SupportEmptyState icon={MessageSquareReply} title="Ticket not found" description="This support ticket may have been archived or removed from the dataset." /></div>
  }

  return (
    <div className="space-y-6 fade-up">
      <section className="card p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link to="/support/tickets" className="text-sm font-semibold text-brand-blue hover:underline">Back to all tickets</Link>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{ticket.subject}</h2>
            <p className="mt-2 text-sm text-slate-500">{`${ticket.id} • ${ticket.company} • ${ticket.channel}`}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <SupportPriorityBadge priority={ticket.priority} />
            <SupportStatusBadge status={ticket.status} />
            <button className="btn-ghost" onClick={() => setAssignOpen(true)}>
              <UserRoundPlus className="h-4 w-4" /> Assign
            </button>
            <button className="btn-ghost" onClick={() => pushAppToast(`${ticket.id} escalated to specialist queue.`, 'success')}>
              <ArrowUpCircle className="h-4 w-4" /> Escalate
            </button>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
        <section className="space-y-6">
          <div className="card p-5">
            <h3 className="text-lg font-semibold text-slate-900">Ticket summary</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Customer</div>
                <div className="mt-2 text-sm font-semibold text-slate-900">{ticket.customer}</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Issue</div>
                <div className="mt-2 text-sm font-semibold text-slate-900">{ticket.subject}</div>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600">{ticket.summary}</p>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-4"><div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Assigned Agent</div><div className="mt-2 text-sm font-semibold text-slate-900">{ticket.assignedAgent}</div></div>
              <div className="rounded-2xl bg-slate-50 p-4"><div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">SLA Timer</div><div className="mt-2 text-sm font-semibold text-slate-900">{ticket.slaTimer}</div></div>
              <div className="rounded-2xl bg-slate-50 p-4"><div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Plan</div><div className="mt-2 text-sm font-semibold text-slate-900">{ticket.plan}</div></div>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-slate-900">Conversation timeline</h3>
              <button className="btn-primary" onClick={() => pushAppToast(`Reply drafted for ${ticket.id}.`, 'success')}>
                <MessageSquareReply className="h-4 w-4" /> Quick reply
              </button>
            </div>
            <div className="mt-4 space-y-4">
              {ticket.conversation.map((entry) => (
                <div key={entry.id} className={`rounded-2xl p-4 ${entry.role === 'Agent' ? 'bg-blue-50/70' : entry.role === 'System' ? 'bg-slate-100' : 'border border-line bg-white'}`}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-sm font-semibold text-slate-900">{entry.author} <span className="ml-2 text-xs font-medium text-slate-400">{entry.role}</span></div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">{formatSupportDateTime(entry.timestamp)}</div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-700">{entry.message}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl border border-line bg-slate-50 p-4">
              <div className="text-sm font-semibold text-slate-900">Reply box</div>
              <textarea className="input mt-3 min-h-[120px] resize-none" placeholder="Write a customer-facing response..." />
              <div className="mt-3 flex flex-wrap justify-between gap-2">
                <button className="btn-ghost" onClick={() => pushAppToast('Attachment picker opened.', 'success')}>
                  <Paperclip className="h-4 w-4" /> Upload attachment
                </button>
                <button className="btn-primary" onClick={() => pushAppToast(`Reply sent on ${ticket.id}.`, 'success')}>Send reply</button>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="card p-5">
            <h3 className="text-lg font-semibold text-slate-900">Customer details</h3>
            <div className="mt-4 space-y-3 text-sm">
              <div><span className="text-slate-500">Name:</span> <span className="font-medium text-slate-900">{ticket.customer}</span></div>
              <div><span className="text-slate-500">Email:</span> <span className="font-medium text-slate-900">{ticket.customerEmail}</span></div>
              <div><span className="text-slate-500">Phone:</span> <span className="font-medium text-slate-900">{ticket.customerPhone}</span></div>
              <div><span className="text-slate-500">Company:</span> <span className="font-medium text-slate-900">{ticket.company}</span></div>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="text-lg font-semibold text-slate-900">Internal notes</h3>
            <p className="mt-2 text-sm text-slate-500">Private notes visible only to employees.</p>
            <div className="mt-4 space-y-3">
              {ticket.internalNotes.length > 0 ? ticket.internalNotes.map((note) => (
                <div key={note} className="rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-700">{note}</div>
              )) : <p className="text-sm text-slate-500">No internal notes yet.</p>}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="text-lg font-semibold text-slate-900">Attachments</h3>
            <div className="mt-4 space-y-3">
              {ticket.attachments.length > 0 ? ticket.attachments.map((item) => (
                <div key={item} className="rounded-xl bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">{item}</div>
              )) : <p className="text-sm text-slate-500">No customer attachments on this ticket.</p>}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="text-lg font-semibold text-slate-900">Resolution section</h3>
            <div className="mt-4">
              {ticket.resolution ? (
                <div className="rounded-2xl border border-line p-4 text-sm leading-6 text-slate-700">{ticket.resolution}</div>
              ) : (
                <p className="text-sm text-slate-500">No final resolution has been recorded yet.</p>
              )}
            </div>
          </div>
        </section>
      </div>

      <section className="card p-5">
        <h3 className="text-lg font-semibold text-slate-900">Activity timeline</h3>
        <div className="mt-5">
          <SupportTimeline items={ticket.timeline} />
        </div>
      </section>

      <SupportModal open={assignOpen} title="Assign agent" description="Route the ticket to the right support owner or specialist queue." onClose={() => setAssignOpen(false)}>
        <div className="grid gap-4">
          <select className="input default:bg-white">
            <option>Rohan Shah</option>
            <option>Maya Joseph</option>
            <option>Neha Kapoor</option>
            <option>Arun Mathew</option>
          </select>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button className="btn-ghost" onClick={() => setAssignOpen(false)}>Cancel</button>
          <button className="btn-primary" onClick={() => { setAssignOpen(false); pushAppToast(`${ticket.id} assignment updated.`, 'success') }}>Save assignment</button>
        </div>
      </SupportModal>
    </div>
  )
}
