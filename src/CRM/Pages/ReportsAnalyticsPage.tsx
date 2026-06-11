import { BarChart3, CircleDollarSign, Headphones, TrendingUp, Users } from 'lucide-react'
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
import PageHeader from '../Components/PageHeader'
import './EnterpriseSuite.css'

const revenueTrend = [
  { month: 'Jan', revenue: 420, customers: 180 },
  { month: 'Feb', revenue: 510, customers: 214 },
  { month: 'Mar', revenue: 620, customers: 251 },
  { month: 'Apr', revenue: 690, customers: 286 },
  { month: 'May', revenue: 780, customers: 318 },
  { month: 'Jun', revenue: 860, customers: 351 },
]

const reportGroups = [
  { title: 'Sales Reports', metrics: ['Revenue', 'Conversion', 'Top Products'] },
  { title: 'Customer Reports', metrics: ['Retention', 'Churn', 'Health Score'] },
  { title: 'Support Reports', metrics: ['Ticket Trends', 'Resolution Time', 'SLA Breaches'] },
  { title: 'Finance Reports', metrics: ['Cash Flow', 'Profit', 'Tax Reports'] },
]

export default function ReportsAnalyticsPage() {
  return (
    <div className="suite-page">
      <PageHeader
        eyebrow="Reports & Analytics"
        title="Executive dashboard"
        subtitle="CEO view across revenue, customers, growth, tickets, projects, cash flow, profit, conversion, retention, and churn."
        actions={<button className="btn-primary" type="button"><BarChart3 size={16} /> Export Report</button>}
      />

      <div className="suite-grid four">
        <div className="suite-panel suite-panel-pad suite-kpi"><div><div className="suite-kpi-label">Revenue</div><div className="suite-kpi-value">$860k</div><div className="suite-kpi-note">+14.2% this quarter</div></div><div className="suite-icon"><CircleDollarSign size={20} /></div></div>
        <div className="suite-panel suite-panel-pad suite-kpi"><div><div className="suite-kpi-label">Customers</div><div className="suite-kpi-value">351</div><div className="suite-kpi-note">91% retention</div></div><div className="suite-icon"><Users size={20} /></div></div>
        <div className="suite-panel suite-panel-pad suite-kpi"><div><div className="suite-kpi-label">Growth</div><div className="suite-kpi-value">27%</div><div className="suite-kpi-note">Pipeline-backed forecast</div></div><div className="suite-icon"><TrendingUp size={20} /></div></div>
        <div className="suite-panel suite-panel-pad suite-kpi"><div><div className="suite-kpi-label">Open tickets</div><div className="suite-kpi-value">64</div><div className="suite-kpi-note">7 critical escalations</div></div><div className="suite-icon"><Headphones size={20} /></div></div>
      </div>

      <section className="suite-section suite-grid two">
        <div className="suite-panel suite-panel-pad">
          <h2 className="suite-section-title">Revenue and customers</h2>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueTrend} margin={{ left: -20, right: 10, top: 10 }}>
                <CartesianGrid stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#1a56db" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="customers" stroke="#16a34a" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="suite-panel suite-panel-pad">
          <h2 className="suite-section-title">Conversion by module</h2>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { module: 'Leads', value: 62 },
                { module: 'Sales', value: 38 },
                { module: 'Support', value: 91 },
                { module: 'Finance', value: 76 },
              ]}>
                <CartesianGrid stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="module" stroke="#64748b" tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#1a56db" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="suite-section">
        <div className="suite-grid four">
          {reportGroups.map((group) => (
            <div className="suite-panel suite-panel-pad" key={group.title}>
              <div className="suite-name">{group.title}</div>
              <div className="suite-task-meta">
                {group.metrics.map((metric) => <span className="suite-pill" key={metric}>{metric}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
