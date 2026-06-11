import { pushAppToast } from '../../../store/uiStore'

const alerts = [
  { name: 'New ticket alerts', destination: 'Queue owner + channel inbox', frequency: 'Immediate' },
  { name: 'Assignment alerts', destination: 'Assigned agent', frequency: 'Immediate' },
  { name: 'Escalation alerts', destination: 'Team lead + manager', frequency: 'Immediate' },
  { name: 'SLA warning alerts', destination: 'Agent + team lead', frequency: 'At 80% SLA consumption' },
]

export default function NotificationsSettingsPage() {
  return (
    <div className="space-y-6">
      <section className="card p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-theme-primary">Notifications</h3>
            <p className="mt-1 max-w-2xl text-sm text-theme-secondary">Focus alerts on events that change response behavior, not on every ticket update.</p>
          </div>
          <button className="btn-primary" onClick={() => pushAppToast('Notification rules saved.', 'success')}>Save changes</button>
        </div>
        <div className="mt-5 grid gap-4">
          {alerts.map((alert) => (
            <div key={alert.name} className="rounded-2xl border border-theme p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm font-semibold text-theme-primary">{alert.name}</div>
                <span className="chip">{alert.frequency}</span>
              </div>
              <div className="mt-3 text-sm text-theme-secondary">{alert.destination}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
