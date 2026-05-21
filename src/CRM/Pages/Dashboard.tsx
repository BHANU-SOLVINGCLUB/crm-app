import {
  ArrowRight,
  Megaphone,
  Target,
  Briefcase,
  Wallet,
  Headphones,
  Sparkles,
  TrendingUp,
  Users,
  CircleDollarSign,
  Activity,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import PageHeader from '../Components/PageHeader'
import StatCard from '../Components/StatCard'
import SectionHeader from '../Components/SectionHeader'
import { useIndustryStore, useCurrentIndustry } from '../store/industryStore'
import { normalizeIndustryKey } from '../data/industries'
import { marketingByIndustry } from '../data/marketing'
import { leadsByIndustry } from '../data/leads'
import { formatINR, formatNumber } from '../lib/format'
import './Dashboard.css'

const workflow = [
  { label: 'Marketing', icon: '📢', to: '/marketing', active: true },
  { label: 'Lead Capture', icon: '🎯', to: '/leads', active: true },
  { label: 'Qualification', icon: '🧠', to: '#', active: false },
  { label: 'Sales Pipeline', icon: '💼', to: '#', active: false },
  { label: 'Quotation', icon: '📄', to: '#', active: false },
  { label: 'Deal Closure', icon: '🤝', to: '#', active: false },
  { label: 'Invoice', icon: '💳', to: '#', active: false },
  { label: 'Delivery', icon: '⚙️', to: '#', active: false },
  { label: 'Support', icon: '🎧', to: '#', active: false },
  { label: 'Feedback', icon: '⭐', to: '#', active: false },
  { label: 'Renewal', icon: '🔧', to: '#', active: false },
  { label: 'Retention', icon: '📈', to: '#', active: false },
]

const modules = [
  { label: 'Marketing Engine', icon: Megaphone, to: '/marketing', desc: 'Platforms, creatives, campaigns, funnels.', accent: '#3b82f6', live: true },
  { label: 'Lead Capture', icon: Target, to: '/leads', desc: 'Sheet-based lead inbox with industry fields.', accent: '#10b981', live: true },
  { label: 'Sales Pipeline', icon: Briefcase, to: '#', desc: 'Stages, quotes, forecasts, win/loss.', accent: '#8b5cf6', live: false },
  { label: 'Finance', icon: Wallet, to: '#', desc: 'Invoices, subscriptions, GST reports.', accent: '#f59e0b', live: false },
  { label: 'Customer Care', icon: Headphones, to: '#', desc: 'Help desk, tickets, SLA, knowledge base.', accent: '#ec4899', live: false },
  { label: 'Retention & Loyalty', icon: Sparkles, to: '#', desc: 'Renewals, upsells, referrals, VIP.', accent: '#06b6d4', live: false },
]

export default function Dashboard() {
  const industry = useCurrentIndustry()
  const industryKey = useIndustryStore((s) => s.current)
  const safeIndustryKey = normalizeIndustryKey(industryKey)
  const m = marketingByIndustry[safeIndustryKey]
  const leadCount = leadsByIndustry[safeIndustryKey].rows.length

  return (
    <div className="dashboard-container">
      <PageHeader
        eyebrow="Command Center"
        title={`${industry.name} workspace`}
        subtitle={`Modular CRM ecosystem tuned for ${industry.tagline.toLowerCase()}. Switch industries from the top bar to see every page adapt.`}
        actions={
          <Link to="/marketing" className="dashboard-btn-primary">
            Open Marketing
            <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      <div className="dashboard-stats-grid">
        <StatCard label="Marketing Spend" value={formatINR(m.stats.totalSpend, { compact: true })} delta={m.stats.spendDelta} hint="MTD" icon={CircleDollarSign} accent="#3b82f6" />
        <StatCard label="Leads Generated" value={formatNumber(m.stats.totalLeads)} delta={m.stats.leadsDelta} hint="MTD" icon={Users} accent="#10b981" />
        <StatCard label="Sample Inbox" value={formatNumber(leadCount)} hint="rows in lead sheet" icon={Activity} accent="#8b5cf6" />
        <StatCard label="ROI Multiplier" value={`${m.stats.roi.toFixed(1)}x`} delta={m.stats.conversionsDelta} hint="vs last month" icon={TrendingUp} accent="#f59e0b" />
      </div>

      {/* Workflow strip */}
      <div className="dashboard-section">
        <SectionHeader
          title="End-to-end business workflow"
          subtitle="From marketing to retention — every stage planned, two live today."
        />
        <div className="dashboard-workflow-grid">
          {workflow.map((w) => (
            <Link
              key={w.label}
              to={w.active ? w.to : '#'}
              onClick={(e) => !w.active && e.preventDefault()}
              className={`dashboard-workflow-card ${w.active ? 'active' : 'inactive'}`}
            >
              <div className="dashboard-workflow-icon">{w.icon}</div>
              <div className={`dashboard-workflow-label ${w.active ? 'active' : 'inactive'}`}>
                {w.label}
              </div>
              {!w.active && (
                <div className="dashboard-workflow-roadmap">Roadmap</div>
              )}
              {w.active && (
                <div className="dashboard-workflow-dot" />
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Mini perf + Modules */}
      <div className="dashboard-split-grid">
        <div className="dashboard-section dashboard-split-chart">
          <SectionHeader title="Lead trend (7 days)" subtitle="Auto-shaped to the active industry template." />
          <div className="dashboard-chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={m.stats.trend} margin={{ left: -16, right: 8, top: 4, bottom: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="day" stroke="#64748b" tickLine={false} axisLine={false} fontSize={11} />
                <YAxis stroke="#64748b" tickLine={false} axisLine={false} fontSize={11} />
                <Tooltip
                  contentStyle={{ background: '#0c1424', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, fontSize: 12 }}
                />
                <Line type="monotone" dataKey="leads" stroke={industry.accent} strokeWidth={2.5} dot={{ r: 3, fill: industry.accent }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dashboard-section">
          <SectionHeader title="Industry templates" subtitle="Active fields & flows change with the switcher." />
          <div className="dashboard-template-content">
            <div className="dashboard-template-header">
              <div className="dashboard-template-label">Currently loaded</div>
              <div className="dashboard-template-title">
                <span style={{ color: industry.accent }}>●</span>
                {industry.name} template
              </div>
              <p className="dashboard-template-desc">{industry.tagline}</p>
            </div>
            <ul className="dashboard-template-list">
              <li className="dashboard-template-list-item"><span className="dashboard-template-check">✓</span> Lead sheet columns</li>
              <li className="dashboard-template-list-item"><span className="dashboard-template-check">✓</span> Marketing platforms & creatives</li>
              <li className="dashboard-template-list-item"><span className="dashboard-template-check">✓</span> Campaign objectives</li>
              <li className="dashboard-template-list-item"><span className="dashboard-template-check">✓</span> Conversion funnel stages</li>
              <li className="dashboard-template-list-item"><span className="dashboard-template-check">✓</span> ROI & CPL benchmarks</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modules grid */}
      <div className="dashboard-section">
        <SectionHeader title="CRM modules" subtitle="Plug & play modules. Click any active module to dive in." />
        <div className="dashboard-modules-grid">
          {modules.map((m) => {
            const Icon = m.icon
            const Wrapper: React.ElementType = m.live ? Link : 'div'
            const props = m.live ? { to: m.to } : {}
            return (
              <Wrapper
                key={m.label}
                {...props}
                className={`dashboard-module-card ${m.live ? 'live' : 'soon'}`}
              >
                <div className="dashboard-module-header">
                  <div
                    className="dashboard-module-icon-wrap"
                    style={{ background: `${m.accent}22`, color: m.accent }}
                  >
                    <Icon className="dashboard-module-icon" strokeWidth={1.8} />
                  </div>
                  {m.live ? (
                    <span className="chip !text-emerald-600 bg-emerald-50">● Live</span>
                  ) : (
                    <span className="chip">Soon</span>
                  )}
                </div>
                <div className="dashboard-module-title">{m.label}</div>
                <p className="dashboard-module-desc">{m.desc}</p>
                {m.live && (
                  <div className="dashboard-module-link">
                    Open module <ArrowRight className="dashboard-module-link-icon" />
                  </div>
                )}
              </Wrapper>
            )
          })}
        </div>
      </div>
    </div>
  )
}
