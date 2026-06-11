import { Sparkles } from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { monthlyFinanceData, revenueSegments } from '../../services/mockFinanceData'
import { formatFinanceCurrency } from '../../utils/formatters'

const regionData = [
  { name: 'South', revenue: 9600000, margin: 32 },
  { name: 'West', revenue: 7400000, margin: 28 },
  { name: 'North', revenue: 6800000, margin: 26 },
  { name: 'East', revenue: 4200000, margin: 21 },
]

export default function RevenueAnalyticsPage() {
  return (
    <div className="space-y-6 fade-up">
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="card p-5">
          <h3 className="text-lg font-semibold text-theme-primary">Monthly revenue</h3>
          <div className="mt-4 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyFinanceData} margin={{ left: -18, right: 8, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="financeRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
                <Tooltip formatter={(value) => formatFinanceCurrency(Number(value))} />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2.5} fill="url(#financeRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="card p-5">
          <h3 className="text-lg font-semibold text-theme-primary">Quarterly growth & cash flow</h3>
          <div className="mt-4 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyFinanceData} margin={{ left: -18, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
                <Tooltip formatter={(value) => formatFinanceCurrency(Number(value))} />
                <Legend />
                <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="cashFlow" stroke="#8b5cf6" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <section className="card p-5">
          <h3 className="text-lg font-semibold text-theme-primary">Revenue by region</h3>
          <div className="mt-4 space-y-4">
            {regionData.map((region) => (
              <div key={region.name}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-theme-primary">{region.name}</span>
                  <span className="font-semibold text-theme-primary">{formatFinanceCurrency(region.revenue, true)} • {region.margin}% margin</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-theme-surface">
                  <div className="h-full rounded-full bg-gradient-to-r from-brand-blue to-sky-400" style={{ width: `${region.margin * 2.4}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="card p-5">
          <h3 className="text-lg font-semibold text-theme-primary">AI insight placeholders</h3>
          <div className="mt-4 space-y-3">
            {[
              `Enterprise revenue concentration is ${revenueSegments[0].value}% and should be watched for renewal risk.`,
              'Cash flow improved for three consecutive periods after reminder automation changes.',
              'Marketing and software costs remain within healthy spend-to-revenue thresholds.',
            ].map((insight) => (
              <div key={insight} className="rounded-2xl border border-dashed border-brand-blue/20 bg-blue-50/60 p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 h-4 w-4 text-brand-blue" />
                  <p className="text-sm leading-6 text-theme-primary">{insight}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
