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

import PageHeader from '../Components/PageHeader'
import Drawer from '../Components/Drawer'
import Timeline from '../Components/Timeline'
import { useIndustryStore, useCurrentIndustry } from '../store/industryStore'
import { leadsByIndustry, type LeadColumn, type LeadRow } from '../data/leads'
import { normalizeIndustryKey } from '../data/industries'
import { formatINR, formatNumber } from '../lib/format'
import './LeadCapture.css'

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
            <option key={o} value={o} className="bg-white text-slate-800">
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
  const addLead = useIndustryStore((s) => s.addLead)
  const updateLead = useIndustryStore((s) => s.updateLead)
  const deleteLeads = useIndustryStore((s) => s.deleteLeads)
  const resetLeads = useIndustryStore((s) => s.resetLeads)

  const safeIndustryKey = normalizeIndustryKey(industryKey)
  const schema = leadsByIndustry[safeIndustryKey].schema
  const rows = getLeads(safeIndustryKey)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [selectedLeadIdx, setSelectedLeadIdx] = useState<number | null>(null)
  const [liveToast, setLiveToast] = useState<{ id: number, message: string } | null>(null)

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
    updateLead(safeIndustryKey, rowIdx, key, val)
  }

  const addRow = () => {
    const blank: LeadRow = {}
    schema.columns.forEach((c) => {
      blank[c.key] = c.type === 'currency' || c.type === 'number' ? 0 : c.type === 'select' ? c.options?.[0] ?? '' : ''
    })
    blank.status = schema.statuses[0]
    addLead(safeIndustryKey, blank)
  }

  const simulateRealtimeEvent = () => {
    const blank: LeadRow = {}
    schema.columns.forEach((c) => {
      if (c.type === 'currency' || c.type === 'number') blank[c.key] = 0
      else if (c.type === 'select') blank[c.key] = c.options?.[0] ?? ''
      else blank[c.key] = ''
    })
    const names = ['Acme Corp', 'Stark Industries', 'Wayne Enterprises', 'Globex']
    blank.name = names[Math.floor(Math.random() * names.length)] + ' (Live Event)'
    blank.source = 'API Webhook'
    blank.status = schema.statuses[0]
    addLead(safeIndustryKey, blank)
    
    const toastId = Date.now()
    setLiveToast({ id: toastId, message: 'New lead incoming via Webhook...' })
    setTimeout(() => {
      setLiveToast(current => current?.id === toastId ? null : current)
    }, 4000)
  }


  const deleteSelected = () => {
    if (selected.size === 0) return
    deleteLeads(safeIndustryKey, selected)
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
    <div className="leads-container">
      <PageHeader
        eyebrow="Lead Capture"
        title="Sheet-based lead command center"
        subtitle={`Capture, enrich and triage every inquiry — fields are auto-tuned for ${industry.name.toLowerCase()}.`}
        actions={
          <>
            <button className="btn-ghost" onClick={() => resetLeads(safeIndustryKey)} title="Reset to sample data">
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
            <button className="btn-ghost">
              <Upload className="h-4 w-4" />
              Import
            </button>
            <button className="btn-ghost leads-simulate-btn" onClick={simulateRealtimeEvent}>
              <Sparkles className="h-4 w-4" />
              Simulate Live
            </button>
            <button className="btn-primary" onClick={addRow}>
              <Plus className="h-4 w-4" />
              New Lead
            </button>
          </>
        }
      />

      {/* Mini stat strip */}
      <div className="leads-ministat-grid">
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
      <div className="card leads-toolbar">
        <div className="leads-toolbar-inner">
          <div className="leads-search-container">
            <Search className="leads-search-icon" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search across all fields…"
              className="input leads-search-input"
            />
          </div>

          <div className="leads-filter-group">
            <span className="chip"><Filter className="h-3 w-3" /> Status</span>
            <button
              onClick={() => setStatusFilter('All')}
              className={`leads-filter-btn ${statusFilter === 'All' ? 'all-active' : 'inactive'}`}
            >
              All
            </button>
            {schema.statuses.map((s) => {
              const active = statusFilter === s
              const tone = statusTone(s, schema.statuses)
              return (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`leads-filter-btn ${active ? '' : 'inactive'}`}
                  style={active ? { color: tone, backgroundColor: `${tone}15`, borderColor: `${tone}30` } : undefined}
                >
                  {s}
                </button>
              )
            })}
          </div>

          <div className="leads-action-group">
            {selected.size > 0 && (
              <button
                onClick={deleteSelected}
                className="btn-ghost leads-delete-action"
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
      <div className="card leads-sheet-container">
        <div className="leads-sheet-scroll">
          <table className="sheet">
            <thead>
              <tr>
                <th className="row-num !text-center">
                  <input
                    type="checkbox"
                    checked={filtered.length > 0 && selected.size === filtered.length}
                    onChange={toggleSelectAll}
                    className="leads-checkbox"
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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={schema.columns.length + 3} className="leads-empty-state">
                    No leads match your filters. Try clearing search or status.
                  </td>
                </tr>
              ) : (
                filtered.map(({ row, i }, displayIdx) => (
                  <tr 
                    key={i} 
                    className={`leads-row ${selected.has(i) ? 'selected' : ''}`}
                    onClick={(e) => {
                      const target = e.target as HTMLElement
                      if (target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.closest('button')) return
                      setSelectedLeadIdx(i)
                    }}
                  >
                    <td className="row-num !text-center">
                      <input
                        type="checkbox"
                        checked={selected.has(i)}
                        onChange={() => toggleSelect(i)}
                        className="leads-checkbox"
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
                            deleteLeads(safeIndustryKey, new Set([i]))
                          }}
                          className="leads-delete-btn"
                        >
                          <Trash2 className="h-3.5 w-3.5 mx-auto" />
                        </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="leads-sheet-footer">
          <div>
            Showing <span className="leads-footer-stats-highlight">{filtered.length}</span> of{' '}
            <span className="leads-footer-stats-highlight">{rows.length}</span> leads
            {selected.size > 0 && <> · <span className="leads-footer-selected">{selected.size}</span> selected</>}
          </div>
          <div className="leads-footer-tips">
            <span className="chip">⌨ Click any cell to edit</span>
            <span className="chip">💾 Auto-saved locally</span>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {liveToast && (
        <div className="leads-toast">
          <Sparkles className="h-5 w-5" />
          <div className="leads-toast-text">{liveToast.message}</div>
        </div>
      )}

      {/* Detail Drawer */}
      <Drawer
        isOpen={selectedLeadIdx !== null}
        onClose={() => setSelectedLeadIdx(null)}
        title={selectedLeadIdx !== null ? String(rows[selectedLeadIdx]?.name || 'Lead Details') : ''}
        subtitle="Real-time activity and enrichment data"
        width="max-w-2xl"
      >
        {selectedLeadIdx !== null && (
          <div className="leads-drawer-content">
            {/* Quick Actions */}
            <div className="leads-drawer-actions">
               <button className="btn-primary leads-drawer-action-btn">Send Email</button>
               <button className="btn-ghost leads-drawer-action-btn leads-drawer-action-ghost">Log Call</button>
               <button className="btn-ghost leads-drawer-action-btn leads-drawer-action-ghost">Schedule</button>
            </div>
            
            {/* Field Overview */}
            <div>
              <h3 className="leads-drawer-section-title">Lead Data</h3>
              <div className="leads-drawer-grid">
                {schema.columns.map(col => (
                   <div key={col.key} className="leads-drawer-field">
                     <div className="leads-drawer-field-label">{col.label}</div>
                     <div className="leads-drawer-field-value">
                        {col.type === 'currency' 
                          ? formatINR(Number(rows[selectedLeadIdx]?.[col.key]) || 0, { compact: true })
                          : String(rows[selectedLeadIdx]?.[col.key] || '—')}
                     </div>
                   </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h3 className="leads-drawer-section-title">Activity Timeline</h3>
              <Timeline 
                events={[
                  {
                    id: 1,
                    title: 'Viewed Pricing Page',
                    description: 'Lead spent 4 mins on the enterprise pricing page.',
                    date: 'Just now',
                    iconBg: 'rgba(59, 130, 246, 0.15)',
                    iconColor: '#3b82f6',
                    icon: <Search className="w-3.5 h-3.5" />
                  },
                  {
                    id: 2,
                    title: 'Lead Captured',
                    description: `Captured via ${rows[selectedLeadIdx]?.source || 'Website'}.`,
                    date: '15 mins ago',
                    iconBg: 'rgba(16, 185, 129, 0.15)',
                    iconColor: '#10b981',
                    icon: <CheckCircle2 className="w-3.5 h-3.5" />
                  }
                ]}
              />
            </div>
          </div>
        )}
      </Drawer>
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
    <div className="card-soft leads-ministat-card">
      <div
        className="leads-ministat-icon"
        style={{ background: `${accent}22`, color: accent }}
      >
        {icon}
      </div>
      <div className="leads-ministat-content">
        <div className="leads-ministat-label">{label}</div>
        <div className="leads-ministat-value" title={value}>{value}</div>
        {hint && <div className="leads-ministat-hint">{hint}</div>}
      </div>
    </div>
  )
}
