import { pushAppToast } from '../../../store/uiStore'

const policies = [
  { priority: 'Critical', response: '15 min', resolution: '4 hr', escalation: 'After 60% consumed' },
  { priority: 'High', response: '1 hr', resolution: '8 hr', escalation: 'After 75% consumed' },
  { priority: 'Medium', response: '4 hr', resolution: '24 hr', escalation: 'After 80% consumed' },
  { priority: 'Low', response: '8 hr', resolution: '48 hr', escalation: 'After 90% consumed' },
]

export default function SlaSettingsPage() {
  return (
    <div className="space-y-6">
      <section className="card p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-theme-primary">SLA settings</h3>
            <p className="mt-1 max-w-2xl text-sm text-theme-secondary">Manage response targets and escalation thresholds from one page to avoid policy drift.</p>
          </div>
          <button className="btn-primary" onClick={() => pushAppToast('SLA settings saved.', 'success')}>Save changes</button>
        </div>
        <div className="mt-5 grid gap-4 xl:grid-cols-2">
          {policies.map((policy) => (
            <div key={policy.priority} className="rounded-2xl border border-theme bg-theme-surface p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-theme-primary">{policy.priority}</div>
                <span className="chip">{policy.escalation}</span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-white p-3">
                  <div className="text-xs font-semibold uppercase tracking-[0.14em] text-theme-muted">Response target</div>
                  <div className="mt-2 text-lg font-bold text-theme-primary">{policy.response}</div>
                </div>
                <div className="rounded-xl bg-white p-3">
                  <div className="text-xs font-semibold uppercase tracking-[0.14em] text-theme-muted">Resolution target</div>
                  <div className="mt-2 text-lg font-bold text-theme-primary">{policy.resolution}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
