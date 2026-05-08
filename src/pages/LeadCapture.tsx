import { useMemo, useState } from 'react'
import {
  Plus,
  Filter,
  Search,
  Trash2,
  RotateCcw,
  Download,
  Upload,
  CheckCircle2,
  Users,
  Sparkles,
} from 'lucide-react'
import clsx from 'clsx'
import PageHeader from '../components/ui/PageHeader'
import { useIndustryStore, useCurrentIndustry } from '../store/industryStore'
import { leadsByIndustry, type LeadColumn, type LeadRow } from '../data/leads'
import { formatINR, formatNumber } from '../lib/format'

const statusToneCycle = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4', '#f43f5e']

function statusTone(status: string, statuses: string[]) {
  const idx = Math.max(0, statuses.indexOf(status))
  return statusToneCycle[idx % statusToneCycle.length]
}

function CellRenderer({
  col,
  value,
  onChange,
  statuses,
}: {
  col: LeadColumn
  value: string | number
  onChange: (v: string | number) => void
  statuses: string[]
}) {
  if (col.type === 'select' && col.options) {
    const isStatus = col.key === 'status'
    const tone = isStatus ? statusTone(String(value), statuses) : null
    return (
      <div className="relative h-full w-full">
        <select
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
          className="cell-input appearance-none cursor-pointer pr-6"
          style={isStatus && tone ? { color: tone, fontWeight: 600 } : undefined}
        >
          {col.options.map((o) => (
            <option key={o} value={o} className="bg-[#0c1424] text-white">
              {o}
            </option>
          ))}
        </select>
      </div>
    )
  }
  if (col.type === 'currency') {
    return (
      <input
        type="number"
        value={String(value ?? '')}
        onChange={(e) => onChange(Number(e.target.value))}
        className="cell-input text-right tabular-nums"
        placeholder="0"
      />
    )
  }
  if (col.type === 'number') {
    return (
      <input
        type="number"
        value={String(value ?? '')}
        onChange={(e) => onChange(Number(e.target.value))}
        className="cell-input tabular-nums"
      />
    )
  }
  if (col.type === 'date') {
    return (
      <input
        type="date"
        value={String(value ?? '')}
        onChange={(e) => onChange(e.target.value)}
        className="cell-input tabular-nums"
      />
    )
  }
  return (
    <input
      value={String(value ?? '')}
      onChange={(e) => onChange(e.target.value)}
      className="cell-input"
      type={col.type === 'email' ? 'email' : col.type === 'phone' ? 'tel' : 'text'}
    />
  )
}

