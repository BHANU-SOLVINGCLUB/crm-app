 import { useMemo, useState } from 'react'
import {
  Activity,
  CircleDollarSign,
  MousePointerClick,
  Target,
  TrendingUp,
  Users,
  Filter,
  Plus,
  Image as ImageIcon,
  Video,
  Layers,
  FileText,
  Mail,
  Sparkles,
  Calendar,
  PauseCircle,
  PlayCircle,
} from 'lucide-react'
import {
  ResponsiveContainer,
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
  Cell,
} from 'recharts'
import PageHeader from '../Components/PageHeader'
import SectionHeader from '../Components/SectionHeader'
import StatCard from '../Components/StatCard'
import { useIndustryStore, useCurrentIndustry } from '../store/industryStore'
import { pushAppToast } from '../store/uiStore'
import { marketingByIndustry } from '../data/marketing'
import { formatCompact, formatINR, formatNumber } from '../lib/format'
import './Marketing.css'

const creativeIcon: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  Image: ImageIcon,
  Video: Video,
  Carousel: Layers,
  Reel: Video,
  Story: ImageIcon,
  Banner: ImageIcon,
  PDF: FileText,
  Email: Mail,
}

const statusColors: Record<string, string> = {
  Live: 'bg-brand-green/15 text-brand-green border-brand-green/30',
  Running: 'bg-brand-green/15 text-brand-green border-brand-green/30',
  Scheduled: 'bg-brand-blue/15 text-brand-blue border-brand-blue/30',
  Paused: 'bg-brand-orange/15 text-brand-orange border-brand-orange/30',
  Draft: 'bg-white/5 text-theme-muted border-white/10',
  Review: 'bg-brand-purple/15 text-brand-purple border-brand-purple/30',
  Completed: 'bg-white/5 text-theme-muted border-white/10',
}

