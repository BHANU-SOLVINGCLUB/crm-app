import { useMemo, useState } from 'react'
import {
  Plus, Search, Trash2, Download, Filter,
  CheckCircle2, TrendingUp, CircleDollarSign, Trophy,
} from 'lucide-react'
import clsx from 'clsx'
import PageHeader from '../components/ui/PageHeader'
import SidePanel from './pipeline/SidePanel'
import DealModal from './pipeline/DealModal'
import { STAGES, INITIAL_DEALS, fmt, pColor, probColor } from '../data/pipeline'
import type { Deal } from '../data/pipeline'

let _nextId = 11

const STAGE_OPTIONS = STAGES.map(s => s.id)
const PRIORITY_OPTIONS = ['high', 'medium', 'low']

// ─── Cell renderer ─────────────────────────────────────────────────────────

function StageCell({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const st = STAGES.find(s => s.id === value)
  return (
    <div className="relative h-full w-full">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="cell-input appearance-none cursor-pointer font-semibold"
        style={{ color: st?.color }}
      >
        {STAGE_OPTIONS.map(o => (
          <option key={o} value={o} className="bg-[#0c1424] text-white font-normal">
            {STAGES.find(s => s.id === o)?.name ?? o}
          </option>
        ))}
      </select>
    </div>
  )
}

function PriorityCell({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative h-full w-full">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="cell-input appearance-none cursor-pointer font-semibold"
        style={{ color: pColor(value) }}
      >
        {PRIORITY_OPTIONS.map(o => (
          <option key={o} value={o} className="bg-[#0c1424] text-white font-normal">{o}</option>
        ))}
      </select>
    </div>
  )
}

function ProbCell({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-2 px-3 h-full">
      <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: probColor(value) }} />
      </div>
      <input
        type="number" min={0} max={100}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-10 bg-transparent border-none outline-none text-right text-[12px] tabular-nums"
        style={{ color: probColor(value) }}
      />
      <span className="text-slate-500 text-[11px]">%</span>
    </div>
  )
}

// ─── Main page ──────────────────────────────────────────────────────────────

