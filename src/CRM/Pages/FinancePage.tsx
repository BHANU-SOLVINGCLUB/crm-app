import {
  Wallet,
  Download,
  Filter,
  Columns,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts'
import PageHeader from '../Components/PageHeader'
import SectionHeader from '../Components/SectionHeader'
import StatCard from '../Components/StatCard'
import { financeData } from '../data/finance'

export default function FinancePage() {
  const { metrics, chartData, segments, invoiceHealth, invoices, transactions, expenses } = financeData

  return (
    <div className="px-5 lg:px-8 py-6 lg:py-8 space-y-6">
      <PageHeader
        eyebrow="Financial Overview"
        title="Finance"
        subtitle="Track revenue, invoices, payments & expenses — all in one live sheet."
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
          label="Total revenue"
          value={metrics.totalRevenue}
          hint={metrics.revenueDelta}
          icon={TrendingUp}
          accent="#10b981"
        />
        <StatCard
          label="Outstanding"
          value={metrics.outstanding}
          hint={metrics.outstandingAction}
          icon={AlertCircle}
          accent="#f43f5e"
        />
        <StatCard
          label="Collected this month"
          value={metrics.collected}
          hint={metrics.collectedDelta}
          icon={CheckCircle2}
          accent="#10b981"
        />
        <StatCard
          label="Net profit (est.)"
          value={metrics.netProfit}
          hint={metrics.netProfitDesc}
          icon={Wallet}
          accent="#8b5cf6"
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <SectionHeader title="Monthly revenue vs expenses (₹L)" />
          <div className="h-[280px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ left: -20, right: 0, top: 10, bottom: 0 }}>
                <CartesianGrid stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" tickLine={false} axisLine={false} fontSize={11} />
                <YAxis stroke="#64748b" tickLine={false} axisLine={false} fontSize={11} />
                <Tooltip
                  cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                  contentStyle={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 8, fontSize: 12, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="expenses" name="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="card p-5 flex-1">
            <SectionHeader title="Revenue by segment" />
            <div className="space-y-4 mt-4">
              {segments.map((seg) => (
                <div key={seg.name}>
                  <div className="flex justify-between text-[13px] mb-1.5">
                    <span className="text-slate-600 font-medium">{seg.name}</span>
                    <span className="font-semibold text-slate-800">{seg.amount}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${seg.value}%`, backgroundColor: seg.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <SectionHeader title="Invoice health" />
            <div className="grid grid-cols-4 gap-2 mt-4 text-center">
              <div>
                <div className="text-xl font-bold text-emerald-500">{invoiceHealth.paid}</div>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5">Paid</div>
              </div>
              <div>
                <div className="text-xl font-bold text-amber-500">{invoiceHealth.pending}</div>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5">Pending</div>
              </div>
              <div>
                <div className="text-xl font-bold text-rose-500">{invoiceHealth.overdue}</div>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5">Overdue</div>
              </div>
              <div>
                <div className="text-xl font-bold text-slate-400">{invoiceHealth.draft}</div>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5">Draft</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="card flex flex-col">
        {/* Table Header / Tabs */}
        <div className="px-5 py-3 border-b border-line flex items-center justify-between bg-slate-50/50">
          <div className="flex space-x-1">
            {['All invoices 36', 'Paid 22', 'Pending 8', 'Overdue 4', 'Draft'].map((tab, i) => (
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
                <th>Invoice</th>
                <th>Customer</th>
                <th>Company</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv, idx) => (
                <tr key={inv.id}>
                  <td className="text-center">
                    <input type="checkbox" className="rounded border-slate-300 text-brand-blue focus:ring-brand-blue" />
                  </td>
                  <td className="row-num">{idx + 1}</td>
                  <td>
                    <div className="flex items-center gap-2 px-3">
                      <div
                        className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                        style={{ backgroundColor: inv.color }}
                      >
                        {inv.initials}
                      </div>
                      <span className="text-brand-blue font-medium hover:underline cursor-pointer">{inv.id}</span>
                    </div>
                  </td>
                  <td className="font-medium text-slate-800 px-3">{inv.customer}</td>
                  <td className="text-slate-500 px-3">{inv.company}</td>
                  <td className="font-semibold text-slate-800 px-3">{inv.amount}</td>
                  <td className="px-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                        inv.status === 'Paid'
                          ? 'bg-emerald-100 text-emerald-700'
                          : inv.status === 'Pending'
                          ? 'bg-amber-100 text-amber-700'
                          : inv.status === 'Overdue'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-5 py-3 border-t border-line flex items-center justify-between text-[13px] text-slate-500 bg-slate-50/50">
          <div>Showing 1–8 of 36 invoices</div>
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
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="card p-0">
          <div className="px-5 py-4 border-b border-line flex justify-between items-center">
            <h3 className="font-semibold text-slate-800 text-[15px]">Recent transactions</h3>
            <a href="#" className="text-[13px] text-brand-blue font-medium hover:underline">View all</a>
          </div>
          <div className="divide-y divide-line">
            {transactions.map((tx, i) => (
              <div key={i} className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div
                    className="h-9 w-9 rounded-full flex items-center justify-center text-[13px] font-bold text-white"
                    style={{ backgroundColor: tx.color }}
                  >
                    {tx.initials}
                  </div>
                  <div>
                    <div className="font-medium text-slate-800 text-[14px]">{tx.name}</div>
                    <div className="text-[12px] text-slate-500 mt-0.5 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {tx.type}
                    </div>
                  </div>
                </div>
                <div className={`font-semibold ${tx.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {tx.amount}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-0">
          <div className="px-5 py-4 border-b border-line flex justify-between items-center">
            <h3 className="font-semibold text-slate-800 text-[15px]">Expense breakdown</h3>
            <span className="text-[13px] text-slate-500">This month · ₹63.2 L</span>
          </div>
          <div className="divide-y divide-line">
            {expenses.map((exp, i) => (
              <div key={i} className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3 text-[14px]">
                  <div className="h-2 w-2 rounded-full bg-slate-300" />
                  <span className="font-medium text-slate-800">{exp.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-slate-800">{exp.amount}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{exp.percentage}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


