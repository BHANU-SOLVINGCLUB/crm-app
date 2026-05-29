import { ArrowRight, Download, TicketCheck } from 'lucide-react'
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Link } from 'react-router-dom'
import SectionHeader from '../../../Components/SectionHeader'
import StatCard from '../../../Components/StatCard'
import SupportPriorityBadge from '../../components/SupportPriorityBadge'
import SupportStatusBadge from '../../components/SupportStatusBadge'
import { categoryBreakdown, priorityBreakdown, resolutionTrend, supportKpis, tickets } from '../../services/mockSupportData'
import { formatSupportDate } from '../../utils/formatters'

export default function SupportDashboardPage() {
  const escalated = tickets.filter((ticket) => ticket.status === 'Escalated')

  return (
    <div className="space-y-6 fade-up">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {supportKpis.map((metric) => (
          <StatCard key={metric.label} label={metric.label} value={metric.value} delta={metric.delta} hint={metric.hint} icon={TicketCheck} accent={metric.accent} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <section className="card p-5">
          <SectionHeader title="Resolution trends" subtitle="Opened, resolved, and breached tickets across the current support window." />
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={resolutionTrend} margin={{ left: -18, right: 10, top: 10, bottom: 0 }}>
                <CartesianGrid stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis dataKey="day" stroke="#64748b" tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="opened" stroke="#2563eb" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="breached" stroke="#ef4444" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="card p-5">
          <SectionHeader title="Priority breakdown" subtitle="Current queue pressure by ticket urgency." />
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={priorityBreakdown} dataKey="value" innerRadius={58} outerRadius={94} paddingAngle={3}>
                  {priorityBreakdown.map((item) => (
                    <Cell key={item.name} fill={item.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr_1fr]">
        <section className="card p-5">
          <SectionHeader title="Ticket categories" subtitle="Volume distribution by support type." />
          <div className="space-y-4">
            {categoryBreakdown.map((item) => (
              <div key={item.name}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">{item.name}</span>
                  <span className="font-semibold text-slate-900">{item.value}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="card p-5">
          <SectionHeader title="Pending escalations" subtitle="Tickets with active leadership or specialist involvement." />
          <div className="space-y-3">
            {escalated.length > 0 ? escalated.map((ticket) => (
              <div key={ticket.id} className="rounded-2xl border border-line p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm font-semibold text-slate-900">{ticket.id}</div>
                  <SupportPriorityBadge priority={ticket.priority} />
                </div>
                <div className="mt-2 text-sm text-slate-600">{ticket.subject}</div>
                <div className="mt-3"><SupportStatusBadge status={ticket.status} /></div>
              </div>
            )) : <p className="text-sm text-slate-500">No escalations in the current support window.</p>}
          </div>
        </section>

        <section className="card p-5">
          <SectionHeader title="Quick actions" subtitle="High-frequency support workflows." />
          <div className="space-y-3">
            {[
              ['Open all tickets', '/support/tickets'],
              ['Review my queue', '/support/my-tickets'],
              ['Assign unowned work', '/support/unassigned'],
              ['Open knowledge base', '/support/knowledge-base'],
            ].map(([label, href]) => (
              <Link key={label} to={href} className="flex items-center justify-between rounded-2xl border border-line px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand-blue/20 hover:bg-slate-50 hover:text-brand-blue">
                {label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            ))}
            <button className="btn-primary w-full justify-center">
              <Download className="h-4 w-4" /> Export support snapshot
            </button>
          </div>
        </section>
      </div>

      <section className="card p-0">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h3 className="text-lg font-semibold text-slate-900">Recent tickets</h3>
          <Link to="/support/tickets" className="text-sm font-semibold text-brand-blue">Open queue</Link>
        </div>
        <div className="divide-y divide-line">
          {tickets.slice(0, 4).map((ticket) => (
            <div key={ticket.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div>
                <div className="text-sm font-semibold text-slate-900">{ticket.id} • {ticket.subject}</div>
                <div className="mt-1 text-xs text-slate-500">{ticket.company} • updated {formatSupportDate(ticket.updatedDate)}</div>
              </div>
              <div className="flex items-center gap-3">
                <SupportPriorityBadge priority={ticket.priority} />
                <SupportStatusBadge status={ticket.status} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
