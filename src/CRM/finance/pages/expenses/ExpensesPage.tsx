import { PlusCircle, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import FinanceModal from '../../components/FinanceModal'
import FinanceStatusBadge from '../../components/FinanceStatusBadge'
import FinanceTable, { type FinanceTableColumn } from '../../components/FinanceTable'
import { expenses } from '../../services/mockFinanceData'
import type { ExpenseRecord } from '../../types'
import { formatFinanceCurrency, formatFinanceDate } from '../../utils/formatters'
import { pushAppToast } from '../../../../store/uiStore'

const categoryData = [
  { name: 'Salaries', amount: 1480000 },
  { name: 'Marketing', amount: 315000 },
  { name: 'Software', amount: 420000 },
  { name: 'Travel', amount: 98000 },
  { name: 'Office Rent', amount: 260000 },
  { name: 'Utilities', amount: 76000 },
]

export default function ExpensesPage() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  const rows = useMemo(() => expenses.filter((expense) => {
    const q = query.toLowerCase()
    return (
      expense.id.toLowerCase().includes(q) ||
      expense.vendor.toLowerCase().includes(q) ||
      expense.department.toLowerCase().includes(q) ||
      expense.category.toLowerCase().includes(q)
    )
  }), [query])

  const columns: Array<FinanceTableColumn<ExpenseRecord>> = [
    { key: 'id', header: 'Expense ID', render: (row) => <span className="font-semibold text-brand-blue">{row.id}</span> },
    { key: 'vendor', header: 'Vendor', render: (row) => row.vendor },
    { key: 'department', header: 'Department', render: (row) => row.department },
    { key: 'category', header: 'Category', render: (row) => <span className="chip">{row.category}</span> },
    { key: 'amount', header: 'Amount', render: (row) => <span className="font-semibold">{formatFinanceCurrency(row.amount)}</span> },
    { key: 'status', header: 'Status', render: (row) => <FinanceStatusBadge status={row.status} /> },
    { key: 'approvalStatus', header: 'Approval', render: (row) => <FinanceStatusBadge status={row.approvalStatus} /> },
    { key: 'date', header: 'Date', render: (row) => formatFinanceDate(row.date) },
  ]

  return (
    <div className="space-y-6 fade-up">
      <div className="grid gap-6 xl:grid-cols-[1.25fr_1fr]">
        <section className="card p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative w-full max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-theme-muted" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} className="input pl-9" placeholder="Search vendor, category, or department" />
            </div>
            <button className="btn-primary" onClick={() => setOpen(true)}>
              <PlusCircle className="h-4 w-4" /> Add expense
            </button>
          </div>
          <div className="mt-5 overflow-hidden rounded-2xl border border-theme">
            <FinanceTable columns={columns} rows={rows} getRowKey={(row) => row.id} />
          </div>
        </section>

        <section className="card p-5">
          <h3 className="text-lg font-semibold text-theme-primary">Expense categories</h3>
          <p className="mt-1 text-sm text-theme-secondary">Department-wise spend visibility for recurring and discretionary cost buckets.</p>
          <div className="mt-4 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ left: 14, right: 10, top: 8, bottom: 8 }}>
                <CartesianGrid stroke="rgba(0,0,0,0.05)" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={80} fontSize={12} />
                <Tooltip formatter={(value) => formatFinanceCurrency(Number(value))} />
                <Bar dataKey="amount" fill="#2563eb" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {rows.slice(0, 4).map((expense) => (
              <div key={expense.id} className="flex items-center justify-between rounded-xl bg-theme-surface px-3 py-2 text-sm">
                <span className="font-medium text-theme-primary">{expense.vendor}</span>
                <span className="font-semibold text-theme-primary">{formatFinanceCurrency(expense.amount)}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <FinanceModal open={open} title="Add expense" description="Capture expense records with vendor, department, and receipt details." onClose={() => setOpen(false)}>
        <div className="grid gap-4 md:grid-cols-2">
          <input className="input" placeholder="Vendor" />
          <input className="input" placeholder="Department" />
          <input className="input" placeholder="Category" />
          <input className="input" placeholder="Amount" />
          <input className="input" placeholder="Receipt file name" />
          <input className="input" placeholder="Recurring? Yes/No" />
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button className="btn-ghost" onClick={() => setOpen(false)}>Cancel</button>
          <button className="btn-primary" onClick={() => { setOpen(false); pushAppToast('Expense submitted for approval.', 'success') }}>Submit expense</button>
        </div>
      </FinanceModal>
    </div>
  )
}
