import { useMemo, useState, type ReactNode } from 'react'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Search, Plus, Download, Filter, Trash2, Users, TrendingUp, Crown } from 'lucide-react'
import clsx from 'clsx'
import PageHeader from '../Components/PageHeader'
import CustomerTable from '../Components/CustomerTable'
import CustomerDrawer from '../Components/CustomerDrawer'
import '../Components/customers.css'
import { pushAppToast } from '../store/uiStore'
import { useCRMStore } from '../store/crmStore'
import { fmtRevenue, type Customer } from '../data/customerData'
import {
  apiCustomerToUi,
  createCustomer,
  deleteCustomerApi,
  fetchCustomers,
  uiCustomerToApi,
  updateCustomerApi,
} from '../../api/customers'
import { usePlatformStore } from '../../store/usePlatformStore'
import { useIndustryStore } from '../store/industryStore'
import type { SortKey, SortDir } from '../Components/CustomerTable'

type TabId = 'all' | 'active' | 'vip' | 'renewal' | 'inactive'

const TABS: { id: TabId; label: string }[] = [
  { id: 'all',     label: 'All Customers' },
  { id: 'active',  label: 'Active' },
  { id: 'vip',     label: 'VIP' },
  { id: 'renewal', label: 'Renewal Pending' },
  { id: 'inactive',label: 'Inactive' },
]

