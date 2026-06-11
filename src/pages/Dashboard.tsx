import React, { useState } from 'react'
import {
  IndianRupee,
  Users,
  Target,
  Package,
  ShoppingCart,
  AlertTriangle,
  ArrowDown,
  UserPlus,
  FileText,
  TrendingUp,
  Award,
  AlertCircle
} from 'lucide-react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import PageHeader from '../components/common/PageHeader'
import StatCard from '../components/cards/StatCard'
import SectionHeader from '../components/common/SectionHeader'
import { formatINR, formatNumber } from '../lib/format'
import './Dashboard.css'

// --- Mock Data ---
const kpis = {
  revenue: 2545000,
  leads: 1240,
  customers: 850,
  products: 120,
  pendingOrders: 45,
  lowStock: 8,
}

const salesData = [
  { day: 'Mon', revenue: 45000, orders: 12 },
  { day: 'Tue', revenue: 52000, orders: 15 },
  { day: 'Wed', revenue: 38000, orders: 10 },
  { day: 'Thu', revenue: 65000, orders: 18 },
  { day: 'Fri', revenue: 58000, orders: 16 },
  { day: 'Sat', revenue: 85000, orders: 25 },
  { day: 'Sun', revenue: 72000, orders: 22 },
]

const funnelData = [
  { stage: 'New Leads', count: 1240, color: '#3b82f6' },
  { stage: 'Qualified Leads', count: 850, color: '#8b5cf6' },
  { stage: 'Opportunities', count: 420, color: '#f59e0b' },
  { stage: 'Converted Customers', count: 180, color: '#10b981' },
]

const topProducts = [
  { id: 1, name: 'Wireless Noise-Canceling Headphones', sold: 450, revenue: 1125000 },
  { id: 2, name: 'Smart Fitness Watch Pro', sold: 320, revenue: 640000 },
  { id: 3, name: 'Ergonomic Office Chair', sold: 210, revenue: 1050000 },
  { id: 4, name: 'Mechanical Gaming Keyboard', sold: 185, revenue: 277500 },
]

const lowStockProducts = [
  { id: 1, name: 'USB-C Fast Charging Cable', stock: 12, minStock: 50 },
  { id: 2, name: 'Ultra-thin Laptop Stand', stock: 5, minStock: 20 },
  { id: 3, name: 'Bluetooth Speaker Mini', stock: 8, minStock: 30 },
]

const customerOverview = [
  { name: 'New', value: 35, color: '#10b981' },
  { name: 'Returning', value: 65, color: '#3b82f6' },
]

const tasks = [
  { id: 1, title: 'Follow-up with Enterprise Lead', desc: 'Call regarding bulk order quotation.', status: 'pending' },
  { id: 2, title: 'Approve Pending Invoices', desc: 'Review 5 new vendor invoices.', status: 'inprogress' },
  { id: 3, title: 'Weekly Sales Sync', desc: 'Team meeting at 2:00 PM.', status: 'completed' },
  { id: 4, title: 'Restock Alert Processing', desc: 'Order placed for 3 low stock items.', status: 'completed' },
]

const activities = [
  { id: 1, action: 'Lead Created', user: 'System', time: '10 mins ago', icon: Target, iconColor: '#3b82f6' },
  { id: 2, action: 'Deal Won: ₹1.2L', user: 'Rahul Sharma', time: '1 hour ago', icon: Award, iconColor: '#10b981' },
  { id: 3, action: 'Customer Registered', user: 'Web Portal', time: '2 hours ago', icon: UserPlus, iconColor: '#8b5cf6' },
  { id: 4, action: 'Stock Updated', user: 'Inventory Bot', time: '4 hours ago', icon: Package, iconColor: '#f59e0b' },
  { id: 5, action: 'Invoice Generated', user: 'Priya Patel', time: '5 hours ago', icon: FileText, iconColor: '#0ea5e9' },
]

const insights = [
  { text: '15 new leads received today, highest this week.', icon: Target },
  { text: '3 customers successfully converted in the last 24 hours.', icon: UserPlus },
  { text: 'Revenue hit ₹85,000 yesterday, marking a 12% increase.', icon: TrendingUp },
  { text: 'Attention: 3 popular products are running critically low on stock.', icon: AlertCircle },
]

