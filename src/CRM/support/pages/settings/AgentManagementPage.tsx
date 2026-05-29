import { agentSummaries } from '../../services/mockSupportData'
import { pushAppToast } from '../../../store/uiStore'

export default function AgentManagementPage() {
  return (
    <div className="space-y-6">
      <section className="card p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Agent management</h3>
            <p className="mt-1 max-w-2xl text-sm text-slate-500">See who is active, who owns which queue, and where specialist depth is strongest.</p>
          </div>
          <button className="btn-primary" onClick={() => pushAppToast('Agent directory synced.', 'success')}>Sync agents</button>
        </div>
        <div className="mt-5 grid gap-4 xl:grid-cols-3">
          {agentSummaries.map((agent) => (
            <div key={agent.id} className="rounded-2xl border border-line bg-slate-50/70 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">{agent.name}</div>
                  <div className="mt-1 text-sm text-slate-500">{agent.team}</div>
                </div>
                <span className="chip">{agent.slaSuccess}% SLA</span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-white p-3">
                  <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Resolved</div>
                  <div className="mt-2 text-lg font-bold text-slate-900">{agent.resolved}</div>
                </div>
                <div className="rounded-xl bg-white p-3">
                  <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Avg response</div>
                  <div className="mt-2 text-lg font-bold text-slate-900">{agent.avgResponse}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
