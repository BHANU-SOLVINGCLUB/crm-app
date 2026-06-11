import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Plus, Search, Trash2, Download, Filter,
  CheckCircle2, TrendingUp, CircleDollarSign, Trophy,
} from 'lucide-react'
import clsx from 'clsx'
import PageHeader from '../components/common/PageHeader'
import SidePanel from '../components/common/SidePanel'
import DealModal from '../components/event-details/DealModal'
import DealCard from '../components/cards/DealCard'
import { STAGES, INITIAL_DEALS, fmt, pColor, probColor } from '../data/pipeline'
import type { Deal } from '../data/pipeline'

let nextId = 11

const STAGE_OPTIONS = STAGES.map((stage) => stage.id)
const PRIORITY_OPTIONS = ['high', 'medium', 'low']
const DEAL_OWNERS = ['Aarav Shah', 'Priya Menon', 'Neha Rao', 'Karan Malhotra']

function getDealOwner(deal: Deal) {
  return DEAL_OWNERS[deal.id % DEAL_OWNERS.length]
}

function hasOverdueFollowUp(deal: Deal) {
  return deal.lastActDays >= 5
}

function getCloseDateBucket(closeDate: string) {
  const today = new Date()
  const target = new Date(closeDate)
  const days = Math.ceil((target.getTime() - today.getTime()) / 864e5)
  if (days >= 0 && days <= 7) return 'This Week'
  if (target.getMonth() === today.getMonth() && target.getFullYear() === today.getFullYear()) return 'This Month'
  return 'Later'
}

function getValueBucket(value: number) {
  if (value > 500000) return 'Above 500K'
  if (value < 200000) return 'Below 200K'
  return '200K to 500K'
}

