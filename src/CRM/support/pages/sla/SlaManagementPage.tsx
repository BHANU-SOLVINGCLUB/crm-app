import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { slaPolicies } from '../../services/mockSupportData'
import { formatPercent } from '../../utils/formatters'

export default function SlaManagementPage() {
  return (
    <div className="space-y-6 fade-up">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {slaPolicies.map((policy) => (
          <section key={policy.id} className="card p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-theme-muted">{policy.level}</div>
            <div className="mt-3 text-3xl font-bold text-theme-primary">{policy.target}</div>
            <div className="mt-2 text-sm text-theme-secondary">{formatPercent(policy.compliance)} compliance • {policy.openBreaches} active breaches</div>
          </section>
        ))}
      </div>

      <section className="card p-5">
        <h3 className="text-lg font-semibold text-theme-primary">SLA compliance by priority</h3>
        <div className="mt-4 h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={slaPolicies} margin={{ left: -18, right: 10, top: 8, bottom: 0 }}>
              <CartesianGrid stroke="rgba(0,0,0,0.05)" vertical={false} />
              <XAxis dataKey="level" stroke="#64748b" tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
              <Tooltip formatter={(value) => `${value}%`} />
              <Bar dataKey="compliance" fill="#2563eb" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  )
}