function daysUntil(date: string) {
  return Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

function tabFilter(tab: TabId, customer: Customer): boolean {
  if (tab === 'all')      return true
  if (tab === 'active')   return customer.status === 'Active'
  if (tab === 'vip')      return customer.status === 'VIP'
  if (tab === 'inactive') return customer.status === 'Inactive'
  if (tab === 'renewal') {
    const days = daysUntil(customer.renewalDate)
    return days >= 0 && days <= 60
  }
  return true
}

function sortRows(rows: Customer[], key: SortKey, dir: SortDir): Customer[] {
  return [...rows].sort((a, b) => {
    let left:  string | number = a[key] as string | number
    let right: string | number = b[key] as string | number
    if (typeof left  === 'string') left  = left.toLowerCase()
    if (typeof right === 'string') right = right.toLowerCase()
    if (left < right) return dir === 'asc' ? -1 : 1
    if (left > right) return dir === 'asc' ?  1 : -1
    return 0
  })
}

function MiniStat({
  label, value, hint, accent, icon,
}: {
  label:  string
  value:  string
  hint?:  string
  accent: string
  icon:   ReactNode
}) {
  return (
    <div className="card-soft flex items-center gap-4 p-4">
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
        style={{ background: `${accent}22`, color: accent }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">
          {label}
        </div>
        <div className="truncate text-[20px] font-bold leading-tight">{value}</div>
        {hint && <div className="mt-0.5 text-[11.5px] text-theme-muted">{hint}</div>}
      </div>
    </div>
  )
}

function PanelCard({
  title, eyebrow, children,
}: {
  title:    string
  eyebrow?: string
  children: ReactNode
}) {
  return (
    <section className="card p-5">
      <div className="mb-4">
        {eyebrow && (
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-theme-secondary">
            {eyebrow}
          </div>
        )}
        <h3 className="mt-1 text-[17px] font-semibold text-theme-primary">{title}</h3>
      </div>
      {children}
    </section>
  )
}

export default function CustomersPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const authUser = usePlatformStore((s) => s.authUser)
  const orgId = authUser?.organization?.id
  const industryKey = useIndustryStore((s) => s.current)

  // ── Centralised store ──────────────────────────────────────────────────────
  const storeCustomers = useCRMStore((s) => s.customers)
  const storeAddCustomer   = useCRMStore((s) => s.addCustomer)
  const storeUpdateCustomer= useCRMStore((s) => s.updateCustomer)
  const storeDeleteCustomers = useCRMStore((s) => s.deleteCustomers)
  const [apiCustomers, setApiCustomers] = useState<Customer[] | null>(null)
  const customers = apiCustomers ?? storeCustomers

  // ── Local UI state ─────────────────────────────────────────────────────────
  const [search,  setSearch]  = useState('')
  const [tab,     setTab]     = useState<TabId>('all')
  const [selected,setSelected]= useState<Set<number>>(new Set())
  const [drawer,  setDrawer]  = useState<Customer | null>(null)
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [toast,   setToast]   = useState<{ msg: string; green?: boolean } | null>(null)

  const showToast = (msg: string, green?: boolean) => {
    setToast({ msg, green })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    if (!orgId) {
      setApiCustomers(null)
      return
    }
    fetchCustomers(orgId)
      .then((items) => setApiCustomers(items.map(apiCustomerToUi)))
      .catch(() => showToast('Could not load customers from backend'))
  }, [orgId])

  // ── Filtered / sorted list ─────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    const base  = customers.filter((customer) => {
      if (!tabFilter(tab, customer)) return false
      if (!query) return true
      return [
        customer.name,
        customer.company,
        customer.phone,
        customer.email,
        customer.status,
        customer.assignedManager,
      ].some((v) => v.toLowerCase().includes(query))
    })
    return sortRows(base, sortKey, sortDir)
  }, [customers, search, tab, sortKey, sortDir])

  // ── Summary stats ──────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const active   = customers.filter((c) => c.status === 'Active').length
    const vip      = customers.filter((c) => c.status === 'VIP').length
    const totalRev = customers.reduce((sum, c) => sum + c.revenue, 0)
    return { active, vip, totalRev, total: customers.length }
  }, [customers])

  const tabCount = useMemo(() => {
    const counts: Record<TabId, number> = { all: 0, active: 0, vip: 0, renewal: 0, inactive: 0 }
    customers.forEach((c) => {
      counts.all += 1
      if (c.status === 'Active')   counts.active   += 1
      if (c.status === 'VIP')      counts.vip      += 1
      if (c.status === 'Inactive') counts.inactive += 1
      const days = daysUntil(c.renewalDate)
      if (days >= 0 && days <= 60) counts.renewal  += 1
    })
    return counts
  }, [customers])

  const renewalCustomers = useMemo(
    () =>
      customers
        .filter((c) => { const d = daysUntil(c.renewalDate); return d >= 0 && d <= 60 })
        .sort((a, b) => daysUntil(a.renewalDate) - daysUntil(b.renewalDate))
        .slice(0, 5),
    [customers]
  )

  // ── CRUD helpers ───────────────────────────────────────────────────────────

  const addCustomer = () => {
    if (orgId && apiCustomers) {
      void createCustomer(orgId, uiCustomerToApi({ industry: industryKey, status: 'Active', paymentStatus: 'Pending' }))
        .then((created) => {
          setApiCustomers((current) => [apiCustomerToUi(created), ...(current ?? [])])
          showToast('New customer row added', true)
        })
        .catch(() => showToast('Failed to create customer'))
      return
    }
    storeAddCustomer()
    showToast('New customer row added', true)
  }

  /** Quick-add from URL param (e.g. /customers?quickAdd=customer) */
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get('quickAdd') !== 'customer') return

    const timer = window.setTimeout(() => {
      storeAddCustomer()
      showToast('New customer row added', true)
      navigate(location.pathname, { replace: true })
    }, 0)

    return () => window.clearTimeout(timer)
  }, [location.pathname, location.search, navigate, storeAddCustomer])

  const updateCell = (id: number, key: keyof Customer, value: string | number) => {
    if (orgId && apiCustomers) {
      const existing = apiCustomers.find((c) => c.id === id)
      if (existing) {
        const next = { ...existing, [key]: value }
        setApiCustomers((current) => (current ?? []).map((c) => (c.id === id ? next : c)))
        if (drawer?.id === id) setDrawer(next)
        void updateCustomerApi(orgId, id, uiCustomerToApi({ ...next, industry: industryKey }))
      }
      return
    }
    storeUpdateCustomer(id, { [key]: value })
    if (drawer?.id === id) setDrawer((prev) => (prev ? { ...prev, [key]: value } : null))
  }

  const updateCustomer = (id: number, patch: Partial<Customer>) => {
    if (orgId && apiCustomers) {
      const existing = apiCustomers.find((c) => c.id === id)
      if (existing) {
        const next = { ...existing, ...patch }
        setApiCustomers((current) => (current ?? []).map((c) => (c.id === id ? next : c)))
        if (drawer?.id === id) setDrawer(next)
        void updateCustomerApi(orgId, id, uiCustomerToApi({ ...next, industry: industryKey }))
      }
      return
    }
    storeUpdateCustomer(id, patch)
    if (drawer?.id === id) setDrawer((prev) => (prev ? { ...prev, ...patch } : null))
  }

  const deleteRow = (id: number) => {
    if (orgId && apiCustomers) {
      void deleteCustomerApi(orgId, id).then(() => {
        setApiCustomers((current) => (current ?? []).filter((c) => c.id !== id))
        if (drawer?.id === id) setDrawer(null)
        showToast('Customer removed')
      })
      return
    }
    storeDeleteCustomers(new Set([id]))
    if (drawer?.id === id) setDrawer(null)
    showToast('Customer removed')
  }

  const deleteSelected = () => {
    const count = selected.size
    if (orgId && apiCustomers) {
      void Promise.all([...selected].map((id) => deleteCustomerApi(orgId, id))).then(() => {
        setApiCustomers((current) => (current ?? []).filter((c) => !selected.has(c.id)))
        setSelected(new Set())
        if (drawer && selected.has(drawer.id)) setDrawer(null)
        showToast(`${count} customer(s) deleted`)
      })
      return
    }
    storeDeleteCustomers(selected)
    setSelected(new Set())
    if (drawer && selected.has(drawer.id)) setDrawer(null)
    showToast(`${count} customer(s) deleted`)
  }

  // ── Selection helpers ──────────────────────────────────────────────────────
  const toggleSelect = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else              next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) setSelected(new Set())
    else setSelected(new Set(filtered.map((c) => c.id)))
  }

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('asc') }
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="px-5 py-6 lg:px-8 lg:py-8">
      <PageHeader
        eyebrow="Customers"
        title="Customer Management"
        subtitle="A simple customer page to search, manage, and review your customer records."
        actions={
          <>
            <button className="btn-ghost" onClick={() => showToast('Export coming soon.')}>
              <Download className="h-4 w-4" /> Export
            </button>
            <button className="btn-primary" onClick={addCustomer}>
              <Plus className="h-4 w-4" /> Add Customer
            </button>
          </>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MiniStat
          label="Total Customers"
          value={String(stats.total)}
          hint={`${stats.active} active accounts`}
          accent="#2563eb"
          icon={<Users className="h-4 w-4" />}
        />
        <MiniStat
          label="Revenue Base"
          value={fmtRevenue(stats.totalRev)}
          hint="portfolio lifetime value"
          accent="#10b981"
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <MiniStat
          label="VIP Accounts"
          value={String(stats.vip)}
          hint="strategic relationships"
          accent="#8b5cf6"
          icon={<Crown className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[2fr_1fr]">
        <PanelCard title="Customer Directory" eyebrow="Core Workspace">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[220px] max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-theme-secondary" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, company, email, manager..."
                className="input pl-9"
              />
            </div>
            <button
              className="btn-ghost"
              onClick={() => {
                const nextTab = tab === 'all' ? 'renewal' : 'all'
                setTab(nextTab)
                setSelected(new Set())
                pushAppToast(
                  nextTab === 'renewal'
                    ? 'Showing renewal-pending customers.'
                    : 'Customer filter reset.',
                  'success'
                )
              }}
            >
              <Filter className="h-4 w-4" /> Filter
            </button>
            {selected.size > 0 && (
              <button onClick={deleteSelected} className="btn-ghost !text-red-500 hover:!bg-red-50">
                <Trash2 className="h-4 w-4" /> Delete ({selected.size})
              </button>
            )}
            <div className="ml-auto text-[12px] text-theme-secondary">
              <span className="font-semibold text-theme-primary">{filtered.length}</span> of{' '}
              <span className="font-semibold text-theme-primary">{customers.length}</span> customers
            </div>
          </div>

          <div className="mt-4 flex overflow-x-auto border-b border-theme">
            {TABS.map((item) => (
              <button
                key={item.id}
                className={clsx(
                  'flex items-center gap-2 border-b-2 px-4 py-3 text-[13px] font-semibold transition-colors',
                  tab === item.id
                    ? 'border-brand-blue text-brand-blue'
                    : 'border-transparent text-theme-secondary hover:text-theme-primary'
                )}
                onClick={() => { setTab(item.id); setSelected(new Set()) }}
              >
                {item.label}
                <span
                  className={clsx(
                    'rounded-full px-2 py-0.5 text-[10px]',
                    tab === item.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-theme-surface text-theme-secondary'
                  )}
                >
                  {tabCount[item.id]}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border border-theme">
            <CustomerTable
              rows={filtered}
              selected={selected}
              onToggleSelect={toggleSelect}
              onToggleSelectAll={toggleSelectAll}
              onRowClick={(customer) => setDrawer(customer)}
              onCellUpdate={updateCell}
              onDeleteRow={deleteRow}
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={handleSort}
            />
          </div>
        </PanelCard>

        <PanelCard title="Renewals Requiring Attention" eyebrow="Next 60 Days">
          <div className="space-y-3">
            {renewalCustomers.map((customer) => (
              <div
                key={customer.id}
                className="flex items-center justify-between rounded-2xl border border-slate-200 p-3"
              >
                <div>
                  <div className="text-[13px] font-semibold text-theme-primary">
                    {customer.company}
                  </div>
                  <div className="text-[12px] text-theme-secondary">
                    {customer.assignedManager}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[13px] font-semibold text-amber-600">
                    {daysUntil(customer.renewalDate)}d
                  </div>
                  <div className="text-[11px] text-theme-muted">until renewal</div>
                </div>
              </div>
            ))}
          </div>
        </PanelCard>
      </div>

      <CustomerDrawer customer={drawer} onClose={() => setDrawer(null)} onUpdate={updateCustomer} />

      {toast && (
        <div
          className={clsx(
            'fade-up fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold text-white shadow-xl',
            toast.green ? 'bg-green-600' : 'bg-slate-800'
          )}
        >
          {toast.green ? 'OK' : 'i'} {toast.msg}
        </div>
      )}
    </div>
  )
}