function StageCell({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const stage = STAGES.find((item) => item.id === value)
  return (
    <div className="relative h-full w-full">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="cell-input appearance-none cursor-pointer font-semibold"
        style={{ color: stage?.color }}
      >
        {STAGE_OPTIONS.map((option) => (
          <option key={option} value={option} className="bg-white text-slate-800 font-normal">
            {STAGES.find((stageItem) => stageItem.id === option)?.name ?? option}
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
        onChange={(event) => onChange(event.target.value)}
        className="cell-input appearance-none cursor-pointer font-semibold"
        style={{ color: pColor(value) }}
      >
        {PRIORITY_OPTIONS.map((option) => (
          <option key={option} value={option} className="bg-white text-slate-800 font-normal">{option}</option>
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
        type="number"
        min={0}
        max={100}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-10 bg-transparent border-none outline-none text-right text-[12px] tabular-nums"
        style={{ color: probColor(value) }}
      />
      <span className="text-slate-500 text-[11px]">%</span>
    </div>
  )
}

export default function SalesPipeline() {
  const navigate = useNavigate()
  const location = useLocation()
  const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS)
  const [wonDeals, setWonDeals] = useState<Deal[]>([])
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({
    stage: 'All',
    priority: 'All',
    owner: 'All',
    closeDate: 'All',
    value: 'All',
    overdueOnly: false,
  })
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [panelDeal, setPanelDeal] = useState<Deal | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editDeal, setEditDeal] = useState<Deal | null>(null)
  const [outcome, setOutcome] = useState<{ type: 'won' | 'lost'; deal: Deal } | null>(null)
  const [toast, setToast] = useState<{ msg: string; green?: boolean } | null>(null)
  const [draggedDealId, setDraggedDealId] = useState<number | null>(null)

  const showToast = (msg: string, green?: boolean) => {
    setToast({ msg, green })
    setTimeout(() => setToast(null), 3000)
  }

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return deals
      .map((deal, index) => ({ deal, index }))
      .filter(({ deal }) => {
        if (filters.stage !== 'All' && deal.stage !== filters.stage) return false
        if (filters.priority !== 'All' && deal.priority !== filters.priority) return false
        if (filters.owner !== 'All' && getDealOwner(deal) !== filters.owner) return false
        if (filters.closeDate !== 'All' && getCloseDateBucket(deal.closeDate) !== filters.closeDate) return false
        if (filters.value !== 'All' && getValueBucket(deal.value) !== filters.value) return false
        if (filters.overdueOnly && !hasOverdueFollowUp(deal)) return false
        if (!query) return true

        return [
          deal.company,
          deal.contact,
          deal.email,
          deal.sector,
          deal.priority,
          deal.stage,
          getDealOwner(deal),
        ].some((value) => String(value).toLowerCase().includes(query))
      })
  }, [deals, filters, search])

  const stats = useMemo(() => {
    const totalVal = deals.reduce((sum, deal) => sum + deal.value, 0)
    const weighted = deals.reduce((sum, deal) => sum + deal.value * deal.prob / 100, 0)
    const wonVal = wonDeals.reduce((sum, deal) => sum + deal.value, 0) + 540000
    const overdue = deals.filter(hasOverdueFollowUp).length
    return { totalVal, weighted, wonVal, wonCount: wonDeals.length + 1, overdue }
  }, [deals, wonDeals])

  const stageColumns = useMemo(() => (
    STAGES.map((stage) => ({
      ...stage,
      deals: filtered.map((item) => item.deal).filter((deal) => deal.stage === stage.id),
    }))
  ), [filtered])

  const updateCell = (dealId: number, key: keyof Deal, value: string | number) => {
    setDeals((current) => current.map((deal) => (deal.id === dealId ? { ...deal, [key]: value } : deal)))
    if (panelDeal?.id === dealId) setPanelDeal((current) => current ? { ...current, [key]: value } : null)
  }

  const addRow = () => {
    const newDeal: Deal = {
      id: nextId++,
      company: '',
      contact: '',
      email: '',
      value: 0,
      stage: 'lead',
      prob: 30,
      priority: 'medium',
      closeDate: '',
      sector: '',
      lastAct: 'Deal created',
      lastActDays: 0,
    }
    setDeals((current) => [newDeal, ...current])
    showToast('New deal row added', true)
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get('quickAdd') !== 'deal') return

    const timer = window.setTimeout(() => {
      setEditDeal(null)
      setModalOpen(true)
      showToast('Quick Add opened a new deal form', true)
      navigate(location.pathname, { replace: true })
    }, 0)

    return () => window.clearTimeout(timer)
  }, [location.pathname, location.search, navigate])

  const deleteSelected = () => {
    setDeals((current) => current.filter((deal) => !selected.has(deal.id)))
    setSelected(new Set())
    showToast(`${selected.size} deal(s) deleted`)
  }

  const toggleSelect = (id: number) => {
    setSelected((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) setSelected(new Set())
    else setSelected(new Set(filtered.map((item) => item.deal.id)))
  }

  const handleSaveDeal = (data: Omit<Deal, 'id' | 'lastAct' | 'lastActDays'>) => {
    if (editDeal) {
      setDeals((current) => current.map((deal) => (deal.id === editDeal.id ? { ...deal, ...data } : deal)))
      if (panelDeal?.id === editDeal.id) setPanelDeal((current) => current ? { ...current, ...data } : null)
      showToast(`${data.company} updated!`, true)
    } else {
      setDeals((current) => [{ ...data, id: nextId++, lastAct: 'Deal created', lastActDays: 0 }, ...current])
      showToast(`${data.company} added!`, true)
    }
    setModalOpen(false)
    setEditDeal(null)
  }

  const handleMarkOutcome = (type: 'won' | 'lost') => {
    if (!panelDeal) return
    const deal = panelDeal
    setOutcome({ type, deal })
    if (type === 'won') setWonDeals((current) => [...current, deal])
    setDeals((current) => current.filter((item) => item.id !== deal.id))
    setPanelDeal(null)
  }

  const openDealDetail = (deal: Deal) => {
    navigate(`/sales/${deal.id}`, {
      state: {
        deal: {
          id: deal.id,
          companyName: deal.company,
          contactPerson: deal.contact,
          contactEmail: deal.email,
          dealValue: deal.value,
          stage: deal.stage === 'closed' ? 'closed_won' : deal.stage,
          priority: deal.priority,
          probability: deal.prob,
          closeDate: deal.closeDate,
          owner: getDealOwner(deal),
          dealName: `${deal.company} ${deal.sector} Expansion`,
        },
      },
    })
  }

  const exportDeals = () => {
    const rows = filtered.map(({ deal }) => [
      deal.company,
      deal.contact,
      deal.email,
      fmt(deal.value),
      STAGES.find((stage) => stage.id === deal.stage)?.name ?? deal.stage,
      deal.priority,
      `${deal.prob}%`,
      deal.closeDate,
      getDealOwner(deal),
      hasOverdueFollowUp(deal) ? 'Yes' : 'No',
    ])

    const csv = [
      ['Company', 'Contact', 'Email', 'Value', 'Stage', 'Priority', 'Probability', 'Close Date', 'Deal Owner', 'Overdue Follow-up'],
      ...rows,
    ]
      .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'sales-pipeline.csv'
    anchor.click()
    URL.revokeObjectURL(url)
    showToast('Pipeline exported', true)
  }

  const moveDealToStage = (dealId: number, stageId: string) => {
    const probability = STAGES.find((stage) => stage.id === stageId)?.id === 'closed'
      ? 100
      : STAGES.find((stage) => stage.id === stageId)?.id === 'negotiation'
        ? 85
        : STAGES.find((stage) => stage.id === stageId)?.id === 'proposal'
          ? 70
          : STAGES.find((stage) => stage.id === stageId)?.id === 'qualified'
            ? 55
            : STAGES.find((stage) => stage.id === stageId)?.id === 'contacted'
              ? 35
              : 20

    setDeals((current) => current.map((deal) => (
      deal.id === dealId
        ? { ...deal, stage: stageId, prob: probability, lastAct: `Moved to ${STAGES.find((stage) => stage.id === stageId)?.name ?? stageId}`, lastActDays: 0 }
        : deal
    )))
    if (panelDeal?.id === dealId) {
      setPanelDeal((current) => current ? { ...current, stage: stageId, prob: probability } : null)
    }
    showToast('Deal moved to new stage', true)
  }

  return (
    <div className="px-5 lg:px-8 py-6 lg:py-8">
      <PageHeader
        eyebrow="Sales Pipeline"
        title="Pipeline control center"
        subtitle="Manage multiple deals with advanced filters, bulk actions, analytics, a live table, and a full Kanban board."
        actions={
          <>
            <button className="btn-ghost" onClick={exportDeals}>
              <Download className="h-4 w-4" /> Export
            </button>
            <button className="btn-primary" onClick={() => { setEditDeal(null); setModalOpen(true) }}>
              <Plus className="h-4 w-4" /> Add Deal
            </button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5 mb-6">
        <MiniStat label="Active Deals" value={String(deals.length)} hint="across all stages" accent="#3b82f6" icon={<Filter className="h-4 w-4" />} />
        <MiniStat label="Pipeline Value" value={fmt(stats.totalVal)} hint="if all deals close" accent="#10b981" icon={<CircleDollarSign className="h-4 w-4" />} />
        <MiniStat label="Weighted Forecast" value={fmt(Math.round(stats.weighted))} hint="probability-adjusted" accent="#f59e0b" icon={<TrendingUp className="h-4 w-4" />} />
        <MiniStat label="Closed Won" value={String(stats.wonCount)} hint={`${fmt(stats.wonVal)} earned`} accent="#16a34a" icon={<Trophy className="h-4 w-4" />} />
        <MiniStat label="Overdue Follow-ups" value={String(stats.overdue)} hint="needs attention" accent="#dc2626" icon={<Trash2 className="h-4 w-4" />} />
      </div>

      <div className="card p-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search company, contact, owner, sector..."
              className="input pl-9"
            />
          </div>

          {selected.size > 0 && (
            <button onClick={deleteSelected} className="btn-ghost !text-brand-pink hover:!bg-brand-pink/10">
              <Trash2 className="h-4 w-4" /> Delete ({selected.size})
            </button>
          )}

          <button className="btn-ghost" onClick={addRow}>
            <Plus className="h-4 w-4" /> New row
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6 mt-4">
          <select className="input" value={filters.stage} onChange={(event) => setFilters((current) => ({ ...current, stage: event.target.value }))}>
            <option value="All">Stage</option>
            {STAGES.map((stage) => <option key={stage.id} value={stage.id}>{stage.name}</option>)}
          </select>
          <select className="input" value={filters.priority} onChange={(event) => setFilters((current) => ({ ...current, priority: event.target.value }))}>
            <option value="All">Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select className="input" value={filters.owner} onChange={(event) => setFilters((current) => ({ ...current, owner: event.target.value }))}>
            <option value="All">Deal Owner</option>
            {DEAL_OWNERS.map((owner) => <option key={owner} value={owner}>{owner}</option>)}
          </select>
          <select className="input" value={filters.closeDate} onChange={(event) => setFilters((current) => ({ ...current, closeDate: event.target.value }))}>
            <option value="All">Close Date</option>
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
            <option value="Later">Later</option>
          </select>
          <select className="input" value={filters.value} onChange={(event) => setFilters((current) => ({ ...current, value: event.target.value }))}>
            <option value="All">Deal Value</option>
            <option value="Above 500K">Above 500K</option>
            <option value="200K to 500K">200K to 500K</option>
            <option value="Below 200K">Below 200K</option>
          </select>
          <label className="flex items-center gap-2 rounded-xl border border-line px-3 py-2.5 text-sm font-semibold text-slate-600">
            <input
              type="checkbox"
              checked={filters.overdueOnly}
              onChange={(event) => setFilters((current) => ({ ...current, overdueOnly: event.target.checked }))}
              className="accent-blue-500"
            />
            Overdue Tasks
          </label>
        </div>
      </div>

      <div className="card p-0 overflow-hidden mb-6">
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
                <th style={{ minWidth: 110 }}>Value (â‚¹)</th>
                <th style={{ minWidth: 150 }}>Stage</th>
                <th style={{ minWidth: 90 }}>Priority</th>
                <th style={{ minWidth: 180 }}>Win Probability</th>
                <th style={{ minWidth: 120 }}>Close Date</th>
                <th style={{ minWidth: 120 }}>Owner</th>
                <th style={{ minWidth: 120 }}>Sector</th>
                <th style={{ minWidth: 130 }}>Last Activity</th>
                <th style={{ width: 60 }} />
              </tr>
            </thead>
            <tbody>
              {filtered.map(({ deal, index }) => (
                <tr
                  key={deal.id}
                  className={clsx(selected.has(deal.id) && 'selected')}
                  onClick={(event) => {
                    if ((event.target as HTMLElement).closest('.row-num')) return
                    if ((event.target as HTMLElement).tagName === 'INPUT' || (event.target as HTMLElement).tagName === 'SELECT') return
                    setPanelDeal(deal)
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <td className="row-num !text-center" onClick={(event) => event.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selected.has(deal.id)}
                      onChange={() => toggleSelect(deal.id)}
                      className="accent-blue-500"
                    />
                  </td>
                  <td className="row-num">{index + 1}</td>
                  <td>
                    <button
                      type="button"
                      className="h-full w-full px-3 text-left transition hover:text-blue-600"
                      onClick={(event) => {
                        event.stopPropagation()
                        openDealDetail(deal)
                      }}
                    >
                      <span className="flex items-center justify-between gap-3">
                        <span className="font-semibold text-slate-800">{deal.company || 'Open deal'}</span>
                        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-600">Open</span>
                      </span>
                    </button>
                  </td>
                  <td><input value={deal.contact} onChange={(event) => updateCell(deal.id, 'contact', event.target.value)} className="cell-input" placeholder="Contact" /></td>
                  <td><input value={deal.email} onChange={(event) => updateCell(deal.id, 'email', event.target.value)} className="cell-input" type="email" placeholder="email@co.in" /></td>
                  <td>
                    <input
                      type="number"
                      value={deal.value || ''}
                      onChange={(event) => updateCell(deal.id, 'value', Number(event.target.value))}
                      className="cell-input text-right tabular-nums text-emerald-400 font-semibold"
                      placeholder="0"
                    />
                  </td>
                  <td><StageCell value={deal.stage} onChange={(value) => updateCell(deal.id, 'stage', value)} /></td>
                  <td><PriorityCell value={deal.priority} onChange={(value) => updateCell(deal.id, 'priority', value)} /></td>
                  <td><ProbCell value={deal.prob} onChange={(value) => updateCell(deal.id, 'prob', value)} /></td>
                  <td>
                    <input
                      type="date"
                      value={deal.closeDate}
                      onChange={(event) => updateCell(deal.id, 'closeDate', event.target.value)}
                      className="cell-input tabular-nums"
                    />
                  </td>
                  <td>
                    <div className="px-3 text-[12px] text-slate-400 font-medium h-full flex items-center">{getDealOwner(deal)}</div>
                  </td>
                  <td><input value={deal.sector} onChange={(event) => updateCell(deal.id, 'sector', event.target.value)} className="cell-input" placeholder="Sector" /></td>
                  <td>
                    <div className="px-3 flex items-center gap-1 h-full">
                      <span className="text-[11px] text-slate-400 truncate">{deal.lastAct}</span>
                      {deal.lastActDays > 0 && (
                        <span className={clsx('text-[10px] font-semibold ml-auto flex-shrink-0', deal.lastActDays >= 5 ? 'text-amber-400' : 'text-slate-500')}>
                          {deal.lastActDays}d
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="row-num" onClick={(event) => event.stopPropagation()}>
                    <button
                      onClick={() => { setDeals((current) => current.filter((item) => item.id !== deal.id)); showToast('Deal removed') }}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-red-200 bg-white text-slate-500 transition hover:border-red-300 hover:bg-red-50 hover:text-red-500"
                      aria-label={`Delete ${deal.company || 'deal'}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={14} className="text-center py-12 text-slate-500">
                    No deals match your filters. Try clearing search or relaxing the advanced filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-line flex items-center justify-between text-[12px] text-slate-400 bg-black/20">
          <div>
            Showing <span className="text-white font-semibold">{filtered.length}</span> of{' '}
            <span className="text-white font-semibold">{deals.length}</span> deals
            {selected.size > 0 && <> Â· <span className="text-blue-400">{selected.size} selected</span></>}
          </div>
          <div className="flex items-center gap-2">
            <span className="chip">Click any cell to edit</span>
            <span className="chip">Open a deal for deep work</span>
          </div>
        </div>
      </div>

      <section className="card p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400 font-semibold">Kanban Pipeline</div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">Visual multi-deal stage management</h2>
            <p className="text-sm text-slate-500 mt-1">Drag deals between stages, compare workload, and spot bottlenecks quickly.</p>
          </div>
          <span className="chip">{filtered.length} visible deals</span>
        </div>

        <div className="grid gap-4 xl:grid-cols-3 2xl:grid-cols-6">
          {stageColumns.map((column) => (
            <div
              key={column.id}
              className="rounded-2xl border border-line bg-slate-950/70 p-3"
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => {
                if (!draggedDealId) return
                moveDealToStage(draggedDealId, column.id)
                setDraggedDealId(null)
              }}
            >
              <div className="flex items-center justify-between rounded-xl px-3 py-2 mb-3" style={{ background: `${column.color}15`, border: `1px solid ${column.color}25` }}>
                <span className="text-sm font-semibold" style={{ color: column.color }}>{column.name}</span>
                <span className="text-xs font-bold text-white/80">{column.deals.length}</span>
              </div>

              <div className="grid gap-3">
                {column.deals.map((deal) => (
                  <DealCard
                    key={deal.id}
                    deal={deal}
                    onDragStart={() => setDraggedDealId(deal.id)}
                    onDragEnd={() => setDraggedDealId(null)}
                    onClick={() => openDealDetail(deal)}
                  />
                ))}
                {column.deals.length === 0 && (
                  <div className="rounded-xl border border-dashed border-white/10 px-3 py-6 text-center text-xs text-slate-500">
                    No deals in this stage
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <SidePanel
        deal={panelDeal}
        onClose={() => setPanelDeal(null)}
        onMoveStage={(id, stage) => {
          updateCell(id, 'stage', stage)
          setPanelDeal((current) => current ? { ...current, stage } : null)
          showToast('Stage updated', true)
        }}
        onOpen={() => {
          if (!panelDeal) return
          openDealDetail(panelDeal)
        }}
        onMarkWon={() => handleMarkOutcome('won')}
        onMarkLost={() => handleMarkOutcome('lost')}
        onEdit={() => { setEditDeal(panelDeal); setModalOpen(true); setPanelDeal(null) }}
      />

      <DealModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditDeal(null) }}
        onSave={handleSaveDeal}
        editDeal={editDeal}
        defaultStage="lead"
      />

      {outcome && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white border border-line rounded-2xl p-10 text-center w-80 shadow-card-lg text-slate-800">
            <div className="text-6xl mb-4">{outcome.type === 'won' ? 'ðŸŽ‰' : 'ðŸ˜”'}</div>
            <div className="text-[22px] font-bold mb-2 text-slate-900">{outcome.type === 'won' ? 'Deal Won!' : 'Deal Lost'}</div>
            <p className="text-slate-500 text-[14px] mb-6 leading-relaxed">
              {outcome.type === 'won'
                ? `${outcome.deal.company} said YES! You earned ${fmt(outcome.deal.value)}.`
                : `${outcome.deal.company} did not close this time.`}
            </p>
            <button className="btn-primary w-full justify-center" onClick={() => setOutcome(null)}>
              <CheckCircle2 className="h-4 w-4" /> Done
            </button>
          </div>
        </div>
      )}

      {toast && (
        <div className={clsx(
          'fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-full text-[13px] font-semibold text-white shadow-xl flex items-center gap-2 z-50',
          toast.green ? 'bg-green-600' : 'bg-slate-800'
        )}>
          {toast.green ? 'âœ“' : 'i'} {toast.msg}
        </div>
      )}
    </div>
  )
}

function MiniStat({ label, value, hint, accent, icon }: {
  label: string
  value: string
  hint?: string
  accent: string
  icon: ReactNode
}) {
  return (
    <div className="card-soft p-4 flex items-center gap-4">
      <div className="h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${accent}22`, color: accent }}>
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
