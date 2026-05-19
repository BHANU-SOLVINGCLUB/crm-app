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
import PageHeader from '../components/ui/PageHeader'
import StatCard from '../components/ui/StatCard'
import SectionHeader from '../components/ui/SectionHeader'
import { useIndustryStore, useCurrentIndustry } from '../store/industryStore'
import { marketingByIndustry } from '../data/marketing'
import { leadsByIndustry } from '../data/leads'
import { formatINR, formatNumber } from '../lib/format'

const workflow = [
  { label: 'Marketing', icon: '📣', to: '/marketing', active: true },
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
  const m = marketingByIndustry[industryKey]
  const leadCount = leadsByIndustry[industryKey].rows.length

  return (
    <div className="px-5 lg:px-8 py-6 lg:py-8">
      <PageHeader
        eyebrow="Command Center"
        title={`${industry.name} workspace`}
        subtitle={`Modular CRM ecosystem tuned for ${industry.tagline.toLowerCase()}. Switch industries from the top bar to see every page adapt.`}
        actions={
          <Link to="/marketing" className="btn-primary">
            Open Marketing
            <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-7">
        <StatCard label="Marketing Spend" value={formatINR(m.stats.totalSpend, { compact: true })} delta={m.stats.spendDelta} hint="MTD" icon={CircleDollarSign} accent="#3b82f6" />
        <StatCard label="Leads Generated" value={formatNumber(m.stats.totalLeads)} delta={m.stats.leadsDelta} hint="MTD" icon={Users} accent="#10b981" />
        <StatCard label="Sample Inbox" value={formatNumber(leadCount)} hint="rows in lead sheet" icon={Activity} accent="#8b5cf6" />
        <StatCard label="ROI Multiplier" value={`${m.stats.roi.toFixed(1)}x`} delta={m.stats.conversionsDelta} hint="vs last month" icon={TrendingUp} accent="#f59e0b" />
      </div>

      {/* Workflow strip */}
      <div className="card p-5 mb-7">
        <SectionHeader
          title="End-to-end business workflow"
          subtitle="From marketing to retention — every stage planned, two live today."
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {workflow.map((w) => (
            <Link
              key={w.label}
              to={w.active ? w.to : '#'}
              onClick={(e) => !w.active && e.preventDefault()}
              className={`group relative rounded-2xl border p-3.5 text-center transition ${
                w.active
                  ? 'bg-white border-line shadow-sm hover:border-brand/40 hover:-translate-y-0.5'
                  : 'border-dashed border-line bg-slate-50/50 cursor-not-allowed opacity-60'
              }`}
            >
              <div className="text-[24px]">{w.icon}</div>
              <div className={`mt-1.5 text-[12px] font-semibold ${w.active ? 'text-slate-800' : 'text-slate-400'}`}>
                {w.label}
              </div>
              {!w.active && (
                <div className="text-[9px] uppercase tracking-widest text-slate-400 mt-1">Roadmap</div>
              )}
              {w.active && (
                <div className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-emerald-500 live-dot" />
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Mini perf + Modules */}
      <div className="grid gap-5 lg:grid-cols-3 mb-7">
        <div className="card p-5 lg:col-span-2">
          <SectionHeader title="Lead trend (7 days)" subtitle="Auto-shaped to the active industry template." />
          <div className="h-[240px]">
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

        <div className="card p-5">
          <SectionHeader title="Industry templates" subtitle="Active fields & flows change with the switcher." />
          <div className="space-y-2.5">
            <div className="rounded-xl border border-line bg-white/[0.025] p-3">
              <div className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold">Currently loaded</div>
              <div className="mt-1 text-[15px] font-bold flex items-center gap-2">
                <span style={{ color: industry.accent }}>●</span>
                {industry.name} template
              </div>
              <p className="mt-1 text-[12px] text-slate-400">{industry.tagline}</p>
            </div>
            <ul className="space-y-1.5 text-[12.5px] text-slate-600">
              <li className="flex items-center gap-2"><span className="text-brand-green">✓</span> Lead sheet columns</li>
              <li className="flex items-center gap-2"><span className="text-brand-green">✓</span> Marketing platforms & creatives</li>
              <li className="flex items-center gap-2"><span className="text-brand-green">✓</span> Campaign objectives</li>
              <li className="flex items-center gap-2"><span className="text-brand-green">✓</span> Conversion funnel stages</li>
              <li className="flex items-center gap-2"><span className="text-brand-green">✓</span> ROI & CPL benchmarks</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modules grid */}
      <div className="card p-5">
        <SectionHeader title="CRM modules" subtitle="Plug & play modules. Click any active module to dive in." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => {
            const Icon = m.icon
            const Wrapper: React.ElementType = m.live ? Link : 'div'
            const props = m.live ? { to: m.to } : {}
            return (
              <Wrapper
                key={m.label}
                {...props}
                className={`group rounded-2xl border border-line p-5 transition ${
                  m.live
                    ? 'bg-white hover:border-brand/40 hover:-translate-y-0.5 cursor-pointer shadow-sm text-slate-800'
                    : 'bg-slate-50/50 opacity-60 border-dashed'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div
                    className="h-11 w-11 rounded-xl flex items-center justify-center"
                    style={{ background: `${m.accent}22`, color: m.accent }}
                  >
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
                  </div>
                  {m.live ? (
                    <span className="chip !text-emerald-600 bg-emerald-50">● Live</span>
                  ) : (
                    <span className="chip">Soon</span>
                  )}
                </div>
                <div className="mt-3 text-[16px] font-bold text-slate-900">{m.label}</div>
                <p className="text-[12.5px] text-slate-500 mt-1">{m.desc}</p>
                {m.live && (
                  <div className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-brand group-hover:gap-2 transition-all">
                    Open module <ArrowRight className="h-3.5 w-3.5" />
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
