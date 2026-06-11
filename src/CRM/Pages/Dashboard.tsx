import React, { useMemo, useState } from 'react'
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
  AlertCircle,
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
  Cell,
  BarChart,
  Bar,
} from 'recharts'

import PageHeader from '../Components/PageHeader'
import StatCard from '../Components/StatCard'
import SectionHeader from '../Components/SectionHeader'
import { formatINR, formatNumber } from '../lib/format'
import type { ActivityEntry } from '../store/crmStore'
import { useDashboardData } from '../store/useDashboardData'
import { dailyOrdersTrend, monthlyRevenueTrend, ordersByStatus, topSellingProducts } from '../orders/orderData'
import './Dashboard.css'

function getActivityIcon(iconType: ActivityEntry['iconType']) {
  switch (iconType) {
    case 'lead':     return Target
    case 'customer': return UserPlus
    case 'product':  return Package
    case 'order':    return ShoppingCart
    case 'award':    return Award
    case 'task':     return FileText
    default:         return Target
  }
}

function timeAgo(dateStr: string): string {
  const diffMs  = Date.now() - new Date(dateStr).getTime()
  const mins    = Math.floor(diffMs / 60_000)
  if (mins < 1)  return 'just now'
  if (mins < 60) return `${mins} min${mins !== 1 ? 's' : ''} ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)  return `${hrs} hour${hrs !== 1 ? 's' : ''} ago`
  const days = Math.floor(hrs / 24)
  return `${days} day${days !== 1 ? 's' : ''} ago`
}

export default function Dashboard() {
  const [timeframe, setTimeframe] = useState('7d')

  const {
    kpis,
    salesData,
    funnelData,
    topProducts,
    lowStockProducts,
    customerOverview,
    recentActivities,
    tasks,
    customers,
    orders,
  } = useDashboardData(timeframe)

  const insights = useMemo(() => {
    const {
      totalLeads,
      qualifiedLeads,
      convertedLeads,
      totalRevenue,
      pendingOrders,
      lowStock,
    } = kpis
    const completedCount = orders.filter((o) => o.status === 'Delivered').length
    const activeAccounts = customers.filter(
      (c) => c.status === 'Active' || c.status === 'VIP'
    ).length
    return [
      {
        text: `${totalLeads} total leads — ${qualifiedLeads} qualified, ${convertedLeads} converted.`,
        icon: Target,
      },
      {
        text: `${customers.length} customers on record with ${activeAccounts} active accounts.`,
        icon: UserPlus,
      },
      {
        text: `Total revenue: ${formatINR(totalRevenue, { compact: true })} across ${completedCount} completed orders.`,
        icon: TrendingUp,
      },
      lowStock > 0
        ? {
            text: `Attention: ${lowStock} product${lowStock !== 1 ? 's' : ''} running at or below reorder level.`,
            icon: AlertCircle,
          }
        : {
            text: `Inventory healthy. ${pendingOrders} order${pendingOrders !== 1 ? 's' : ''} pending fulfilment.`,
            icon: AlertCircle,
          },
    ]
  }, [kpis, customers, orders])

  const funnelBaseCount = funnelData[0]?.count ?? 0
  const orderStatusChart = useMemo(() => ordersByStatus(orders), [orders])
  const dailyOrderTrend = useMemo(() => dailyOrdersTrend(orders), [orders])
  const monthlyRevenueChart = useMemo(() => monthlyRevenueTrend(orders), [orders])
  const ecommerceTopProducts = useMemo(() => topSellingProducts(orders), [orders])

  return (
    <div className="dashboard-container">
      <PageHeader
        eyebrow="E-Commerce CRM"
        title="Business Dashboard"
        subtitle="Quick overview of your sales performance, leads, and operational tasks."
      />

      <div className="dashboard-stats-grid">
        <StatCard
          label="Total Orders"
          value={formatNumber(kpis.totalOrders)}
          delta={0}
          hint={`${kpis.pendingOrders} pending`}
          icon={ShoppingCart}
          accent="#2563eb"
        />
        <StatCard
          label="Delivered Orders"
          value={formatNumber(kpis.deliveredOrders)}
          delta={0}
          hint="fulfilled successfully"
          icon={Award}
          accent="#10b981"
        />
        <StatCard
          label="Cancelled Orders"
          value={formatNumber(kpis.cancelledOrders)}
          delta={0}
          invertDelta
          hint="needs review"
          icon={AlertTriangle}
          accent="#f43f5e"
        />
        <StatCard
          label="Today's Revenue"
          value={formatINR(kpis.todayRevenue, { compact: true })}
          delta={0}
          hint="from order activity"
          icon={IndianRupee}
          accent="#0f766e"
        />
        <StatCard
          label="Monthly Revenue"
          value={formatINR(kpis.monthlyRevenue, { compact: true })}
          delta={kpis.revenueDelta}
          hint="current month"
          icon={TrendingUp}
          accent="#7c3aed"
        />
        <StatCard
          label="Avg Order Value"
          value={formatINR(kpis.averageOrderValue, { compact: true })}
          delta={0}
          hint="revenue orders"
          icon={FileText}
          accent="#d97706"
        />
      </div>

      <div className="dashboard-stats-grid">
        <StatCard
          label="Total Revenue"
          value={formatINR(kpis.totalRevenue, { compact: true })}
          delta={kpis.revenueDelta}
          hint="vs last 7 days"
          icon={IndianRupee}
          accent="#3b82f6"
        />
        <StatCard
          label="Total Leads"
          value={formatNumber(kpis.totalLeads)}
          delta={0}
          hint={`${kpis.qualifiedLeads} qualified · ${kpis.convertedLeads} converted`}
          icon={Target}
          accent="#8b5cf6"
        />
        <StatCard
          label="Total Customers"
          value={formatNumber(kpis.totalCustomers)}
          delta={0}
          hint="active accounts"
          icon={Users}
          accent="#10b981"
        />
        <StatCard
          label="Total Products"
          value={formatNumber(kpis.totalProducts)}
          delta={0}
          hint="active catalog"
          icon={Package}
          accent="#06b6d4"
        />
        <StatCard
          label="Pending Orders"
          value={formatNumber(kpis.pendingOrders)}
          delta={0}
          invertDelta
          hint="requires processing"
          icon={ShoppingCart}
          accent="#f59e0b"
        />
        <StatCard
          label="Low Stock"
          value={formatNumber(kpis.lowStock)}
          delta={0}
          invertDelta
          hint={`${kpis.outOfStock} out of stock`}
          icon={AlertTriangle}
          accent="#f43f5e"
        />
      </div>

      <div className="dashboard-split-grid">
        <div className="dashboard-section">
          <SectionHeader title="Orders by Status" subtitle="Live distribution from the Orders module." />
          <div className="dashboard-chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={orderStatusChart} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={94} label>
                  {orderStatusChart.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="dashboard-section dashboard-col-span-2">
          <SectionHeader title="Daily Orders Trend" subtitle="Order volume and revenue over the last 14 days." />
          <div className="dashboard-chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyOrderTrend} margin={{ left: 0, right: 10, top: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#64748b" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis stroke="#64748b" tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip formatter={(value: unknown, name: unknown) => [name === 'revenue' ? formatINR(Number(value)) : String(value), name === 'revenue' ? 'Revenue' : 'Orders']} />
                <Line type="monotone" dataKey="orders" stroke="#2563eb" strokeWidth={3} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="dashboard-split-grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
        <div className="dashboard-section">
          <SectionHeader title="Monthly Revenue" subtitle="Commerce revenue for the last six months." />
          <div className="dashboard-chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenueChart} margin={{ left: 0, right: 10, top: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis stroke="#64748b" tickLine={false} axisLine={false} fontSize={12} tickFormatter={(val) => `₹${Math.round(Number(val) / 1000)}k`} />
                <Tooltip formatter={(value: unknown) => formatINR(Number(value))} />
                <Bar dataKey="revenue" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="dashboard-section">
          <SectionHeader title="Top Selling Products" subtitle="Units and revenue from order line items." />
          <div className="dashboard-table-wrap mt-4">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Units</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {ecommerceTopProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="font-medium text-slate-800">{product.name}</td>
                    <td>{product.sku}</td>
                    <td>{formatNumber(product.sold)}</td>
                    <td className="font-semibold text-emerald-600">{formatINR(product.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="dashboard-split-grid">
        <div className="dashboard-section dashboard-col-span-2">
          <div className="flex items-center justify-between mb-4">
            <SectionHeader
              title="Sales Performance"
              subtitle="Revenue & Order trends over time."
            />
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
              <LineChart
                data={salesData}
                margin={{ left: 0, right: 10, top: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="day"
                  stroke="#64748b"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  dy={10}
                />
                <YAxis
                  yAxisId="left"
                  stroke="#64748b"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  dx={-10}
                  tickFormatter={(val) => `₹${Math.round(val / 1000)}k`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#64748b"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  dx={10}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                  }}
                  formatter={(value: unknown, name: unknown) => [
                    name === 'revenue'
                      ? formatINR(Number(value))
                      : String(value),
                    name === 'revenue' ? 'Revenue' : 'Orders',
                  ]}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="orders"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dashboard-section">
          <SectionHeader
            title="Lead Conversion Funnel"
            subtitle="Counts by current lead status."
          />
          <div className="dashboard-funnel">
            {funnelData.map((stage, i) => {
              const percentage =
                i === 0
                  ? 100
                  : funnelBaseCount > 0
                  ? Math.round((stage.count / funnelBaseCount) * 100)
                  : 0
              return (
                <React.Fragment key={stage.stage}>
                  <div className="dashboard-funnel-step">
                    <div className="dashboard-funnel-step-label">
                      <div
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: 6,
                          backgroundColor: stage.color,
                        }}
                      />
                      {stage.stage}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        {percentage}%
                      </span>
                      <span className="dashboard-funnel-step-val">
                        {formatNumber(stage.count)}
                      </span>
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

      <div
        className="dashboard-split-grid"
        style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}
      >
        <div className="dashboard-section">
          <SectionHeader
            title="Top Selling Products"
            subtitle="Highest revenue generators from orders."
          />
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
                {topProducts.length > 0 ? (
                  topProducts.map((p) => (
                    <tr key={p.id}>
                      <td className="font-medium text-slate-800">{p.name}</td>
                      <td>{formatNumber(p.sold)}</td>
                      <td className="font-semibold text-emerald-600">
                        {formatINR(p.revenue)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center text-slate-400 py-4">
                      No completed orders yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="dashboard-section">
          <SectionHeader
            title="Low Stock Alerts"
            subtitle="Items at or below reorder threshold."
          />
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
                {lowStockProducts.length > 0 ? (
                  lowStockProducts.map((p) => (
                    <tr key={p.id} className="low-stock-row">
                      <td className="font-medium text-rose-900">{p.name}</td>
                      <td className="font-bold text-rose-600">{p.stock}</td>
                      <td className="text-slate-500">{p.minStock}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center text-slate-400 py-4">
                      All products adequately stocked.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div
        className="dashboard-split-grid"
        style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}
      >
        <div className="dashboard-section flex flex-col">
          <SectionHeader title="Customer Overview" subtitle="Status breakdown." />
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
                <div className="text-sm text-slate-500 font-medium uppercase">
                  Total Customers
                </div>
                <div className="text-3xl font-bold text-slate-800">
                  {formatNumber(kpis.totalCustomers)}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {customerOverview.map((c) => (
                  <div
                    key={c.name}
                    className="flex items-center gap-2 text-sm font-medium text-slate-600"
                  >
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: c.color,
                      }}
                    />
                    {c.name}: {c.value}%
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <SectionHeader
            title="Today's Tasks"
            subtitle="Your pending actionable items."
          />
          <div className="dashboard-task-list">
            {tasks.slice(0, 4).map((t) => (
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

      <div
        className="dashboard-split-grid"
        style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}
      >
        <div className="dashboard-section">
          <SectionHeader
            title="Today's Business Summary"
            subtitle="Automatically generated insights from your data."
          />
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
          <SectionHeader
            title="Recent Activities"
            subtitle="Latest actions across the CRM."
          />
          <div className="dashboard-activity-feed">
            {recentActivities.map((act) => {
              const Icon = getActivityIcon(act.iconType)
              return (
                <div key={act.id} className="dashboard-activity-item">
                  <div className="dashboard-activity-icon">
                    <Icon className="h-4 w-4" style={{ color: act.iconColor }} />
                  </div>
                  <div className="dashboard-activity-content">
                    <div className="dashboard-activity-text">
                      <strong>{act.action}</strong>
                      {act.user ? ` by ${act.user}` : ''}
                    </div>
                    <div className="dashboard-activity-time">
                      {timeAgo(act.createdAt)}
                    </div>
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
