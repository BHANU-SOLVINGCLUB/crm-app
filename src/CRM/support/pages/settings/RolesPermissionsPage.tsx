import { pushAppToast } from '../../../store/uiStore'

const roles = [
  { name: 'Support Agent', permissions: ['View Tickets', 'Edit Tickets'] },
  { name: 'Senior Agent', permissions: ['View Tickets', 'Edit Tickets', 'Manage SLA'] },
  { name: 'Team Lead', permissions: ['View Tickets', 'Edit Tickets', 'Manage Teams', 'Manage SLA'] },
  { name: 'Support Manager', permissions: ['View Tickets', 'Edit Tickets', 'Manage Teams', 'Manage SLA', 'Delete Tickets'] },
  { name: 'Admin', permissions: ['View Tickets', 'Edit Tickets', 'Delete Tickets', 'Manage SLA', 'Manage Teams'] },
]

export default function RolesPermissionsPage() {
  return (
    <div className="space-y-6">
      <section className="card p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Roles & permissions</h3>
            <p className="mt-1 max-w-2xl text-sm text-slate-500">Keep the role model small and explicit so admins can reason about access quickly.</p>
          </div>
          <button className="btn-primary" onClick={() => pushAppToast('Role policy updated.', 'success')}>Save changes</button>
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {roles.map((role) => (
            <div key={role.name} className="rounded-2xl border border-line bg-slate-50/70 p-4">
              <div className="text-sm font-semibold text-slate-900">{role.name}</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {role.permissions.map((permission) => <span key={permission} className="chip">{permission}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
