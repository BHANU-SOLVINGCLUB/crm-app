import { financeSettings } from '../../services/mockFinanceData'
import { pushAppToast } from '../../../store/uiStore'

export default function FinanceSettingsPage() {
  return (
    <div className="space-y-6 fade-up">
      {financeSettings.map((section) => (
        <section key={section.id} className="card p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-theme-primary">{section.title}</h3>
              <p className="mt-1 max-w-2xl text-sm text-theme-secondary">{section.description}</p>
            </div>
            <button className="btn-primary" onClick={() => pushAppToast(`${section.title} saved.`, 'success')}>
              Save changes
            </button>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {section.items.map((item) => (
              <div key={item.label} className="rounded-2xl border border-theme bg-theme-surface p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-theme-muted">{item.label}</div>
                <div className="mt-2 text-sm font-semibold text-theme-primary">{item.value}</div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
