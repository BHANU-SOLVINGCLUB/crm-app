import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { agentSummaries, resolutionTrend, slaPolicies } from '../../services/mockSupportData'

export default function SupportAnalyticsPage() {
  return (
    <div className="space-y-6 fade-up">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {[
          ['Avg response time', '27m'],
          ['Avg resolution time', '5.6h'],
          ['Reopened tickets', '11'],
          ['CSAT score', '4.7/5'],
          ['Escalation rate', '4.9%'],
        ].map(([label, value]) => (
          <section key={label} className="card p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{label}</div>
            <div className="mt-3 text-3xl font-bold text-slate-900">{value}</div>
          </section>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="card p-5">
          <h3 className="text-lg font-semibold text-slate-900">Ticket volume trends</h3>
          <div className="mt-4 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={resolutionTrend} margin={{ left: -18, right: 10, top: 8, bottom: 0 }}>
                <CartesianGrid stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis dataKey="day" stroke="#64748b" tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="opened" stroke="#2563eb" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="card p-5">
          <h3 className="text-lg font-semibold text-slate-900">SLA compliance</h3>
          <div className="mt-4 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={slaPolicies} margin={{ left: -18, right: 10, top: 8, bottom: 0 }}>
                <CartesianGrid stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis dataKey="level" stroke="#64748b" tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar dataKey="compliance" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="card p-5">
        <h3 className="text-lg font-semibold text-slate-900">Agent performance snapshot</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {agentSummaries.map((agent) => (
            <div key={agent.id} className="rounded-2xl border border-line p-4">
              <div className="text-lg font-semibold text-slate-900">{agent.name}</div>
              <div className="mt-1 text-sm text-slate-500">{agent.team}</div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div><div className="text-slate-400">Resolved</div><div className="font-semibold text-slate-900">{agent.resolved}</div></div>
                <div><div className="text-slate-400">Avg response</div><div className="font-semibold text-slate-900">{agent.avgResponse}</div></div>
                <div><div className="text-slate-400">CSAT</div><div className="font-semibold text-slate-900">{agent.csat.toFixed(1)}</div></div>
                <div><div className="text-slate-400">SLA success</div><div className="font-semibold text-slate-900">{agent.slaSuccess}%</div></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
