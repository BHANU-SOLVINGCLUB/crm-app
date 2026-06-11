import { useMemo, useState } from 'react'
import { ShieldCheck, Save, Users } from 'lucide-react'
import { usePlatformStore } from '../../store/usePlatformStore'
import { pushAppToast } from '../../store/uiStore'

const ROLE_PERMISSIONS = {
  Admin: [
    'Workspace configuration',
    'Staff management',
    'Roles and permissions',
    'Integrations',
    'Automation rules',
    'Billing visibility',
  ],
  'Sales Manager': [
    'Lead assignment',
    'Pipeline editing',
    'Deal reporting',
    'Customer records',
  ],
  'Sales Executive': [
    'Own leads',
    'Customer records',
    'Activities and notes',
    'Deals owned by self',
  ],
  'Support Agent': [
    'Support tickets',
    'Customer history',
    'SLA alerts',
    'Ticket assignment',
  ],
  'Finance Manager': [
    'Invoices',
    'Payments',
    'Billing notes',
    'Financial reporting',
  ],
} as const

type RoleName = keyof typeof ROLE_PERMISSIONS

const ROLE_ORDER: RoleName[] = ['Admin', 'Sales Manager', 'Sales Executive', 'Support Agent', 'Finance Manager']

export default function RolesPermissionsSettings() {
  const employees = usePlatformStore((state) => state.organization.invitedEmployees)
  const [permissionsByRole, setPermissionsByRole] = useState<Record<RoleName, string[]>>(() =>
    ROLE_ORDER.reduce((accumulator, role) => {
      accumulator[role] = [...ROLE_PERMISSIONS[role]]
      return accumulator
    }, {} as Record<RoleName, string[]>)
  )

  const roleCounts = useMemo(
    () =>
      ROLE_ORDER.reduce((accumulator, role) => {
        accumulator[role] = employees.filter((employee) => employee.role === role).length
        return accumulator
      }, {} as Record<RoleName, number>),
    [employees]
  )

  const togglePermission = (role: RoleName, permission: string) => {
    setPermissionsByRole((current) => {
      const exists = current[role].includes(permission)
      const nextPermissions = exists
        ? current[role].filter((entry) => entry !== permission)
        : [...current[role], permission]

      return {
        ...current,
        [role]: nextPermissions,
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Roles & permissions</div>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">Access control</h3>
          <p className="mt-1 text-sm text-slate-500">Define what each role can see and do inside the CRM workspace.</p>
        </div>
        <div className="rounded-xl border border-line bg-slate-50 px-4 py-3 flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-brand-blue" />
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Active roles</div>
            <div className="mt-0.5 text-lg font-bold text-slate-900">{ROLE_ORDER.length}</div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {ROLE_ORDER.map((role) => (
          <div key={role} className="rounded-xl border border-line bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-[15px] font-semibold text-slate-900">{role}</h4>
                <p className="mt-1 text-[13px] text-slate-500">
                  {role === 'Admin' && 'Workspace-wide ownership and system configuration.'}
                  {role === 'Sales Manager' && 'Manage pipeline, assignments, and team performance.'}
                  {role === 'Sales Executive' && 'Work assigned deals and keep customer records current.'}
                  {role === 'Support Agent' && 'Resolve tickets and stay close to customer history.'}
                  {role === 'Finance Manager' && 'Handle invoices, collections, and billing oversight.'}
                </p>
              </div>
              <span className="rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-600 border border-line">
                {roleCounts[role]} users
              </span>
            </div>

            <div className="mt-4 rounded-lg bg-slate-50/70 border border-line p-3">
              <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-600">
                <Users className="h-4 w-4 text-slate-500" />
                Permissions
              </div>
              <div className="mt-3 space-y-2">
                {ROLE_PERMISSIONS[role].map((permission) => (
                  <label key={permission} className="flex items-center justify-between gap-3 rounded-lg border border-transparent bg-white px-3 py-2 text-[13px] text-slate-700">
                    <span>{permission}</span>
                    <input
                      type="checkbox"
                      checked={permissionsByRole[role].includes(permission)}
                      onChange={() => togglePermission(role, permission)}
                      className="h-4 w-4 rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-line bg-slate-50/70 p-4 text-[13px] text-slate-600 flex items-start gap-3">
        <ShieldCheck className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
        <p>
          Roles are designed around CRM ownership patterns, so access stays aligned with sales, support, and finance workflows.
        </p>
      </div>

      <div className="flex justify-end border-t border-line pt-4">
        <button className="btn-primary" onClick={() => pushAppToast('Role permissions saved.', 'success')}>
          <Save className="h-4 w-4" />
          Save permissions
        </button>
      </div>
    </div>
  )
}