export default function Dashboard() {
  const [timeframe, setTimeframe] = useState('7d') // 7d, 30d, 12m

  return (
    <div className="dashboard-container">
      <PageHeader
        eyebrow="E-Commerce CRM"
        title="Business Dashboard"
        subtitle="Quick overview of your sales performance, leads, and operational tasks."
      />

      {/* Row 1: KPI Cards */}
      <div className="dashboard-stats-grid">
        <StatCard label="Total Revenue" value={formatINR(kpis.revenue, { compact: true })} delta={12.5} hint="vs last month" icon={IndianRupee} accent="#3b82f6" />
        <StatCard label="Total Leads" value={formatNumber(kpis.leads)} delta={8.2} hint="vs last month" icon={Target} accent="#8b5cf6" />
        <StatCard label="Total Customers" value={formatNumber(kpis.customers)} delta={5.4} hint="vs last month" icon={Users} accent="#10b981" />
        <StatCard label="Total Products" value={formatNumber(kpis.products)} delta={0} hint="active catalog" icon={Package} accent="#06b6d4" />
        <StatCard label="Pending Orders" value={formatNumber(kpis.pendingOrders)} delta={-2.4} invertDelta hint="requires processing" icon={ShoppingCart} accent="#f59e0b" />
        <StatCard label="Low Stock" value={formatNumber(kpis.lowStock)} delta={15.0} invertDelta hint="needs attention" icon={AlertTriangle} accent="#f43f5e" />
      </div>

      {/* Row 2: Sales Trend Chart | Lead Funnel */}
      <div className="dashboard-split-grid">
        <div className="dashboard-section dashboard-col-span-2">
          <div className="flex items-center justify-between mb-4">
            <SectionHeader title="Sales Performance" subtitle="Revenue & Order trends over time." />
            <select
              className="text-sm border-gray-300 rounded-md bg-gray-50 border px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="12m">Last 12 Months</option>
            </select>
          </div>
          <div className="dashboard-chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData} margin={{ left: 0, right: 10, top: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#64748b" tickLine={false} axisLine={false} fontSize={12} dy={10} />
                <YAxis yAxisId="left" stroke="#64748b" tickLine={false} axisLine={false} fontSize={12} dx={-10} tickFormatter={(val) => `₹${val / 1000}k`} />
                <YAxis yAxisId="right" orientation="right" stroke="#64748b" tickLine={false} axisLine={false} fontSize={12} dx={10} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  formatter={(value: any, name: any) => [name === 'revenue' ? formatINR(value) : value, name === 'revenue' ? 'Revenue' : 'Orders']}
                />
                <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dashboard-section">
          <SectionHeader title="Lead Conversion Funnel" subtitle="Current pipeline stages." />
          <div className="dashboard-funnel">
            {funnelData.map((stage, i) => {
              const percentage = i === 0 ? 100 : Math.round((stage.count / funnelData[0].count) * 100)
              return (
                <React.Fragment key={stage.stage}>
                  <div className="dashboard-funnel-step">
                    <div className="dashboard-funnel-step-label">
                      <div style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: stage.color }}></div>
                      {stage.stage}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{percentage}%</span>
                      <span className="dashboard-funnel-step-val">{formatNumber(stage.count)}</span>
                    </div>
                  </div>
                  {i < funnelData.length - 1 && (
                    <div className="dashboard-funnel-arrow">
                      <ArrowDown className="h-4 w-4" />
                    </div>
                  )}
                </React.Fragment>
              )
            })}
          </div>
        </div>
      </div>

      {/* Row 3: Top Selling Products | Low Stock Alerts */}
      <div className="dashboard-split-grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
        <div className="dashboard-section">
          <SectionHeader title="Top Selling Products" subtitle="Highest revenue generators this month." />
          <div className="dashboard-table-wrap mt-4">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Units Sold</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((p) => (
                  <tr key={p.id}>
                    <td className="font-medium text-slate-800">{p.name}</td>
                    <td>{formatNumber(p.sold)}</td>
                    <td className="font-semibold text-emerald-600">{formatINR(p.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="dashboard-section">
          <SectionHeader title="Low Stock Alerts" subtitle="Items below minimum threshold." />
          <div className="dashboard-table-wrap mt-4">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Current Stock</th>
                  <th>Min Stock</th>
                </tr>
              </thead>
              <tbody>
                {lowStockProducts.map((p) => (
                  <tr key={p.id} className="low-stock-row">
                    <td className="font-medium text-rose-900">{p.name}</td>
                    <td className="font-bold text-rose-600">{p.stock}</td>
                    <td className="text-slate-500">{p.minStock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Row 4: Customer Overview | Today's Tasks */}
      <div className="dashboard-split-grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
        <div className="dashboard-section flex flex-col">
          <SectionHeader title="Customer Overview" subtitle="Demographics & Growth." />
          <div className="flex-1 flex items-center justify-center mt-4 gap-8">
            <div style={{ width: 160, height: 160 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={customerOverview}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {customerOverview.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <div className="text-sm text-slate-500 font-medium uppercase">Total Customers</div>
                <div className="text-3xl font-bold text-slate-800">{formatNumber(kpis.customers)}</div>
              </div>
              <div className="flex flex-col gap-2">
                {customerOverview.map((c) => (
                  <div key={c.name} className="flex items-center gap-2 text-sm font-medium text-slate-600">
                    <div style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: c.color }} />
                    {c.name}: {c.value}%
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <SectionHeader title="Today's Tasks" subtitle="Your pending actionable items." />
          <div className="dashboard-task-list">
            {tasks.map((t) => (
              <div key={t.id} className="dashboard-task-item">
                <div className="dashboard-task-content">
                  <div className="dashboard-task-title">{t.title}</div>
                  <div className="dashboard-task-desc">{t.desc}</div>
                </div>
                <div className={`task-status-badge task-${t.status}`}>
                  {t.status === 'inprogress' ? 'In Progress' : t.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 5: Quick Insights | Recent Activities */}
      <div className="dashboard-split-grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
        <div className="dashboard-section">
          <SectionHeader title="Today's Business Summary" subtitle="Automatically generated insights from your data." />
          <ul className="dashboard-insights-list">
            {insights.map((insight, idx) => {
              const Icon = insight.icon
              return (
                <li key={idx} className="dashboard-insights-item">
                  <Icon className="dashboard-insights-icon h-5 w-5 flex-shrink-0" />
                  <span>{insight.text}</span>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="dashboard-section">
          <SectionHeader title="Recent Activities" subtitle="Latest actions across the CRM." />
          <div className="dashboard-activity-feed">
            {activities.map((act) => {
              const Icon = act.icon
              return (
                <div key={act.id} className="dashboard-activity-item">
                  <div className="dashboard-activity-icon">
                    <Icon className="h-4 w-4" style={{ color: act.iconColor }} />
                  </div>
                  <div className="dashboard-activity-content">
                    <div className="dashboard-activity-text">
                      <strong>{act.action}</strong> by {act.user}
                    </div>
                    <div className="dashboard-activity-time">{act.time}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
