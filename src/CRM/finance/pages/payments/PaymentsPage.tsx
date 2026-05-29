import { Search, Wallet } from 'lucide-react'
import { useMemo, useState } from 'react'
import FinanceEmptyState from '../../components/FinanceEmptyState'
import FinanceStatusBadge from '../../components/FinanceStatusBadge'
import FinanceTable, { type FinanceTableColumn } from '../../components/FinanceTable'
import { payments } from '../../services/mockFinanceData'
import type { PaymentRecord } from '../../types'
import { formatFinanceCurrency, formatFinanceDate } from '../../utils/formatters'

export default function PaymentsPage() {
  const [query, setQuery] = useState('')

  const rows = useMemo(() => payments.filter((payment) => {
    const q = query.toLowerCase()
    return (
      payment.id.toLowerCase().includes(q) ||
      payment.customer.toLowerCase().includes(q) ||
      payment.invoiceId.toLowerCase().includes(q) ||
      payment.gateway.toLowerCase().includes(q)
    )
  }), [query])

  const columns: Array<FinanceTableColumn<PaymentRecord>> = [
    { key: 'id', header: 'Transaction ID', render: (row) => <span className="font-semibold text-brand-blue">{row.id}</span> },
    { key: 'customer', header: 'Customer', render: (row) => row.customer },
    { key: 'invoiceId', header: 'Invoice Linked', render: (row) => row.invoiceId },
    { key: 'amount', header: 'Amount', render: (row) => <span className="font-semibold">{formatFinanceCurrency(row.amount)}</span> },
    { key: 'method', header: 'Payment Method', render: (row) => <span className="chip">{row.method}</span> },
    { key: 'status', header: 'Status', render: (row) => <FinanceStatusBadge status={row.status} /> },
    { key: 'date', header: 'Date', render: (row) => formatFinanceDate(row.date) },
    { key: 'gateway', header: 'Gateway', render: (row) => row.gateway },
  ]

  return (
    <div className="space-y-6 fade-up">
      <section className="card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="input pl-9" placeholder="Search payment, invoice, customer, or gateway" />
          </div>
          <div className="chip">Refunds, partials, and failed collections visible</div>
        </div>
      </section>

      <section className="card overflow-hidden">
        {rows.length > 0 ? (
          <FinanceTable columns={columns} rows={rows} getRowKey={(row) => row.id} />
        ) : (
          <div className="p-5">
            <FinanceEmptyState icon={Wallet} title="No payments found" description="Try another search term to surface transactions in the ledger." />
          </div>
        )}
      </section>
    </div>
  )
}
