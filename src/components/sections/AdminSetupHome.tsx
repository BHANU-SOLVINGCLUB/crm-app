import { Activity, Bell, Blocks, Building2, CheckCircle2, Database, LayoutGrid, ShieldCheck, Users, Workflow } from 'lucide-react'
import { usePlatformStore } from '../../store/usePlatformStore'
import type { SettingsTabId } from '../../pages/SettingsPage'

type Props = {
  onSelect: (tab: SettingsTabId) => void
}

const setupAreas: Array<{
  id: SettingsTabId
  title: string
  description: string
  icon: typeof Building2
  status: string
}> = [
  { id: 'organization', title: 'Company profile', description: 'Business identity, branches, tax details, and default workspace settings.', icon: Building2, status: 'Configured' },
  { id: 'team', title: 'Users', description: 'Invite users, control account status, and align staff to departments.', icon: Users, status: 'Live' },
  { id: 'roles', title: 'Roles and profiles', description: 'Manage module access, field actions, and setup permissions by role.', icon: ShieldCheck, status: 'Review' },
  { id: 'data-model', title: 'Modules and fields', description: 'Customize Leads, Deals, Customers, Tickets, and Invoices.', icon: LayoutGrid, status: 'Ready' },
  { id: 'automation', title: 'Workflow rules', description: 'Route leads, create reminders, approve handoffs, and escalate service issues.', icon: Workflow, status: 'Active' },
  { id: 'integrations', title: 'Integrations', description: 'Connect email, calendar, billing, support, and collaboration systems.', icon: Blocks, status: 'Connected' },
  { id: 'data-admin', title: 'Data administration', description: 'Import, export, deduplicate, backup, and review audit activity.', icon: Database, status: 'Scheduled' },
  { id: 'notifications', title: 'Notification channels', description: 'Control workspace alerts for pipeline, support, finance, and security events.', icon: Bell, status: 'Enabled' },
]

const setupFlow = [
  'Create company profile',
  'Add departments and branches',
  'Add employees',
  'Assign roles and permissions',
  'Configure security controls',
  'Customize modules and fields',
  'Create workflow automations',
  'Connect integrations',
  'Import business data',
  'Configure notifications',
]

export default function AdminSetupHome({ onSelect }: Props) {
  const organization = usePlatformStore((state) => state.organization)
  const activeStaff = organization.invitedEmployees.filter((employee) => employee.status === 'Active').length
  const invitedStaff = organization.invitedEmployees.filter((employee) => employee.status === 'Invited').length

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Setup home</div>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">CRM administration console</h3>
          <p className="mt-1 max-w-3xl text-sm text-slate-500">
            Configure the workspace the same way a mature CRM admin would: users, profiles, modules, automations, integrations, data governance, and security.
          </p>
        </div>
        <div className="rounded-xl border border-line bg-slate-50 px-4 py-3">
          <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-700">
            <Activity className="h-4 w-4 text-brand-blue" />
            Setup health
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">86%</div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-line bg-white p-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Company</div>
          <div className="mt-2 text-lg font-bold text-slate-900">{organization.companyName}</div>
          <div className="mt-1 text-[12px] text-slate-500">{organization.industry}</div>
        </div>
        <div className="rounded-xl border border-line bg-white p-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Active staff</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{activeStaff}</div>
          <div className="mt-1 text-[12px] text-slate-500">{invitedStaff} pending invites</div>
        </div>
        <div className="rounded-xl border border-line bg-white p-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Modules</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{organization.selectedModules.length}</div>
          <div className="mt-1 text-[12px] text-slate-500">CRM apps enabled</div>
        </div>
        <div className="rounded-xl border border-line bg-white p-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Security</div>
          <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
            MFA ready
          </div>
          <div className="mt-1 text-[12px] text-slate-500">Session and audit controls available</div>
        </div>
      </div>

      <div className="rounded-xl border border-line bg-slate-50 p-5">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Complete CRM setup flow</div>
        <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {setupFlow.map((step, index) => (
            <div key={step} className="rounded-lg border border-line bg-white px-3 py-2 text-[13px] text-slate-700">
              <span className="font-semibold text-slate-900">Step {index + 1}:</span> {step}
            </div>
          ))}
        </div>
        <p className="mt-4 text-[13px] text-slate-600">
          The Settings module is the administrative control center where your company configures users, security, CRM structure, automations, integrations, data policies, and notification rules.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {setupAreas.map((area) => {
          const Icon = area.icon
          return (
            <button
              key={area.id}
              className="rounded-xl border border-line bg-white p-5 text-left transition-colors hover:border-brand-blue/30 hover:bg-slate-50"
              onClick={() => onSelect(area.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-slate-50 text-brand-blue">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="rounded-full border border-line bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  {area.status}
                </span>
              </div>
              <h4 className="mt-4 text-[15px] font-semibold text-slate-900">{area.title}</h4>
              <p className="mt-2 text-[13px] leading-5 text-slate-500">{area.description}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
