import { pushAppToast } from '../../../store/uiStore'

const rules = [
  { name: 'Critical ticket created', action: 'Assign priority queue', status: 'Planned' },
  { name: 'SLA risk detected', action: 'Notify team lead', status: 'Planned' },
  { name: 'Ticket breached', action: 'Escalate to manager queue', status: 'Draft' },
]

export default function AutomationRulesPage() {
  return (
    <div className="space-y-6">
      <section className="card p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-theme-primary">Automation rules</h3>
            <p className="mt-1 max-w-2xl text-sm text-theme-secondary">Future-ready structure for workflow automation without overwhelming admins before governance is ready.</p>
          </div>
          <button className="btn-primary" onClick={() => pushAppToast('Automation rule draft saved.', 'success')}>Save draft</button>
        </div>
        <div className="mt-5 grid gap-4">
          {rules.map((rule) => (
            <div key={rule.name} className="rounded-2xl border border-theme p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm font-semibold text-theme-primary">{rule.name}</div>
                <span className="chip">{rule.status}</span>
              </div>
              <p className="mt-3 text-sm text-theme-secondary">{rule.action}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