export default function LeadCapture() {
  const industry = useCurrentIndustry()
  const industryKey = useIndustryStore((s) => s.current)
  const getLeads = useIndustryStore((s) => s.getLeads)
  const setLeads = useIndustryStore((s) => s.setLeads)
  const resetLeads = useIndustryStore((s) => s.resetLeads)

  const schema = leadsByIndustry[industryKey].schema
  const rows = getLeads(industryKey)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [selected, setSelected] = useState<Set<number>>(new Set())

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return rows
      .map((r, i) => ({ row: r, i }))
      .filter(({ row }) => {
        if (statusFilter !== 'All' && row.status !== statusFilter) return false
        if (!q) return true
        return Object.values(row).some((v) => String(v).toLowerCase().includes(q))
      })
  }, [rows, search, statusFilter])

  const stats = useMemo(() => {
    const total = rows.length
    const bySource = rows.reduce<Record<string, number>>((acc, r) => {
      const s = String(r.source ?? '—')
      acc[s] = (acc[s] || 0) + 1
      return acc
    }, {})
    const topSource = Object.entries(bySource).sort((a, b) => b[1] - a[1])[0]
    const valueKey = schema.columns.find((c) => c.type === 'currency')?.key
    const totalValue = valueKey ? rows.reduce((s, r) => s + (Number(r[valueKey]) || 0), 0) : 0
    const won = rows.filter((r) => ['Won', 'Booked', 'Admitted', 'Confirmed', 'Signed', 'Ordered', 'PO Received', 'Closed'].includes(String(r.status))).length
    return { total, topSource, totalValue, valueKey, won }
  }, [rows, schema])

  const updateCell = (rowIdx: number, key: string, val: string | number) => {
    const next = rows.map((r, i) => (i === rowIdx ? { ...r, [key]: val } : r))
    setLeads(industryKey, next)
  }

  const addRow = () => {
    const blank: LeadRow = {}
    schema.columns.forEach((c) => {
      blank[c.key] = c.type === 'currency' || c.type === 'number' ? 0 : c.type === 'select' ? c.options?.[0] ?? '' : ''
    })
    blank.status = schema.statuses[0]
    setLeads(industryKey, [blank, ...rows])
  }

  const deleteSelected = () => {
    if (selected.size === 0) return
    const next = rows.filter((_, i) => !selected.has(i))
    setLeads(industryKey, next)
    setSelected(new Set())
  }

  const toggleSelect = (i: number) => {
    const next = new Set(selected)
    if (next.has(i)) next.delete(i)
    else next.add(i)
    setSelected(next)
  }

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) setSelected(new Set())
    else setSelected(new Set(filtered.map((f) => f.i)))
  }

  return (
    <div className="px-5 lg:px-8 py-6 lg:py-8">
      <PageHeader
        eyebrow="Lead Capture"
        title="Sheet-based lead command center"
        subtitle={`Capture, enrich and triage every inquiry — fields are auto-tuned for ${industry.name.toLowerCase()}.`}
        actions={
          <>
            <button className="btn-ghost" onClick={() => resetLeads(industryKey)} title="Reset to sample data">
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
            <button className="btn-ghost">
              <Upload className="h-4 w-4" />
              Import
            </button>
            <button className="btn-primary" onClick={addRow}>
              <Plus className="h-4 w-4" />
              New Lead
            </button>
          </>
        }
      />

      {/* Mini stat strip */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <MiniStat label="Total leads" value={formatNumber(stats.total)} accent="#3b82f6" icon={<Users className="h-4 w-4" />} />
        <MiniStat
          label="Top source"
          value={stats.topSource ? stats.topSource[0] : '—'}
          hint={stats.topSource ? `${stats.topSource[1]} leads` : ''}
          accent="#10b981"
          icon={<Sparkles className="h-4 w-4" />}
        />
        <MiniStat
          label="Won / Closed"
          value={formatNumber(stats.won)}
          hint={stats.total ? `${((stats.won / stats.total) * 100).toFixed(1)}% conversion` : ''}
          accent="#8b5cf6"
          icon={<CheckCircle2 className="h-4 w-4" />}
        />
        <MiniStat
          label="Pipeline value"
          value={formatINR(stats.totalValue, { compact: true })}
          hint={stats.valueKey ? `Sum of ${schema.columns.find((c) => c.key === stats.valueKey)?.label}` : ''}
          accent="#f59e0b"
          icon={<Sparkles className="h-4 w-4" />}
        />
      </div>

      {/* Toolbar */}
      <div className="card p-3 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search across all fields…"
              className="input pl-9"
            />
          </div>

          <div className="flex items-center gap-1 ml-auto flex-wrap">
            <span className="chip"><Filter className="h-3 w-3" /> Status</span>
            <button
              onClick={() => setStatusFilter('All')}
              className={clsx(
                'rounded-full px-3 py-1.5 text-[11.5px] font-semibold transition border',
                statusFilter === 'All'
                  ? 'bg-white/10 border-white/15 text-white'
                  : 'bg-transparent border-white/10 text-slate-400 hover:text-white hover:border-white/20'
              )}
            >
              All
            </button>
            {schema.statuses.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={clsx(
                  'rounded-full px-3 py-1.5 text-[11.5px] font-semibold transition border',
                  statusFilter === s
                    ? 'bg-white/10 border-white/15 text-white'
                    : 'bg-transparent border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                )}
                style={statusFilter === s ? { color: statusTone(s, schema.statuses) } : undefined}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {selected.size > 0 && (
              <button
                onClick={deleteSelected}
                className="btn-ghost !text-brand-pink hover:!bg-brand-pink/10"
              >
                <Trash2 className="h-4 w-4" />
                Delete ({selected.size})
              </button>
            )}
            <button className="btn-ghost">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Sheet */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-auto max-h-[68vh]">
          <table className="sheet">
            <thead>
              <tr>
                <th className="row-num !text-center">
                  <input
                    type="checkbox"
                    checked={filtered.length > 0 && selected.size === filtered.length}
                    onChange={toggleSelectAll}
                    className="accent-blue-500"
                  />
                </th>
                <th style={{ width: 44 }}>#</th>
                {schema.columns.map((col) => (
                  <th key={col.key} style={{ minWidth: col.width ?? 140 }}>
                    {col.label}
                  </th>
                ))}
                <th style={{ width: 60 }} />
              </tr>
            </thead>
            <tbody>
              {filtered.map(({ row, i }, displayIdx) => (
                <tr key={i} className={selected.has(i) ? 'selected' : undefined}>
                  <td className="row-num !text-center">
                    <input
                      type="checkbox"
                      checked={selected.has(i)}
                      onChange={() => toggleSelect(i)}
                      className="accent-blue-500"
                    />
                  </td>
                  <td className="row-num">{displayIdx + 1}</td>
                  {schema.columns.map((col) => (
                    <td key={col.key}>
                      <CellRenderer
                        col={col}
                        value={row[col.key] as string | number}
                        onChange={(v) => updateCell(i, col.key, v)}
                        statuses={schema.statuses}
                      />
                    </td>
                  ))}
                  <td className="row-num">
                    <button
                      onClick={() => {
                        const next = rows.filter((_, j) => j !== i)
                        setLeads(industryKey, next)
                      }}
                      className="text-slate-500 hover:text-brand-pink transition"
                    >
                      <Trash2 className="h-3.5 w-3.5 mx-auto" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={schema.columns.length + 3} className="text-center py-12 text-slate-500">
                    No leads match your filters. Try clearing search or status.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-line flex items-center justify-between text-[12px] text-slate-400 bg-black/20">
          <div>
            Showing <span className="text-white font-semibold">{filtered.length}</span> of{' '}
            <span className="text-white font-semibold">{rows.length}</span> leads
            {selected.size > 0 && <> · <span className="text-brand-blue">{selected.size}</span> selected</>}
          </div>
          <div className="flex items-center gap-2">
            <span className="chip">⌨ Click any cell to edit</span>
            <span className="chip">💾 Auto-saved locally</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function MiniStat({
  label,
  value,
  hint,
  accent,
  icon,
}: {
  label: string
  value: string
  hint?: string
  accent: string
  icon: React.ReactNode
}) {
  return (
    <div className="card-soft p-4 flex items-center gap-4">
      <div
        className="h-11 w-11 rounded-xl flex items-center justify-center"
        style={{ background: `${accent}22`, color: accent }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold">{label}</div>
        <div className="text-[20px] font-bold leading-tight truncate">{value}</div>
        {hint && <div className="text-[11.5px] text-slate-400 mt-0.5">{hint}</div>}
      </div>
    </div>
  )
}
