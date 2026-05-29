import FinanceStatusBadge from '../../components/FinanceStatusBadge'
import FinanceTable, { type FinanceTableColumn } from '../../components/FinanceTable'
import { collections } from '../../services/mockFinanceData'
import type { CollectionRecord } from '../../types'
import { formatFinanceCurrency, formatFinanceDate } from '../../utils/formatters'

export default function CollectionsPage() {
  const columns: Array<FinanceTableColumn<CollectionRecord>> = [
    { key: 'invoiceId', header: 'Invoice', render: (row) => <span className="font-semibold text-brand-blue">{row.invoiceId}</span> },
    { key: 'customer', header: 'Customer', render: (row) => row.customer },
    { key: 'owner', header: 'Owner', render: (row) => row.owner },
    { key: 'amount', header: 'Amount', render: (row) => <span className="font-semibold">{formatFinanceCurrency(row.amount)}</span> },
    { key: 'daysOverdue', header: 'Days Overdue', render: (row) => `${row.daysOverdue} days` },
    { key: 'nextActionDate', header: 'Next Action', render: (row) => formatFinanceDate(row.nextActionDate) },
    { key: 'status', header: 'Status', render: (row) => <FinanceStatusBadge status={row.status} /> },
  ]

  return (
    <div className="space-y-6 fade-up">
      <section className="grid gap-4 md:grid-cols-3">
        {collections.map((item) => (
          <div key={item.id} className="card p-5">
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm font-semibold text-slate-900">{item.customer}</div>
              <FinanceStatusBadge status={item.status} />
            </div>
            <div className="mt-3 text-2xl font-bold tracking-tight text-slate-900">{formatFinanceCurrency(item.amount)}</div>
            <div className="mt-2 text-sm text-slate-500">{item.daysOverdue} days overdue • next action {formatFinanceDate(item.nextActionDate)}</div>
            <p className="mt-4 text-sm leading-6 text-slate-600">{item.notes}</p>
            {item.promiseToPay && (
              <div className="mt-4 rounded-xl bg-orange-50 px-3 py-2 text-sm font-medium text-orange-700">
                Promise to pay by {formatFinanceDate(item.promiseToPay)}
              </div>
            )}
          </div>
        ))}
      </section>

      <section className="card overflow-hidden">
        <FinanceTable columns={columns} rows={collections} getRowKey={(row) => row.id} />
      </section>
    </div>
  )
}
