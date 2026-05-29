import { Download, Mail, Printer, Receipt } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import FinanceEmptyState from '../../components/FinanceEmptyState'
import FinanceStatusBadge from '../../components/FinanceStatusBadge'
import { invoices } from '../../services/mockFinanceData'
import { formatFinanceCurrency, formatFinanceDate } from '../../utils/formatters'
import { pushAppToast } from '../../../store/uiStore'

export default function InvoiceDetailPage() {
  const { invoiceId } = useParams()
  const navigate = useNavigate()
  const invoice = invoices.find((item) => item.id === invoiceId)

  if (!invoice) {
    return (
      <div className="card p-6">
        <FinanceEmptyState icon={Receipt} title="Invoice not found" description="This invoice may have been archived or removed from the mock dataset." />
      </div>
    )
  }

  const subtotal = invoice.lineItems.reduce((sum, item) => sum + item.total, 0)

  return (
    <div className="space-y-6 fade-up">
      <section className="card p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link to="/finance/invoices" className="text-sm font-semibold text-brand-blue hover:underline">Back to invoices</Link>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{invoice.id}</h2>
            <p className="mt-2 text-sm text-slate-500">{invoice.company} • due {formatFinanceDate(invoice.dueDate)}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <FinanceStatusBadge status={invoice.status} />
            <button className="btn-ghost" onClick={() => pushAppToast(`PDF download started for ${invoice.id}.`, 'success')}>
              <Download className="h-4 w-4" /> PDF
            </button>
            <button className="btn-ghost" onClick={() => pushAppToast(`Invoice email resent to ${invoice.email}.`, 'success')}>
              <Mail className="h-4 w-4" /> Email
            </button>
            <button className="btn-primary" onClick={() => navigate('/finance/payments')}>
              <Printer className="h-4 w-4" /> Record payment
            </button>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <section className="card p-5">
          <h3 className="text-lg font-semibold text-slate-900">Line items</h3>
          <div className="mt-4 overflow-hidden rounded-2xl border border-line">
            <table className="sheet">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Qty</th>
                  <th>Rate</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.lineItems.map((item) => (
                  <tr key={item.description}>
                    <td><div className="px-3 py-3 font-medium text-slate-900">{item.description}</div></td>
                    <td><div className="px-3 py-3">{item.quantity}</div></td>
                    <td><div className="px-3 py-3">{formatFinanceCurrency(item.rate)}</div></td>
                    <td><div className="px-3 py-3 font-semibold">{formatFinanceCurrency(item.total)}</div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Subtotal</div>
              <div className="mt-2 text-lg font-bold text-slate-900">{formatFinanceCurrency(subtotal)}</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Tax</div>
              <div className="mt-2 text-lg font-bold text-slate-900">{formatFinanceCurrency(invoice.tax)}</div>
            </div>
            <div className="rounded-2xl bg-slate-900 p-4 text-white">
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">Grand total</div>
              <div className="mt-2 text-lg font-bold">{formatFinanceCurrency(subtotal + invoice.tax)}</div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="card p-5">
            <h3 className="text-lg font-semibold text-slate-900">Customer info</h3>
            <div className="mt-4 space-y-3 text-sm">
              <div><span className="text-slate-500">Billing contact:</span> <span className="font-medium text-slate-900">{invoice.customer}</span></div>
              <div><span className="text-slate-500">Email:</span> <span className="font-medium text-slate-900">{invoice.email}</span></div>
              <div><span className="text-slate-500">Address:</span> <span className="font-medium text-slate-900">{invoice.billingAddress}</span></div>
              <div><span className="text-slate-500">Created by:</span> <span className="font-medium text-slate-900">{invoice.createdBy}</span></div>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="text-lg font-semibold text-slate-900">Payment history</h3>
            <div className="mt-4 space-y-3">
              {invoice.paymentHistory.length > 0 ? invoice.paymentHistory.map((payment) => (
                <div key={payment.id} className="rounded-2xl border border-line p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{payment.id}</div>
                      <div className="mt-1 text-xs text-slate-500">{payment.method} • {formatFinanceDate(payment.date)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-slate-900">{formatFinanceCurrency(payment.amount)}</div>
                      <div className="mt-1"><FinanceStatusBadge status={payment.status} /></div>
                    </div>
                  </div>
                </div>
              )) : <p className="text-sm text-slate-500">No payments received yet.</p>}
            </div>
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="card p-5">
          <h3 className="text-lg font-semibold text-slate-900">Notes</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">{invoice.notes}</p>
        </section>
        <section className="card p-5">
          <h3 className="text-lg font-semibold text-slate-900">Attachments</h3>
          <div className="mt-3 space-y-2">
            {invoice.attachments.length > 0 ? invoice.attachments.map((item) => (
              <div key={item} className="rounded-xl bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">{item}</div>
            )) : <p className="text-sm text-slate-500">No attachments added.</p>}
          </div>
        </section>
        <section className="card p-5">
          <h3 className="text-lg font-semibold text-slate-900">Timeline activity</h3>
          <div className="mt-3 space-y-3">
            {invoice.timeline.map((item) => (
              <div key={item.id} className="rounded-2xl border border-line p-3">
                <div className="text-sm font-semibold text-slate-900">{item.title}</div>
                <div className="mt-1 text-xs text-slate-500">{item.description}</div>
                <div className="mt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">{item.time}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
