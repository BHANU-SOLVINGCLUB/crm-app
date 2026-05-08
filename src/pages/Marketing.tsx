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
import clsx from 'clsx'
import PageHeader from '../components/ui/PageHeader'
import SectionHeader from '../components/ui/SectionHeader'
import StatCard from '../components/ui/StatCard'
import { useIndustryStore, useCurrentIndustry } from '../store/industryStore'
import { marketingByIndustry } from '../data/marketing'
import { formatCompact, formatINR, formatNumber } from '../lib/format'

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
  Draft: 'bg-white/5 text-slate-400 border-white/10',
  Review: 'bg-brand-purple/15 text-brand-purple border-brand-purple/30',
  Completed: 'bg-white/5 text-slate-400 border-white/10',
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
    <div className="px-5 lg:px-8 py-6 lg:py-8">
      <PageHeader
        eyebrow="Marketing Engine"
        title={`Run growth for ${industry.name}`}
        subtitle={`Live view of platforms, creatives, campaigns and performance — tuned for ${industry.tagline.toLowerCase()}.`}
        actions={
          <>
            <button className="btn-ghost">
              <Filter className="h-4 w-4" /> Filter
            </button>
            <button className="btn-primary">
              <Plus className="h-4 w-4" /> New Campaign
            </button>
          </>
        }
      />

      {/* Stat strip */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-7">
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
      <div className="grid gap-5 lg:grid-cols-3 mb-8">
        <div className="card p-5 lg:col-span-2">
          <SectionHeader
            title="Performance trend"
            subtitle="Daily leads, spend and conversions across all channels."
            right={
              <div className="flex items-center gap-2">
                <span className="chip">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-blue" /> Leads
                </span>
                <span className="chip">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-purple" /> Conversions
                </span>
                <span className="chip">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" /> Spend
                </span>
              </div>
            }
          />
          <div className="h-[260px]">
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

        <div className="card p-5">
          <SectionHeader title="Conversion funnel" subtitle={`Stages tuned for ${industry.name.toLowerCase()}.`} />
          <div className="space-y-3">
            {data.stats.funnel.map((step, i) => {
              const max = data.stats.funnel[0].value
              const pct = (step.value / max) * 100
              const color = ['#3b82f6', '#06b6d4', '#10b981', '#8b5cf6', '#ec4899'][i % 5]
              return (
                <div key={step.stage}>
                  <div className="flex items-center justify-between text-[12.5px] mb-1.5">
                    <span className="text-slate-300 font-medium">{step.stage}</span>
                    <span className="text-slate-400">{formatNumber(step.value)}</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-white/[0.04] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${Math.max(pct, 3)}%`, background: color }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-5 pt-4 border-t border-line flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand-purple" />
            <span className="text-[12.5px] text-slate-300">
              ROI multiplier: <span className="font-semibold text-white">{data.stats.roi.toFixed(1)}x</span>
            </span>
          </div>
        </div>
      </div>

      {/* Platforms */}
      <div className="card p-5 mb-8">
        <SectionHeader
          title="Platforms in play"
          subtitle="Channels driving leads and conversions across this industry."
          right={
            <span className="chip">
              <Activity className="h-3 w-3" /> Live data
            </span>
          }
        />

        <div className="grid gap-5 lg:grid-cols-5">
          <div className="lg:col-span-2 grid gap-3 grid-cols-1 sm:grid-cols-2">
            {data.platforms.map((p) => (
              <div
                key={p.name}
                className="rounded-2xl border border-line bg-white/[0.025] p-4 hover:bg-white/[0.05] transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-9 w-9 rounded-xl flex items-center justify-center text-[16px]"
                      style={{ background: `${p.color}22`, color: p.color }}
                    >
                      {p.icon}
                    </span>
                    <div>
                      <div className="text-[13.5px] font-semibold leading-tight">{p.name}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">CPL {formatINR(p.cpl, { compact: true })}</div>
                    </div>
                  </div>
                  <span className="chip">{p.ctr.toFixed(1)}% CTR</span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-[10.5px] uppercase tracking-wider text-slate-500">Spend</div>
                    <div className="text-[13px] font-semibold mt-0.5">{formatINR(p.spend, { compact: true })}</div>
                  </div>
                  <div>
                    <div className="text-[10.5px] uppercase tracking-wider text-slate-500">Leads</div>
                    <div className="text-[13px] font-semibold mt-0.5">{formatNumber(p.leads)}</div>
                  </div>
                  <div>
                    <div className="text-[10.5px] uppercase tracking-wider text-slate-500">Conv.</div>
                    <div className="text-[13px] font-semibold mt-0.5">{formatNumber(p.conversions)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-3 rounded-2xl border border-line bg-white/[0.02] p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[13px] font-semibold text-slate-200">Leads share by platform</div>
              <span className="text-[11px] text-slate-400">Last 30 days</span>
            </div>
            <div className="h-[260px]">
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
      <div className="card p-5 mb-8">
        <SectionHeader
          title="Creatives library"
          subtitle="Every ad, banner, video and lead magnet running for this industry."
          right={
            <div className="flex flex-wrap items-center gap-1.5">
              {(['All', 'Live', 'Paused', 'Draft', 'Review'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setCreativeFilter(f)}
                  className={clsx(
                    'rounded-full px-3 py-1.5 text-[11.5px] font-semibold transition border',
                    creativeFilter === f
                      ? 'bg-white/10 border-white/15 text-white'
                      : 'bg-transparent border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          }
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCreatives.map((c) => {
            const Icon = creativeIcon[c.type] ?? ImageIcon
            return (
              <div key={c.id} className="rounded-2xl border border-line overflow-hidden bg-white/[0.02] hover:bg-white/[0.04] transition group">
                <div
                  className="h-[140px] flex items-center justify-center text-[64px] relative"
                  style={{
                    background: `linear-gradient(135deg, ${industry.accent}22, #0c172a)`,
                  }}
                >
                  <span className="opacity-90">{c.thumbnail}</span>
                  <span
                    className={clsx(
                      'absolute top-3 left-3 rounded-full border px-2 py-0.5 text-[10.5px] font-semibold',
                      statusColors[c.status]
                    )}
                  >
                    {c.status}
                  </span>
                  <span className="absolute top-3 right-3 chip !text-[10.5px]">
                    <Icon className="h-3 w-3" strokeWidth={2.2} /> {c.type}
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-[14px] font-semibold leading-tight line-clamp-2">{c.title}</div>
                      <div className="text-[11.5px] text-slate-400 mt-1">{c.platform} · {c.id}</div>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center border-t border-line pt-3">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-500">Impr.</div>
                      <div className="text-[12.5px] font-semibold mt-0.5">{formatCompact(c.impressions)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-500">Clicks</div>
                      <div className="text-[12.5px] font-semibold mt-0.5">{formatCompact(c.clicks)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-500">CTR</div>
                      <div className="text-[12.5px] font-semibold mt-0.5">{c.ctr.toFixed(1)}%</div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Campaigns */}
      <div className="card p-5">
        <SectionHeader
          title="Active campaigns"
          subtitle="Goal-driven, multi-channel campaigns with budgets, reach and pipeline impact."
          right={
            <div className="flex items-center gap-1.5">
              {(['All', 'Running', 'Scheduled', 'Paused', 'Completed'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setCampaignFilter(f)}
                  className={clsx(
                    'rounded-full px-3 py-1.5 text-[11.5px] font-semibold transition border',
                    campaignFilter === f
                      ? 'bg-white/10 border-white/15 text-white'
                      : 'bg-transparent border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          }
        />

        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px]">
            <thead>
              <tr className="text-[10.5px] uppercase tracking-widest text-slate-500">
                <th className="text-left font-semibold py-2 pl-2">Campaign</th>
                <th className="text-left font-semibold py-2">Channel</th>
                <th className="text-left font-semibold py-2">Objective</th>
                <th className="text-left font-semibold py-2">Status</th>
                <th className="text-left font-semibold py-2">Budget</th>
                <th className="text-left font-semibold py-2">Reach</th>
                <th className="text-left font-semibold py-2">Leads</th>
                <th className="text-left font-semibold py-2">Conv.</th>
                <th className="text-left font-semibold py-2">Window</th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.map((c) => {
                const pct = c.budget ? Math.min(100, (c.spent / c.budget) * 100) : 0
                return (
                  <tr key={c.id} className="text-[13px] border-t border-line hover:bg-white/[0.02]">
                    <td className="py-3 pl-2">
                      <div className="font-semibold">{c.name}</div>
                      <div className="text-[11.5px] text-slate-500">{c.id}</div>
                    </td>
                    <td className="py-3 text-slate-300">{c.channel}</td>
                    <td className="py-3"><span className="chip">{c.objective}</span></td>
                    <td className="py-3">
                      <span
                        className={clsx(
                          'rounded-full border px-2 py-0.5 text-[11px] font-semibold inline-flex items-center gap-1',
                          statusColors[c.status]
                        )}
                      >
                        {c.status === 'Running' ? <PlayCircle className="h-3 w-3" /> : c.status === 'Paused' ? <PauseCircle className="h-3 w-3" /> : <Calendar className="h-3 w-3" />}
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 min-w-[170px]">
                      <div className="flex items-center justify-between text-[11.5px] text-slate-400 mb-1">
                        <span>{formatINR(c.spent, { compact: true })}</span>
                        <span>{formatINR(c.budget, { compact: true })}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden w-[150px]">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${pct}%`,
                            background: pct > 90 ? '#f59e0b' : '#3b82f6',
                          }}
                        />
                      </div>
                    </td>
                    <td className="py-3 text-slate-300">{formatCompact(c.reach)}</td>
                    <td className="py-3 text-slate-300 font-semibold">
                      <span className="inline-flex items-center gap-1">
                        <MousePointerClick className="h-3.5 w-3.5 text-brand-blue" />
                        {formatNumber(c.leads)}
                      </span>
                    </td>
                    <td className="py-3 text-brand-green font-semibold">{formatNumber(c.conversions)}</td>
                    <td className="py-3 text-[11.5px] text-slate-400">
                      {c.startDate} <span className="text-slate-600">→</span> {c.endDate}
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
