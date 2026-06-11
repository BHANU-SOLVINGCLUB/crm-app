import { Link } from 'react-router-dom'
import { supportSettingsAreas } from '../../services/mockSupportData'

const guardrails = [
  'Keep only one owner for each queue to avoid assignment ambiguity.',
  'Limit destructive permissions to support managers and admins.',
  'Escalation thresholds should live in SLA settings, not in team rules.',
  'Automation stays visible but separate until rule governance is approved.',
]

export default function SupportSettingsOverviewPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-3">
        {supportSettingsAreas.map((area) => (
          <Link key={area.id} to={area.path} className="card block p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-theme-primary">{area.title}</h3>
                <p className="mt-2 text-sm leading-6 text-theme-secondary">{area.description}</p>
              </div>
              <span className="chip">{area.priority}</span>
            </div>
            <div className="mt-5 rounded-2xl bg-theme-surface p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-theme-muted">Primary owner</div>
              <div className="mt-2 text-sm font-semibold text-theme-primary">{area.owner}</div>
              <div className="mt-3 text-sm text-theme-secondary">{area.summary}</div>
            </div>
          </Link>
        ))}
      </section>

      <section className="card p-5">
        <h3 className="text-lg font-semibold text-theme-primary">Admin guardrails</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {guardrails.map((item) => (
            <div key={item} className="rounded-2xl border border-theme bg-theme-surface p-4 text-sm leading-6 text-theme-primary">
              {item}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