export default function SalesPipeline() {
  const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS)
  const [wonDeals, setWonDeals] = useState<Deal[]>([])
  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState('All')
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [panelDeal, setPanelDeal] = useState<Deal | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editDeal, setEditDeal] = useState<Deal | null>(null)
  const [outcome, setOutcome] = useState<{ type: 'won' | 'lost'; deal: Deal } | null>(null)
  const [toast, setToast] = useState<{ msg: string; green?: boolean } | null>(null)

  const showToast = (msg: string, green?: boolean) => {
    setToast({ msg, green })
    setTimeout(() => setToast(null), 3000)
  }

  // ── Filtered rows ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return deals
      .map((d, i) => ({ deal: d, i }))
      .filter(({ deal: d }) => {
        if (stageFilter !== 'All' && d.stage !== stageFilter) return false
        if (!q) return true
        return [d.company, d.contact, d.email, d.sector, d.priority, d.stage]
          .some(v => String(v).toLowerCase().includes(q))
      })
  }, [deals, search, stageFilter])

  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const totalVal = deals.reduce((s, d) => s + d.value, 0)
    const weighted = deals.reduce((s, d) => s + d.value * d.prob / 100, 0)
    const wonVal = wonDeals.reduce((s, d) => s + d.value, 0) + 540000
    return { totalVal, weighted, wonVal, wonCount: wonDeals.length + 1 }
  }, [deals, wonDeals])

  // ── Mutation helpers ───────────────────────────────────────────────────────
  const updateCell = (dealId: number, key: keyof Deal, val: string | number) => {
    setDeals(prev => prev.map(d => d.id === dealId ? { ...d, [key]: val } : d))
    if (panelDeal?.id === dealId) setPanelDeal(prev => prev ? { ...prev, [key]: val } : null)
  }

  const addRow = () => {
    const newDeal: Deal = {
      id: _nextId++, company: '', contact: '', email: '', value: 0,
      stage: 'lead', prob: 30, priority: 'medium',
      closeDate: '', sector: '', lastAct: 'Deal created', lastActDays: 0,
    }
    setDeals(prev => [newDeal, ...prev])
  }

  const deleteSelected = () => {
    setDeals(prev => prev.filter(d => !selected.has(d.id)))
    setSelected(new Set())
    showToast(`${selected.size} deal(s) deleted`)
  }

  const toggleSelect = (id: number) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) setSelected(new Set())
    else setSelected(new Set(filtered.map(f => f.deal.id)))
  }

  const handleSaveDeal = (data: Omit<Deal, 'id' | 'lastAct' | 'lastActDays'>) => {
    if (editDeal) {
      setDeals(prev => prev.map(d => d.id === editDeal.id ? { ...d, ...data } : d))
      if (panelDeal?.id === editDeal.id) setPanelDeal(prev => prev ? { ...prev, ...data } : null)
      showToast(`${data.company} updated!`, true)
    } else {
      setDeals(prev => [{ ...data, id: _nextId++, lastAct: 'Deal created', lastActDays: 0 }, ...prev])
      showToast(`${data.company} added!`, true)
    }
    setModalOpen(false)
    setEditDeal(null)
  }

  const handleMarkOutcome = (type: 'won' | 'lost') => {
    if (!panelDeal) return
    const d = panelDeal
    setOutcome({ type, deal: d })
    if (type === 'won') setWonDeals(p => [...p, d])
    setDeals(p => p.filter(x => x.id !== d.id))
    setPanelDeal(null)
  }

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="px-5 lg:px-8 py-6 lg:py-8">
      <PageHeader
        eyebrow="Sales Pipeline"
        title="Deal sheet & pipeline tracker"
        subtitle="Edit deals inline, track stages and win probability — all in one live sheet."
        actions={
          <>
            <button className="btn-ghost" onClick={() => showToast('Export coming soon!')}>
              <Download className="h-4 w-4" /> Export
            </button>
            <button className="btn-primary" onClick={() => { setEditDeal(null); setModalOpen(true) }}>
              <Plus className="h-4 w-4" /> Add Deal
            </button>
          </>
        }
      />

      {/* Stats strip */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <MiniStat label="Active Deals"      value={String(deals.length)}           hint="across all stages"      accent="#3b82f6" icon={<Filter className="h-4 w-4" />} />
        <MiniStat label="Pipeline Value"    value={fmt(stats.totalVal)}             hint="if all deals close"     accent="#10b981" icon={<CircleDollarSign className="h-4 w-4" />} />
        <MiniStat label="Weighted Forecast" value={fmt(Math.round(stats.weighted))} hint="probability-adjusted"   accent="#f59e0b" icon={<TrendingUp className="h-4 w-4" />} />
        <MiniStat label="Closed Won"        value={String(stats.wonCount)}          hint={fmt(stats.wonVal) + ' earned'} accent="#16a34a" icon={<Trophy className="h-4 w-4" />} />
      </div>

      {/* Toolbar */}
      <div className="card p-3 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search company, contact, sector…"
              className="input pl-9"
            />
          </div>

          <div className="flex items-center gap-1 flex-wrap">
            <span className="chip"><Filter className="h-3 w-3" /> Stage</span>
            {['All', ...STAGE_OPTIONS].map(s => {
              const st = STAGES.find(x => x.id === s)
              return (
                <button
                  key={s}
                  onClick={() => setStageFilter(s)}
                  className={clsx(
                    'rounded-full px-3 py-1.5 text-[11.5px] font-semibold transition border',
                    stageFilter === s
                      ? 'bg-white/10 border-white/15 text-white'
                      : 'bg-transparent border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                  )}
                  style={stageFilter === s && st ? { color: st.color } : undefined}
                >
                  {st?.name ?? 'All'}
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {selected.size > 0 && (
              <button onClick={deleteSelected} className="btn-ghost !text-brand-pink hover:!bg-brand-pink/10">
                <Trash2 className="h-4 w-4" /> Delete ({selected.size})
              </button>
            )}
            <button className="btn-ghost" onClick={addRow}>
              <Plus className="h-4 w-4" /> New row
            </button>
          </div>
        </div>
      </div>

      {/* Sheet */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-auto max-h-[65vh]">
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
                <th style={{ minWidth: 160 }}>Company</th>
                <th style={{ minWidth: 140 }}>Contact</th>
                <th style={{ minWidth: 180 }}>Email</th>
                <th style={{ minWidth: 110 }}>Value (₹)</th>
                <th style={{ minWidth: 150 }}>Stage</th>
                <th style={{ minWidth: 90 }}>Priority</th>
                <th style={{ minWidth: 180 }}>Win Probability</th>
                <th style={{ minWidth: 120 }}>Close Date</th>
                <th style={{ minWidth: 120 }}>Sector</th>
                <th style={{ minWidth: 130 }}>Last Activity</th>
                <th style={{ width: 60 }} />
              </tr>
            </thead>
            <tbody>
              {filtered.map(({ deal: d, i }, displayIdx) => (
                <tr
                  key={d.id}
                  className={clsx(selected.has(d.id) && 'selected')}
                  onClick={e => {
                    // only open panel when clicking row number cell
                    if ((e.target as HTMLElement).closest('.row-num')) return
                    if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'SELECT') return
                    setPanelDeal(d)
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <td className="row-num !text-center" onClick={e => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selected.has(d.id)}
                      onChange={() => toggleSelect(d.id)}
                      className="accent-blue-500"
                    />
                  </td>
                  <td className="row-num">{displayIdx + 1}</td>

                  {/* Company */}
                  <td><input value={d.company} onChange={e => updateCell(d.id, 'company', e.target.value)} className="cell-input font-semibold" placeholder="Company name" /></td>
                  {/* Contact */}
                  <td><input value={d.contact} onChange={e => updateCell(d.id, 'contact', e.target.value)} className="cell-input" placeholder="Contact" /></td>
                  {/* Email */}
                  <td><input value={d.email} onChange={e => updateCell(d.id, 'email', e.target.value)} className="cell-input" type="email" placeholder="email@co.in" /></td>
                  {/* Value */}
                  <td>
                    <input
                      type="number"
                      value={d.value || ''}
                      onChange={e => updateCell(d.id, 'value', Number(e.target.value))}
                      className="cell-input text-right tabular-nums text-emerald-400 font-semibold"
                      placeholder="0"
                    />
                  </td>
                  {/* Stage */}
                  <td><StageCell value={d.stage} onChange={v => updateCell(d.id, 'stage', v)} /></td>
                  {/* Priority */}
                  <td><PriorityCell value={d.priority} onChange={v => updateCell(d.id, 'priority', v)} /></td>
                  {/* Prob */}
                  <td><ProbCell value={d.prob} onChange={v => updateCell(d.id, 'prob', v)} /></td>
                  {/* Close date */}
                  <td>
                    <input
                      type="date"
                      value={d.closeDate}
                      onChange={e => updateCell(d.id, 'closeDate', e.target.value)}
                      className="cell-input tabular-nums"
                    />
                  </td>
                  {/* Sector */}
                  <td><input value={d.sector} onChange={e => updateCell(d.id, 'sector', e.target.value)} className="cell-input" placeholder="Sector" /></td>
                  {/* Last act */}
                  <td>
                    <div className="px-3 flex items-center gap-1 h-full">
                      <span className="text-[11px] text-slate-400 truncate">{d.lastAct}</span>
                      {d.lastActDays > 0 && <span className={clsx('text-[10px] font-semibold ml-auto flex-shrink-0', d.lastActDays >= 5 ? 'text-amber-400' : 'text-slate-500')}>{d.lastActDays}d</span>}
                    </div>
                  </td>
                  {/* Delete */}
                  <td className="row-num" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => { setDeals(p => p.filter(x => x.id !== d.id)); showToast('Deal removed') }}
                      className="text-slate-500 hover:text-red-400 transition"
                    >
                      <Trash2 className="h-3.5 w-3.5 mx-auto" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={13} className="text-center py-12 text-slate-500">
                    No deals match your filters. Try clearing search or stage filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Sheet footer */}
        <div className="px-4 py-3 border-t border-line flex items-center justify-between text-[12px] text-slate-400 bg-black/20">
          <div>
            Showing <span className="text-white font-semibold">{filtered.length}</span> of{' '}
            <span className="text-white font-semibold">{deals.length}</span> deals
            {selected.size > 0 && <> · <span className="text-blue-400">{selected.size} selected</span></>}
          </div>
          <div className="flex items-center gap-2">
            <span className="chip">⌨ Click any cell to edit</span>
            <span className="chip">🖱 Click row to view details</span>
          </div>
        </div>
      </div>

      {/* Side Panel */}
      <SidePanel
        deal={panelDeal}
        onClose={() => setPanelDeal(null)}
        onMoveStage={(id, stage) => {
          updateCell(id, 'stage', stage)
          setPanelDeal(prev => prev ? { ...prev, stage } : null)
          showToast('Stage updated', true)
        }}
        onMarkWon={() => handleMarkOutcome('won')}
        onMarkLost={() => handleMarkOutcome('lost')}
        onEdit={() => { setEditDeal(panelDeal); setModalOpen(true); setPanelDeal(null) }}
      />

      {/* Add/Edit Modal */}
      <DealModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditDeal(null) }}
        onSave={handleSaveDeal}
        editDeal={editDeal}
        defaultStage="lead"
      />

      {/* Outcome overlay */}
      {outcome && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-[#0c1424] border border-white/10 rounded-2xl p-10 text-center w-80 shadow-2xl">
            <div className="text-6xl mb-4">{outcome.type === 'won' ? '🎉' : '😔'}</div>
            <div className="text-[22px] font-bold mb-2">{outcome.type === 'won' ? 'Deal Won!' : 'Deal Lost'}</div>
            <p className="text-slate-400 text-[14px] mb-6 leading-relaxed">
              {outcome.type === 'won'
                ? `${outcome.deal.company} said YES! You earned ${fmt(outcome.deal.value)}.`
                : `${outcome.deal.company} didn't close this time.`}
            </p>
            <button className="btn-primary w-full justify-center" onClick={() => setOutcome(null)}>
              <CheckCircle2 className="h-4 w-4" /> Done
            </button>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={clsx(
          'fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-full text-[13px] font-semibold text-white shadow-xl flex items-center gap-2 z-50',
          toast.green ? 'bg-green-600' : 'bg-slate-800'
        )}>
          {toast.green ? '✓' : 'ℹ'} {toast.msg}
        </div>
      )}
    </div>
  )
}

// ── MiniStat ──────────────────────────────────────────────────────────────────
function MiniStat({ label, value, hint, accent, icon }: {
  label: string; value: string; hint?: string; accent: string; icon: React.ReactNode
}) {
  return (
    <div className="card-soft p-4 flex items-center gap-4">
      <div className="h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${accent}22`, color: accent }}>
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
