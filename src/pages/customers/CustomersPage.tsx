import { useMemo, useState } from 'react'
import {
  Search, Plus, Download, Filter, Trash2,
  Users, TrendingUp, AlertCircle, Crown,
} from 'lucide-react'
import clsx from 'clsx'
import PageHeader from '../../components/ui/PageHeader'
import CustomerTable from './CustomerTable'
import CustomerDrawer from './CustomerDrawer'
import './customers.css'
import {
  INITIAL_CUSTOMERS,
  fmtRevenue,
  type Customer,
} from '../../data/customerData'
import type { SortKey, SortDir } from './CustomerTable'

type TabId = 'all' | 'active' | 'vip' | 'renewal' | 'inactive'

const TABS: { id: TabId; label: string }[] = [
  { id: 'all',      label: 'All Customers' },
  { id: 'active',   label: 'Active' },
  { id: 'vip',      label: 'VIP' },
  { id: 'renewal',  label: 'Renewal Pending' },
  { id: 'inactive', label: 'Inactive' },
]

let _nextId = INITIAL_CUSTOMERS.length + 1

// ── Helpers ────────────────────────────────────────────────────────────────
function tabFilter(tab: TabId, c: Customer): boolean {
  if (tab === 'all')      return true
  if (tab === 'active')   return c.status === 'Active'
  if (tab === 'vip')      return c.status === 'VIP'
  if (tab === 'inactive') return c.status === 'Inactive'
  if (tab === 'renewal') {
    const days = Math.ceil(
      (new Date(c.renewalDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )
    return days >= 0 && days <= 60
  }
  return true
}

function sortRows(rows: Customer[], key: SortKey, dir: SortDir): Customer[] {
  return [...rows].sort((a, b) => {
    let va: string | number = a[key] as string | number
    let vb: string | number = b[key] as string | number
    if (typeof va === 'string') va = va.toLowerCase()
    if (typeof vb === 'string') vb = vb.toLowerCase()
    if (va < vb) return dir === 'asc' ? -1 : 1
    if (va > vb) return dir === 'asc' ? 1 : -1
    return 0
  })
}

// ── Component ──────────────────────────────────────────────────────────────
export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS)
  const [search,    setSearch]    = useState('')
  const [tab,       setTab]       = useState<TabId>('all')
  const [selected,  setSelected]  = useState<Set<number>>(new Set())
  const [drawer,    setDrawer]    = useState<Customer | null>(null)
  const [sortKey,   setSortKey]   = useState<SortKey>('name')
  const [sortDir,   setSortDir]   = useState<SortDir>('asc')
  const [toast,     setToast]     = useState<{ msg: string; green?: boolean } | null>(null)

  // ── Toast ──────────────────────────────────────────────────────────────
  const showToast = (msg: string, green?: boolean) => {
    setToast({ msg, green })
    setTimeout(() => setToast(null), 3000)
  }

  // ── Sort handler ───────────────────────────────────────────────────────
  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  // ── Filtered & sorted rows ─────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const base = customers.filter(c => {
      if (!tabFilter(tab, c)) return false
      if (!q) return true
      return [c.name, c.company, c.phone, c.email, c.status, c.assignedManager]
        .some(v => v.toLowerCase().includes(q))
    })
    return sortRows(base, sortKey, sortDir)
  }, [customers, search, tab, sortKey, sortDir])

  // ── Stats ──────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const active   = customers.filter(c => c.status === 'Active').length
    const vip      = customers.filter(c => c.status === 'VIP').length
    const inactive = customers.filter(c => c.status === 'Inactive').length
    const totalRev = customers.reduce((s, c) => s + c.revenue, 0)
    const overdue  = customers.filter(c => c.paymentStatus === 'Overdue').length
    return { active, vip, inactive, totalRev, overdue, total: customers.length }
  }, [customers])

  // ── Tab counts ─────────────────────────────────────────────────────────
  const tabCount = useMemo(() => {
    const counts: Record<TabId, number> = { all: 0, active: 0, vip: 0, renewal: 0, inactive: 0 }
    customers.forEach(c => {
      counts.all++
      if (c.status === 'Active')   counts.active++
      if (c.status === 'VIP')      counts.vip++
      if (c.status === 'Inactive') counts.inactive++
      const days = Math.ceil((new Date(c.renewalDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      if (days >= 0 && days <= 60) counts.renewal++
    })
    return counts
  }, [customers])

  // ── Mutations ──────────────────────────────────────────────────────────
  const updateCell = (id: number, key: keyof Customer, val: string | number) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, [key]: val } : c))
    if (drawer?.id === id) setDrawer(prev => prev ? { ...prev, [key]: val } : null)
  }

  const updateCustomer = (id: number, patch: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c))
    if (drawer?.id === id) setDrawer(prev => prev ? { ...prev, ...patch } : null)
  }

  const addCustomer = () => {
    const blank: Customer = {
      id: _nextId++,
      name: '',
      company: '',
      phone: '',
      email: '',
      status: 'Active',
      revenue: 0,
      lastActivity: 'Customer added',
      lastActivityDays: 0,
      assignedManager: '',
      renewalDate: '',
      paymentStatus: 'Pending',
      notes: '',
      purchaseHistory: [],
      supportTickets: [],
    }
    setCustomers(prev => [blank, ...prev])
    showToast('New customer row added', true)
  }

  const deleteRow = (id: number) => {
    setCustomers(prev => prev.filter(c => c.id !== id))
    if (drawer?.id === id) setDrawer(null)
    showToast('Customer removed')
  }

  const deleteSelected = () => {
    const count = selected.size
    setCustomers(prev => prev.filter(c => !selected.has(c.id)))
    setSelected(new Set())
    if (drawer && selected.has(drawer.id)) setDrawer(null)
    showToast(`${count} customer(s) deleted`)
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
    else setSelected(new Set(filtered.map(c => c.id)))
  }

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="px-5 lg:px-8 py-6 lg:py-8">
      <PageHeader
        eyebrow="Customers"
        title="Customer Management"
        subtitle="Track, manage and grow your customer base — all in one live sheet."
        actions={
          <>
            <button className="btn-ghost" onClick={() => showToast('Export coming soon!')}>
              <Download className="h-4 w-4" /> Export
            </button>
            <button className="btn-primary" onClick={addCustomer}>
              <Plus className="h-4 w-4" /> Add Customer
            </button>
          </>
        }
      />

      {/* ── Stats strip ──────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <MiniStat
          label="Total Customers"
          value={String(stats.total)}
          hint={`${stats.active} active`}
          accent="#6c63ff"
          icon={<Users className="h-4 w-4" />}
        />
        <MiniStat
          label="Total Revenue"
          value={fmtRevenue(stats.totalRev)}
          hint="lifetime value"
          accent="#34d399"
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <MiniStat
          label="VIP Accounts"
          value={String(stats.vip)}
          hint="high-value clients"
          accent="#a78bfa"
          icon={<Crown className="h-4 w-4" />}
        />
        <MiniStat
          label="Overdue Payments"
          value={String(stats.overdue)}
          hint="needs follow-up"
          accent="#f87171"
          icon={<AlertCircle className="h-4 w-4" />}
        />
      </div>

      {/* ── Toolbar ──────────────────────────────────────────────────── */}
      <div className="card p-3 mb-0 rounded-b-none border-b-0">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search name, company, email, manager…"
              className="input pl-9"
            />
          </div>

          <button className="btn-ghost">
            <Filter className="h-4 w-4" /> Filter
          </button>

          {/* Bulk delete */}
          {selected.size > 0 && (
            <button
              onClick={deleteSelected}
              className="btn-ghost !text-red-400 hover:!bg-red-400/10"
            >
              <Trash2 className="h-4 w-4" /> Delete ({selected.size})
            </button>
          )}

          <div className="ml-auto text-[12px] text-slate-400">
            <span className="text-white font-semibold">{filtered.length}</span> of{' '}
            <span className="text-white font-semibold">{customers.length}</span> customers
            {selected.size > 0 && (
              <> · <span className="text-violet-400 font-semibold">{selected.size} selected</span></>
            )}
          </div>
        </div>
      </div>

      {/* ── Tabs ─────────────────────────────────────────────────────── */}
      <div
        className="flex border-b overflow-x-auto"
        style={{
          background: 'rgba(255,255,255,0.015)',
          borderColor: 'rgba(108,99,255,0.15)',
          borderLeft: '1px solid rgba(108,99,255,0.1)',
          borderRight: '1px solid rgba(108,99,255,0.1)',
        }}
      >
        {TABS.map(t => (
          <button
            key={t.id}
            className={clsx('cust-tab flex items-center gap-1.5', tab === t.id && 'active')}
            onClick={() => { setTab(t.id); setSelected(new Set()) }}
          >
            {t.label}
            <span
              className="rounded-full px-1.5 py-0.5 text-[10px] font-bold min-w-[18px] text-center"
              style={{
                background: tab === t.id ? 'rgba(108,99,255,0.25)' : 'rgba(255,255,255,0.06)',
                color: tab === t.id ? '#a78bfa' : '#5a5a80',
              }}
            >
              {tabCount[t.id]}
            </span>
          </button>
        ))}
      </div>

      {/* ── Sheet ────────────────────────────────────────────────────── */}
      <div className="card p-0 overflow-hidden rounded-tl-none rounded-tr-none" style={{ borderTop: 'none' }}>
        <CustomerTable
          rows={filtered}
          allRows={customers}
          selected={selected}
          onToggleSelect={toggleSelect}
          onToggleSelectAll={toggleSelectAll}
          onRowClick={c => setDrawer(c)}
          onCellUpdate={updateCell}
          onDeleteRow={deleteRow}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
        />

        {/* Sheet footer */}
        <div className="px-4 py-3 border-t border-line flex items-center justify-between text-[12px] text-slate-400 bg-black/20 flex-wrap gap-2">
          <div>
            Showing{' '}
            <span className="text-white font-semibold">{filtered.length}</span> of{' '}
            <span className="text-white font-semibold">{customers.length}</span> customers
            {selected.size > 0 && (
              <> · <span className="text-violet-400">{selected.size} selected</span></>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="chip">⌨ Click any cell to edit inline</span>
            <span className="chip">🖱 Click row to view details</span>
          </div>
        </div>
      </div>

      {/* ── Customer Detail Drawer ────────────────────────────────────── */}
      <CustomerDrawer
        customer={drawer}
        onClose={() => setDrawer(null)}
        onUpdate={updateCustomer}
      />

      {/* ── Toast ────────────────────────────────────────────────────── */}
      {toast && (
        <div
          className={clsx(
            'fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-full text-[13px]',
            'font-semibold text-white shadow-xl flex items-center gap-2 z-50 fade-up',
            toast.green ? 'bg-green-600' : 'bg-slate-800'
          )}
        >
          {toast.green ? '✓' : 'ℹ'} {toast.msg}
        </div>
      )}
    </div>
  )
}

// ── MiniStat ──────────────────────────────────────────────────────────────
function MiniStat({
  label, value, hint, accent, icon,
}: {
  label: string; value: string; hint?: string; accent: string; icon: React.ReactNode
}) {
  return (
    <div className="card-soft p-4 flex items-center gap-4">
      <div
        className="h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0"
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
