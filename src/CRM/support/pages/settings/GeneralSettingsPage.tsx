import { pushAppToast } from '../../../store/uiStore'

const numbering = ['SUP-1001', 'SUP-1002', 'SUP-1003']
const categories = ['Technical', 'Billing', 'Product', 'General']

export default function GeneralSettingsPage() {
  return (
    <div className="space-y-6">
      <section className="card p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">General settings</h3>
            <p className="mt-1 max-w-2xl text-sm text-slate-500">Keep ticket intake predictable for agents, admins, and reporting teams.</p>
          </div>
          <button className="btn-primary" onClick={() => pushAppToast('Support general settings saved.', 'success')}>Save changes</button>
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-line p-4">
            <div className="text-sm font-semibold text-slate-900">Ticket numbering</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {numbering.map((item) => <span key={item} className="chip">{item}</span>)}
            </div>
            <p className="mt-3 text-sm text-slate-600">Prefix stays standardized across queues so exports, audits, and handoffs stay readable.</p>
          </div>
          <div className="rounded-2xl border border-line p-4">
            <div className="text-sm font-semibold text-slate-900">Ticket categories</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {categories.map((item) => <span key={item} className="chip">{item}</span>)}
            </div>
            <p className="mt-3 text-sm text-slate-600">A smaller category set reduces routing mistakes and keeps reporting cleaner for admins.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