export default function Marketing() {
  const industry = useCurrentIndustry()
  const industryKey = useIndustryStore((s) => s.current)
  const data = marketingByIndustry[industryKey]
  const [creativeFilter, setCreativeFilter] = useState<'All' | 'Live' | 'Paused' | 'Draft' | 'Review'>('All')
  const [campaignFilter, setCampaignFilter] = useState<'All' | 'Running' | 'Scheduled' | 'Paused' | 'Completed'>('All')

  const filteredCreatives = useMemo(() => {
    if (creativeFilter === 'All') return data.creatives
    return data.creatives.filter((c) => c.status === creativeFilter)
  }, [data.creatives, creativeFilter])

  const filteredCampaigns = useMemo(() => {
    if (campaignFilter === 'All') return data.campaigns
    return data.campaigns.filter((c) => c.status === campaignFilter)
  }, [data.campaigns, campaignFilter])

  const platformChartData = data.platforms.map((p) => ({ name: p.name, value: p.leads, color: p.color }))

  return (
    <div className="marketing-container">
      <PageHeader
        eyebrow="Marketing Engine"
        title={`Run growth for ${industry.name}`}
        subtitle={`Live view of platforms, creatives, campaigns and performance — tuned for ${industry.tagline.toLowerCase()}.`}
        actions={
          <div className="marketing-header-actions">
            <button
              className="btn-ghost"
              onClick={() => {
                const next = creativeFilter === 'All' ? 'Live' : 'All'
                setCreativeFilter(next)
                setCampaignFilter(next === 'All' ? 'All' : 'Running')
                pushAppToast(next === 'All' ? 'Marketing filters reset.' : 'Showing live creatives and running campaigns.', 'success')
              }}
            >
              <Filter className="h-4 w-4" /> Filter
            </button>
            <button className="btn-primary" onClick={() => pushAppToast(`New campaign workspace opened for ${industry.name}.`, 'success')}>
              <Plus className="h-4 w-4" /> New Campaign
            </button>
          </div>
        }
      />

      {/* Stat strip */}
      <div className="marketing-stats-grid">
        <StatCard
          label="Marketing Spend"
          value={formatINR(data.stats.totalSpend, { compact: true })}
          delta={data.stats.spendDelta}
          hint="vs last month"
          icon={CircleDollarSign}
          accent="#3b82f6"
        />
        <StatCard
          label="Leads Generated"
          value={formatNumber(data.stats.totalLeads)}
          delta={data.stats.leadsDelta}
          hint="this month"
          icon={Users}
          accent="#10b981"
        />
        <StatCard
          label="Conversions"
          value={formatNumber(data.stats.totalConversions)}
          delta={data.stats.conversionsDelta}
          hint="closed-won"
          icon={Target}
          accent="#8b5cf6"
        />
        <StatCard
          label="Avg. Cost / Lead"
          value={formatINR(data.stats.avgCpl, { compact: true })}
          delta={data.stats.cplDelta}
          invertDelta
          hint="lower is better"
          icon={TrendingUp}
          accent="#f59e0b"
        />
      </div>

      {/* Trend + Funnel */}
      <div className="marketing-split-grid">
        <div className="marketing-section marketing-split-chart">
          <SectionHeader
            title="Performance trend"
            subtitle="Daily leads, spend and conversions across all channels."
            right={
              <div className="marketing-chart-legend">
                <span className="chip">
                  <span className="marketing-legend-dot bg-brand-blue" /> Leads
                </span>
                <span className="chip">
                  <span className="marketing-legend-dot bg-brand-purple" /> Conversions
                </span>
                <span className="chip">
                  <span className="marketing-legend-dot bg-brand-orange" /> Spend
                </span>
              </div>
            }
          />
          <div className="marketing-chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.stats.trend} margin={{ left: -12, right: 8, top: 4, bottom: 0 }}>
                <defs>
                  <linearGradient id="leadsG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="convG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="day" stroke="#64748b" tickLine={false} axisLine={false} fontSize={11} />
                <YAxis stroke="#64748b" tickLine={false} axisLine={false} fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: '#0c1424',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  labelStyle={{ color: '#cbd5e1' }}
                />
                <Area type="monotone" dataKey="leads" stroke="#3b82f6" strokeWidth={2} fill="url(#leadsG)" />
                <Area type="monotone" dataKey="conversions" stroke="#8b5cf6" strokeWidth={2} fill="url(#convG)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="marketing-section">
          <SectionHeader title="Conversion funnel" subtitle={`Stages tuned for ${industry.name.toLowerCase()}.`} />
          <div className="marketing-funnel-list">
            {data.stats.funnel.map((step, i) => {
              const max = data.stats.funnel[0].value
              const pct = (step.value / max) * 100
              const color = ['#3b82f6', '#06b6d4', '#10b981', '#8b5cf6', '#ec4899'][i % 5]
              return (
                <div key={step.stage}>
                  <div className="marketing-funnel-row-header">
                    <span className="marketing-funnel-label">{step.stage}</span>
                    <span className="marketing-funnel-value">{formatNumber(step.value)}</span>
                  </div>
                  <div className="marketing-funnel-track">
                    <div
                      className="marketing-funnel-fill"
                      style={{ width: `${Math.max(pct, 3)}%`, background: color }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
          <div className="marketing-roi-footer">
            <Sparkles className="marketing-roi-icon" />
            <span className="marketing-roi-text">
              ROI multiplier: <span className="marketing-roi-value">{data.stats.roi.toFixed(1)}x</span>
            </span>
          </div>
        </div>
      </div>

      {/* Platforms */}
      <div className="marketing-section marketing-section-large">
        <SectionHeader
          title="Platforms in play"
          subtitle="Channels driving leads and conversions across this industry."
          right={
            <span className="chip">
              <Activity className="h-3 w-3" /> Live data
            </span>
          }
        />

        <div className="marketing-platforms-grid">
          <div className="marketing-platforms-cards">
            {data.platforms.map((p) => (
              <div
                key={p.name}
                className="marketing-platform-card"
              >
                <div className="marketing-platform-header">
                  <div className="marketing-platform-icon-wrap">
                    <span
                      className="marketing-platform-icon"
                      style={{ background: `${p.color}22`, color: p.color }}
                    >
                      {p.icon}
                    </span>
                    <div>
                      <div className="marketing-platform-title">{p.name}</div>
                      <div className="marketing-platform-subtitle">CPL {formatINR(p.cpl, { compact: true })}</div>
                    </div>
                  </div>
                  <span className="chip">{p.ctr.toFixed(1)}% CTR</span>
                </div>
                <div className="marketing-platform-metrics">
                  <div>
                    <div className="marketing-metric-label">Spend</div>
                    <div className="marketing-metric-value">{formatINR(p.spend, { compact: true })}</div>
                  </div>
                  <div>
                    <div className="marketing-metric-label">Leads</div>
                    <div className="marketing-metric-value">{formatNumber(p.leads)}</div>
                  </div>
                  <div>
                    <div className="marketing-metric-label">Conv.</div>
                    <div className="marketing-metric-value">{formatNumber(p.conversions)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="marketing-platforms-chart">
            <div className="marketing-chart-header">
              <div className="marketing-chart-title">Leads share by platform</div>
              <span className="marketing-chart-subtitle">Last 30 days</span>
            </div>
            <div className="marketing-chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={platformChartData} margin={{ left: -8, right: 8, top: 8, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    tickLine={false}
                    axisLine={false}
                    fontSize={10.5}
                    interval={0}
                    angle={-12}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis stroke="#64748b" tickLine={false} axisLine={false} fontSize={11} />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                    contentStyle={{
                      background: '#0c1424',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                    formatter={(value) => [formatNumber(Number(value)), 'Leads']}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {platformChartData.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Creatives */}
      <div className="marketing-section marketing-section-large">
        <SectionHeader
          title="Creatives library"
          subtitle="Every ad, banner, video and lead magnet running for this industry."
          right={
            <div className="marketing-filters">
              {(['All', 'Live', 'Paused', 'Draft', 'Review'] as const).map((f) => {
                const active = creativeFilter === f
                return (
                  <button
                    key={f}
                    onClick={() => setCreativeFilter(f)}
                    className={`marketing-filter-btn ${active ? 'active' : 'inactive'}`}
                  >
                    {f}
                  </button>
                )
              })}
            </div>
          }
        />

        <div className="marketing-creatives-grid">
          {filteredCreatives.map((c) => {
            const Icon = creativeIcon[c.type] ?? ImageIcon
            return (
              <div key={c.id} className="marketing-creative-card">
                <div
                  className="marketing-creative-thumb"
                  style={{
                    background: `linear-gradient(135deg, ${industry.accent}22, #0c172a)`,
                  }}
                >
                  <span className="marketing-creative-emoji">{c.thumbnail}</span>
                  <span
                    className={`marketing-creative-status ${statusColors[c.status]}`}
                  >
                    {c.status}
                  </span>
                  <span className="chip marketing-creative-type">
                    <Icon className="h-3 w-3" strokeWidth={2.2} /> {c.type}
                  </span>
                </div>
                <div className="marketing-creative-body">
                  <div className="marketing-creative-header">
                    <div>
                      <div className="marketing-creative-title">{c.title}</div>
                      <div className="marketing-creative-meta">{c.platform} · {c.id}</div>
                    </div>
                  </div>
                  <div className="marketing-creative-metrics">
                    <div>
                      <div className="marketing-metric-label">Impr.</div>
                      <div className="marketing-metric-value">{formatCompact(c.impressions)}</div>
                    </div>
                    <div>
                      <div className="marketing-metric-label">Clicks</div>
                      <div className="marketing-metric-value">{formatCompact(c.clicks)}</div>
                    </div>
                    <div>
                      <div className="marketing-metric-label">CTR</div>
                      <div className="marketing-metric-value">{c.ctr.toFixed(1)}%</div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Campaigns */}
      <div className="marketing-section">
        <SectionHeader
          title="Active campaigns"
          subtitle="Goal-driven, multi-channel campaigns with budgets, reach and pipeline impact."
          right={
            <div className="marketing-filters">
              {(['All', 'Running', 'Scheduled', 'Paused', 'Completed'] as const).map((f) => {
                const active = campaignFilter === f
                return (
                  <button
                    key={f}
                    onClick={() => setCampaignFilter(f)}
                    className={`marketing-filter-btn ${active ? 'active' : 'inactive'}`}
                  >
                    {f}
                  </button>
                )
              })}
            </div>
          }
        />

        <div className="marketing-table-container">
          <table className="marketing-table">
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Channel</th>
                <th>Objective</th>
                <th>Status</th>
                <th>Budget</th>
                <th>Reach</th>
                <th>Leads</th>
                <th>Conv.</th>
                <th>Window</th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.map((c) => {
                const pct = c.budget ? Math.min(100, (c.spent / c.budget) * 100) : 0
                return (
                  <tr key={c.id}>
                    <td>
                      <div className="marketing-campaign-name">{c.name}</div>
                      <div className="marketing-campaign-id">{c.id}</div>
                    </td>
                    <td className="marketing-campaign-channel">{c.channel}</td>
                    <td><span className="chip">{c.objective}</span></td>
                    <td>
                      <span
                        className={`marketing-status-badge ${statusColors[c.status]}`}
                      >
                        {c.status === 'Running' ? <PlayCircle className="h-3 w-3" /> : c.status === 'Paused' ? <PauseCircle className="h-3 w-3" /> : <Calendar className="h-3 w-3" />}
                        {c.status}
                      </span>
                    </td>
                    <td className="marketing-budget-cell">
                      <div className="marketing-budget-labels">
                        <span>{formatINR(c.spent, { compact: true })}</span>
                        <span>{formatINR(c.budget, { compact: true })}</span>
                      </div>
                      <div className="marketing-budget-track">
                        <div
                          className="marketing-budget-fill"
                          style={{
                            width: `${pct}%`,
                            background: pct > 90 ? '#f59e0b' : '#3b82f6',
                          }}
                        />
                      </div>
                    </td>
                    <td className="marketing-campaign-channel">{formatCompact(c.reach)}</td>
                    <td className="marketing-leads-cell">
                      <span className="marketing-leads-wrap">
                        <MousePointerClick className="h-3.5 w-3.5 text-brand-blue" />
                        {formatNumber(c.leads)}
                      </span>
                    </td>
                    <td className="marketing-conv-cell">{formatNumber(c.conversions)}</td>
                    <td className="marketing-window-cell">
                      {c.startDate} <span className="marketing-window-arrow">→</span> {c.endDate}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


