import { useState } from 'react'
import { Bell, Blocks, Building2, Database, Home, LayoutGrid, Search, ShieldCheck, Users, Workflow } from 'lucide-react'
import clsx from 'clsx'
import PageHeader from '../components/common/PageHeader'
import AdminSetupHome from '../components/sections/AdminSetupHome'
import OrganizationSettings from '../components/sections/OrganizationSettings'
import TeamSettings from '../components/sections/TeamSettings'
import RolesPermissionsSettings from '../components/sections/RolesPermissionsSettings'
import IntegrationSettings from '../components/sections/IntegrationSettings'
import NotificationSettings from '../components/sections/NotificationSettings'
import AutomationSettings from '../components/sections/AutomationSettings'
import DataModelSettings from '../components/sections/DataModelSettings'
import SecurityComplianceSettings from '../components/sections/SecurityComplianceSettings'
import DataAdministrationSettings from '../components/sections/DataAdministrationSettings'

export type SettingsTabId =
  | 'home'
  | 'organization'
  | 'team'
  | 'roles'
  | 'security'
  | 'data-model'
  | 'automation'
  | 'integrations'
  | 'data-admin'
  | 'notifications'

const SETTINGS_MENU = [
  { id: 'home', group: 'Setup', label: 'Setup Home', icon: Home, helper: 'Admin overview and recommended setup work.' },
  { id: 'organization', group: 'Company', label: 'Company Settings', icon: Building2, helper: 'Identity, branding, branches, and fiscal details.' },
  { id: 'team', group: 'Company', label: 'Staff & Users', icon: Users, helper: 'Invite staff and manage account status.' },
  { id: 'roles', group: 'Security', label: 'Roles & Permissions', icon: ShieldCheck, helper: 'Profiles, module access, and field actions.' },
  { id: 'security', group: 'Security', label: 'Security Center', icon: ShieldCheck, helper: 'Login policy, sessions, IP rules, and audit posture.' },
  { id: 'data-model', group: 'Customization', label: 'Modules & Fields', icon: LayoutGrid, helper: 'Customize CRM objects, fields, layouts, and pipelines.' },
  { id: 'automation', group: 'Automation', label: 'Workflow Rules', icon: Workflow, helper: 'Lead routing, reminders, approvals, and escalations.' },
  { id: 'integrations', group: 'Automation', label: 'Integrations', icon: Blocks, helper: 'Connect tools that feed sales and support data.' },
  { id: 'data-admin', group: 'Data', label: 'Data Administration', icon: Database, helper: 'Import, export, deduplicate, backup, and audit records.' },
  { id: 'notifications', group: 'Channels', label: 'Notifications', icon: Bell, helper: 'Triage alerts by channel and function.' },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTabId>('home')
  const [query, setQuery] = useState('')
  const normalizedQuery = query.trim().toLowerCase()
  const visibleMenu = normalizedQuery
    ? SETTINGS_MENU.filter((item) => `${item.group} ${item.label} ${item.helper}`.toLowerCase().includes(normalizedQuery))
    : SETTINGS_MENU

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <AdminSetupHome onSelect={setActiveTab} />
      case 'organization':
        return <OrganizationSettings />
      case 'team':
        return <TeamSettings />
      case 'roles':
        return <RolesPermissionsSettings />
      case 'security':
        return <SecurityComplianceSettings />
      case 'data-model':
        return <DataModelSettings />
      case 'automation':
        return <AutomationSettings />
      case 'integrations':
        return <IntegrationSettings />
      case 'data-admin':
        return <DataAdministrationSettings />
      case 'notifications':
        return <NotificationSettings />
      default:
        return null
    }
  }

  return (
    <div className="px-5 lg:px-8 py-6 lg:py-8 h-full flex flex-col">
      <PageHeader
        eyebrow="Administration"
        title="Settings"
        subtitle="Configure users, roles, CRM modules, security, automations, integrations, data controls, and workspace policies from one admin console."
      />

      <div className="flex flex-1 mt-6 bg-white border border-line rounded-xl overflow-hidden shadow-sm min-h-0">
        <aside className="w-72 border-r border-white/10 bg-[#1f3f70] flex flex-col shrink-0 min-h-0">
          <div className="p-4 border-b border-white/10">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-100/80">Workspace Settings</div>
            <div className="mt-1 text-[13px] text-blue-50/90">Admin controls for your CRM workspace.</div>
            <label className="mt-4 flex items-center gap-2 rounded-lg border border-white/15 bg-white px-3 py-2 shadow-sm">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search setup"
                className="w-full bg-transparent text-[13px] text-slate-700 outline-none placeholder:text-slate-400"
              />
            </label>
          </div>
          <nav className="flex-1 overflow-y-auto p-3 space-y-2">
            {visibleMenu.map((item, index) => {
              const Icon = item.icon
              const previous = visibleMenu[index - 1]
              const showGroup = !previous || previous.group !== item.group
              return (
                <div key={item.id}>
                  {showGroup && (
                    <div className="px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-100/80">
                      {item.group}
                    </div>
                  )}
                  <button
                    onClick={() => setActiveTab(item.id as SettingsTabId)}
                    className={clsx(
                      'w-full rounded-xl border px-3 py-3 text-left transition-colors',
                      activeTab === item.id
                        ? 'border-white/80 bg-white/12 shadow-sm'
                        : 'border-transparent hover:border-white/20 hover:bg-white/8'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={clsx(
                          'mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg border',
                          activeTab === item.id
                            ? 'border-white bg-white text-[#1f3f70]'
                            : 'border-white/20 bg-white/10 text-blue-50'
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={clsx('block text-[13px] font-semibold', activeTab === item.id ? 'text-white' : 'text-blue-50')}>
                          {item.label}
                        </span>
                        <span className={clsx('mt-1 block text-[12px] leading-5', activeTab === item.id ? 'text-blue-50/95' : 'text-blue-100/80')}>
                          {item.helper}
                        </span>
                      </span>
                    </div>
                  </button>
                </div>
              )
            })}
            {visibleMenu.length === 0 && (
              <div className="rounded-xl border border-dashed border-white/20 bg-white/8 px-3 py-4 text-[13px] text-blue-50">
                No setup areas match your search.
              </div>
            )}
          </nav>
        </aside>

        <div className="flex-1 min-h-0 overflow-y-auto bg-white p-6 md:p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
