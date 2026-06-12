import { Mail, Plus, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import FinanceEmptyState from '../../components/FinanceEmptyState'
import FinanceModal from '../../components/FinanceModal'
import FinanceStatusBadge from '../../components/FinanceStatusBadge'
import FinanceTable, { type FinanceTableColumn } from '../../components/FinanceTable'
import { invoices } from '../../services/mockFinanceData'
import type { InvoiceRecord, InvoiceStatus } from '../../types'
import { formatFinanceCurrency, formatFinanceDate } from '../../utils/formatters'
import { pushAppToast } from '../../../store/uiStore'

const tabs: Array<'All' | InvoiceStatus> = ['All', 'Draft', 'Sent', 'Viewed', 'Paid', 'Partial', 'Overdue', 'Cancelled']

export default function InvoicesPage() {
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('All')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const filteredRows = useMemo(() => {
    return invoices.filter((invoice) => {
      const matchesTab = activeTab === 'All' || invoice.status === activeTab
      const q = query.toLowerCase()
      const matchesQuery =
        invoice.id.toLowerCase().includes(q) ||
        invoice.customer.toLowerCase().includes(q) ||
        invoice.company.toLowerCase().includes(q)
      return matchesTab && matchesQuery
    })
  }, [activeTab, query])

  const columns: Array<FinanceTableColumn<InvoiceRecord>> = [
    {
      key: 'invoice',
      header: 'Invoice ID',
      render: (row) => <Link to={`/finance/invoices/${row.id}`} className="font-semibold text-brand-blue hover:underline">{row.id}</Link>,
    },
    {
      key: 'customer',
      header: 'Customer',
      render: (row) => (
        <div>
          <div className="font-medium text-theme-primary">{row.customer}</div>
          <div className="text-xs text-theme-secondary">{row.company}</div>
        </div>
      ),
    },
    { key: 'amount', header: 'Amount', render: (row) => <span className="font-semibold text-theme-primary">{formatFinanceCurrency(row.amount)}</span> },
    { key: 'tax', header: 'Tax', render: (row) => formatFinanceCurrency(row.tax) },
    { key: 'dueDate', header: 'Due Date', render: (row) => formatFinanceDate(row.dueDate) },
    { key: 'status', header: 'Status', render: (row) => <FinanceStatusBadge status={row.status} /> },
    { key: 'createdBy', header: 'Created By', render: (row) => row.createdBy },
    { key: 'updatedAt', header: 'Last Updated', render: (row) => formatFinanceDate(row.updatedAt) },
  ]

  return (
    <div className="space-y-6 fade-up">
      <section className="card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-theme-muted" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search invoice, customer, or company"
              className="input pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="btn-ghost" onClick={() => pushAppToast('Invoice emails queued for selected customers.', 'success')}>
              <Mail className="h-4 w-4" /> Send email
            </button>
            <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4" /> Create invoice
            </button>
          </div>
        </div>
        <div className="mt-4 flex gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${activeTab === tab ? 'bg-slate-900 text-white' : 'bg-theme-surface text-theme-secondary hover:bg-theme-surface'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      <section className="card overflow-hidden">
        {filteredRows.length > 0 ? (
          <FinanceTable columns={columns} rows={filteredRows} getRowKey={(row) => row.id} />
        ) : (
          <div className="p-5">
            <FinanceEmptyState icon={Search} title="No invoices match these filters" description="Try another status, clear your search, or create a new invoice." />
          </div>
        )}
      </section>

      <FinanceModal
        open={showCreateModal}
        title="Create invoice"
        description="Lightweight invoice creation flow for finance operators."
        onClose={() => setShowCreateModal(false)}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <input className="input" placeholder="Customer name" />
          <input className="input" placeholder="Company" />
          <input className="input" placeholder="Invoice amount" />
          <input className="input" placeholder="Due date" />
          <input className="input md:col-span-2" placeholder="Notes for billing team" />
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button className="btn-ghost" onClick={() => setShowCreateModal(false)}>Cancel</button>
          <button
            className="btn-primary"
            onClick={() => {
              setShowCreateModal(false)
              pushAppToast('Draft invoice created and routed for review.', 'success')
            }}
          >
            Save draft
          </button>
        </div>
      </FinanceModal>
    </div>
  )
}
