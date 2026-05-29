import { ArrowRight, Download, TrendingUp } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import StatCard from '../../../Components/StatCard'
import SectionHeader from '../../../Components/SectionHeader'
import { collections, financeKpis, invoices, monthlyFinanceData, recentTransactions, revenueSegments } from '../../services/mockFinanceData'
import { formatFinanceCurrency, formatFinanceDate } from '../../utils/formatters'
import FinanceStatusBadge from '../../components/FinanceStatusBadge'
import { Link } from 'react-router-dom'

export default function FinanceDashboardPage() {
  const invoiceHealth = {
    paid: invoices.filter((item) => item.status === 'Paid').length,
    pending: invoices.filter((item) => item.status === 'Sent' || item.status === 'Viewed' || item.status === 'Partial').length,
    overdue: invoices.filter((item) => item.status === 'Overdue').length,
    draft: invoices.filter((item) => item.status === 'Draft').length,
  }

  return (
    <div className="space-y-6 fade-up">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {financeKpis.map((metric) => (
          <StatCard
            key={metric.label}
            label={metric.label}
            value={formatFinanceCurrency(metric.value, true)}
            delta={metric.delta}
            hint={metric.hint}
            icon={TrendingUp}
            accent={metric.accent}
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <section className="card p-5">
          <SectionHeader title="Revenue vs expenses" subtitle="Monthly financial performance across booked revenue, expense load, and margin." />
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyFinanceData} margin={{ left: -18, right: 12, top: 12, bottom: 0 }}>
                <CartesianGrid stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" tickLine={false} axisLine={false} fontSize={11} />
                <YAxis stroke="#64748b" tickLine={false} axisLine={false} fontSize={11} />
                <Tooltip formatter={(value) => formatFinanceCurrency(Number(value))} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="revenue" name="Revenue" fill="#2563eb" radius={[8, 8, 0, 0]} maxBarSize={34} />
                <Bar dataKey="expenses" name="Expenses" fill="#cbd5e1" radius={[8, 8, 0, 0]} maxBarSize={34} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="card p-5">
          <SectionHeader title="Revenue by segment" subtitle="Current contribution mix by customer segment." />
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={revenueSegments} dataKey="value" innerRadius={62} outerRadius={96} paddingAngle={3}>
                  {revenueSegments.map((segment) => (
                    <Cell key={segment.name} fill={segment.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(_, __, item) => `${item.payload.name}: ${formatFinanceCurrency(item.payload.amount)}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {revenueSegments.map((segment) => (
              <div key={segment.name} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: segment.color }} />
                  <span className="text-sm font-medium text-slate-700">{segment.name}</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">{formatFinanceCurrency(segment.amount, true)}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr_1fr]">
        <section className="card p-5">
          <SectionHeader title="Pending collections" subtitle="Accounts that need action in the next 72 hours." right={<Link to="/finance/collections" className="text-sm font-semibold text-brand-blue">View all</Link>} />
          <div className="space-y-3">
            {collections.map((item) => (
              <div key={item.id} className="rounded-2xl border border-line p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{item.customer}</div>
                    <div className="mt-1 text-xs text-slate-500">{item.invoiceId} • {item.daysOverdue} days overdue</div>
                  </div>
                  <FinanceStatusBadge status={item.status} />
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-slate-500">Exposure</span>
                  <span className="font-semibold text-slate-900">{formatFinanceCurrency(item.amount)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="card p-5">
          <SectionHeader title="Invoice health" subtitle="Operational billing status snapshot." />
          <div className="grid grid-cols-2 gap-3">
            {[
              ['Paid', invoiceHealth.paid],
              ['In progress', invoiceHealth.pending],
              ['Overdue', invoiceHealth.overdue],
              ['Draft', invoiceHealth.draft],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-slate-50 p-4 text-center">
                <div className="text-2xl font-bold text-slate-900">{value}</div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="card p-5">
          <SectionHeader title="Quick actions" subtitle="High-frequency workflows for finance ops." />
          <div className="space-y-3">
            {[
              ['Create invoice', '/finance/invoices'],
              ['Review payments', '/finance/payments'],
              ['Export reports', '/finance/reports'],
              ['Update settings', '/finance/settings'],
            ].map(([label, href]) => (
              <Link
                key={label}
                to={href}
                className="flex items-center justify-between rounded-2xl border border-line px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand-blue/20 hover:bg-slate-50 hover:text-brand-blue"
              >
                {label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            ))}
            <button className="btn-primary w-full justify-center">
              <Download className="h-4 w-4" /> Export month-end pack
            </button>
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="card p-0">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h3 className="text-lg font-semibold text-slate-900">Recent transactions</h3>
            <Link to="/finance/payments" className="text-sm font-semibold text-brand-blue">Open ledger</Link>
          </div>
          <div className="divide-y divide-line">
            {recentTransactions.map((item) => (
              <div key={item.id} className="flex items-center justify-between px-5 py-4">
                <div>
                  <div className="text-sm font-semibold text-slate-900">{item.customer}</div>
                  <div className="mt-1 text-xs text-slate-500">{item.type} • {formatFinanceDate(item.createdAt)}</div>
                </div>
                <div className={`text-sm font-semibold ${item.positive ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {item.positive ? '+' : '-'} {formatFinanceCurrency(item.amount)}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="card p-0">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h3 className="text-lg font-semibold text-slate-900">Recent invoices</h3>
            <Link to="/finance/invoices" className="text-sm font-semibold text-brand-blue">Manage invoices</Link>
          </div>
          <div className="divide-y divide-line">
            {invoices.slice(0, 4).map((invoice) => (
              <div key={invoice.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <div>
                  <div className="text-sm font-semibold text-slate-900">{invoice.id}</div>
                  <div className="mt-1 text-xs text-slate-500">{invoice.company} • due {formatFinanceDate(invoice.dueDate)}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-slate-900">{formatFinanceCurrency(invoice.amount)}</span>
                  <FinanceStatusBadge status={invoice.status} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
