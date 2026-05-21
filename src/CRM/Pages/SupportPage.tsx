import {
  Headphones,
  Download,
  Filter,
  Columns,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Clock,
  CheckCircle2,
  Users
} from 'lucide-react'
import PageHeader from '../Components/PageHeader'
import SectionHeader from '../Components/SectionHeader'
import StatCard from '../Components/StatCard'
import { supportData } from '../data/support'

export default function SupportPage() {
  const { metrics, categories, ticketHealth, tickets, recentActivity } = supportData

  return (
    <div className="px-5 lg:px-8 py-6 lg:py-8 space-y-6">
      <PageHeader
        eyebrow="Help Desk"
        title="Support Tickets"
        subtitle="Manage customer inquiries, issues, and support requests."
        actions={
          <div className="flex gap-2">
            <button className="btn-ghost">
              <Filter className="h-4 w-4" /> Filter
            </button>
            <button className="btn-ghost">
              <Download className="h-4 w-4" /> Export
            </button>
          </div>
        }
      />

      {/* Top Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Open Tickets"
          value={metrics.openTickets}
          hint={metrics.openDelta}
          icon={Headphones}
          accent="#3b82f6"
        />
        <StatCard
          label="Avg. Resolution Time"
          value={metrics.avgResolution}
          hint={metrics.resolutionDelta}
          icon={Clock}
          accent="#10b981"
        />
        <StatCard
          label="Unassigned"
          value={metrics.unassigned}
          hint={metrics.unassignedAction}
          icon={Users}
          accent="#f59e0b"
        />
        <StatCard
          label="Escalated"
          value={metrics.escalated}
          hint={metrics.escalatedAction}
          icon={AlertCircle}
          accent="#f43f5e"
        />
      </div>

      {/* Breakdown Section */}
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <SectionHeader title="Ticket Breakdown" />
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg border border-slate-100">
              <div className="text-2xl font-bold text-rose-500">{ticketHealth.critical}</div>
              <div className="text-[12px] text-slate-500 font-medium mt-1">Critical</div>
            </div>
            <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg border border-slate-100">
              <div className="text-2xl font-bold text-amber-500">{ticketHealth.high}</div>
              <div className="text-[12px] text-slate-500 font-medium mt-1">High</div>
            </div>
            <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg border border-slate-100">
              <div className="text-2xl font-bold text-blue-500">{ticketHealth.medium}</div>
              <div className="text-[12px] text-slate-500 font-medium mt-1">Medium</div>
            </div>
            <div className="flex flex-col items-center p-4 bg-slate-50 rounded-lg border border-slate-100">
              <div className="text-2xl font-bold text-slate-400">{ticketHealth.low}</div>
              <div className="text-[12px] text-slate-500 font-medium mt-1">Low</div>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <SectionHeader title="Tickets by Category" />
          <div className="space-y-4 mt-4">
            {categories.map((cat) => (
              <div key={cat.name}>
                <div className="flex justify-between text-[13px] mb-1.5">
                  <span className="text-slate-600 font-medium">{cat.name}</span>
                  <span className="font-semibold text-slate-800">{cat.amount}</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${cat.value}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="card flex flex-col">
        {/* Table Header / Tabs */}
        <div className="px-5 py-3 border-b border-line flex items-center justify-between bg-slate-50/50">
          <div className="flex space-x-1">
            {['All Tickets 142', 'My Tickets 12', 'Unassigned 28', 'Resolved 85'].map((tab, i) => (
              <button
                key={tab}
                className={`px-3 py-1.5 text-[13px] font-medium rounded-md transition-colors ${
                  i === 0
                    ? 'bg-white text-brand-blue shadow-sm border border-line'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button className="btn-ghost !py-1.5 !text-[12px]">
              <Columns className="h-3.5 w-3.5" /> Columns
            </button>
            <button className="btn-ghost !py-1.5 !text-[12px]">
              <Download className="h-3.5 w-3.5" /> Export sheet
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="sheet">
            <thead>
              <tr>
                <th className="w-10 text-center">
                  <input type="checkbox" className="rounded border-slate-300 text-brand-blue focus:ring-brand-blue" />
                </th>
                <th className="w-12 text-center">#</th>
                <th>Ticket ID</th>
                <th>Subject</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Assignee</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((tck, idx) => (
                <tr key={tck.id}>
                  <td className="text-center">
                    <input type="checkbox" className="rounded border-slate-300 text-brand-blue focus:ring-brand-blue" />
                  </td>
                  <td className="row-num">{idx + 1}</td>
                  <td>
                    <span className="text-brand-blue font-medium hover:underline cursor-pointer px-3">{tck.id}</span>
                  </td>
                  <td className="font-medium text-slate-800 px-3">{tck.subject}</td>
                  <td className="text-slate-500 px-3">{tck.customer}</td>
                  <td className="px-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                        tck.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-700'
                          : tck.status === 'Pending'
                          ? 'bg-amber-100 text-amber-700'
                          : tck.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {tck.status}
                    </span>
                  </td>
                  <td className="px-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                        tck.priority === 'Critical'
                          ? 'bg-rose-100 text-rose-700'
                          : tck.priority === 'High'
                          ? 'bg-amber-100 text-amber-700'
                          : tck.priority === 'Medium'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {tck.priority}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2 px-3">
                      <div
                        className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                        style={{ backgroundColor: tck.color }}
                      >
                        {tck.initials}
                      </div>
                      <span className="text-slate-600 text-[13px]">{tck.assignee}</span>
                    </div>
                  </td>
                  <td className="text-slate-500 text-[13px] px-3">{tck.lastUpdated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-5 py-3 border-t border-line flex items-center justify-between text-[13px] text-slate-500 bg-slate-50/50">
          <div>Showing 1–8 of 142 tickets</div>
          <div className="flex gap-2">
            <button className="btn-ghost !px-2 !py-1 !text-[12px] opacity-50 cursor-not-allowed">
              <ChevronLeft className="h-4 w-4" /> Prev
            </button>
            <button className="btn-ghost !px-2 !py-1 !text-[12px]">
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="card p-0">
        <div className="px-5 py-4 border-b border-line flex justify-between items-center">
          <h3 className="font-semibold text-slate-800 text-[15px]">Recent Activity</h3>
          <a href="#" className="text-[13px] text-brand-blue font-medium hover:underline">View all</a>
        </div>
        <div className="divide-y divide-line">
          {recentActivity.map((activity, i) => (
            <div key={i} className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div
                  className="h-9 w-9 rounded-full flex items-center justify-center text-[13px] font-bold text-white"
                  style={{ backgroundColor: activity.color }}
                >
                  {activity.initials}
                </div>
                <div>
                  <div className="font-medium text-slate-800 text-[14px]">{activity.action}</div>
                  <div className="text-[12px] text-slate-500 mt-0.5 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {activity.time}
                  </div>
                </div>
              </div>
              <div>
                {activity.type === 'resolve' && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                {activity.type === 'reply' && <Headphones className="h-5 w-5 text-blue-500" />}
                {activity.type === 'new' && <AlertCircle className="h-5 w-5 text-rose-500" />}
                {activity.type === 'claim' && <Users className="h-5 w-5 text-amber-500" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


