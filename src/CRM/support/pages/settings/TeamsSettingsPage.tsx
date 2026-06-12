import { pushAppToast } from '../../../../store/uiStore'

const teams = [
  { name: 'Technical Support', queues: 'Authentication, API, Integrations', coverage: '24x7', lead: 'Rohan Shah' },
  { name: 'Billing Support', queues: 'Invoices, Refunds, Payment Issues', coverage: '24x5', lead: 'Maya Joseph' },
  { name: 'Account Support', queues: 'Access, Passwords, User Setup', coverage: '9x6', lead: 'Neha Kapoor' },
]

export default function TeamsSettingsPage() {
  return (
    <div className="space-y-6">
      <section className="card p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-theme-primary">Teams</h3>
            <p className="mt-1 max-w-2xl text-sm text-theme-secondary">Make ownership obvious so tickets do not bounce between departments.</p>
          </div>
          <button className="btn-primary" onClick={() => pushAppToast('Team configuration saved.', 'success')}>Save changes</button>
        </div>
        <div className="mt-5 grid gap-4">
          {teams.map((team) => (
            <div key={team.name} className="rounded-2xl border border-theme bg-theme-surface p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm font-semibold text-theme-primary">{team.name}</div>
                <span className="chip">{team.coverage}</span>
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div className="text-sm text-theme-secondary"><span className="font-medium text-theme-primary">Queues:</span> {team.queues}</div>
                <div className="text-sm text-theme-secondary"><span className="font-medium text-theme-primary">Lead:</span> {team.lead}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
