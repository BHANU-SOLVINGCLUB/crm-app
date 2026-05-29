import { Outlet } from 'react-router-dom'
import SupportSettingsNav from '../../components/SupportSettingsNav'
import { supportSettingsAreas } from '../../services/mockSupportData'

export default function SupportSettingsPage() {
  const highPriorityCount = supportSettingsAreas.filter((area) => area.priority === 'High').length

  return (
    <div className="space-y-6 fade-up">
      <section className="card p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Admin workspace</div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Support settings</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Keep support operations easy to manage by separating only the settings that change queue behavior,
              SLA outcomes, permissions, and agent coverage. The goal is clarity for admins, not endless toggles.
            </p>
          </div>
          <div className="grid min-w-[240px] gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">High-priority areas</div>
              <div className="mt-2 text-3xl font-bold text-slate-900">{highPriorityCount}</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Future-ready</div>
              <div className="mt-2 text-3xl font-bold text-slate-900">{supportSettingsAreas.filter((area) => area.priority === 'Future').length}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="card p-4">
        <SupportSettingsNav />
      </section>

      <Outlet />
    </div>
  )
}
