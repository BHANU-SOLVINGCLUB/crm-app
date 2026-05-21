import { useState } from 'react'
import {
  User,
  Building2,
  Users,
  Bell,
  Blocks,
  Shield,
  CreditCard
} from 'lucide-react'
import clsx from 'clsx'
import PageHeader from '../Components/PageHeader'
import ProfileSettings from '../Components/ProfileSettings'
import OrganizationSettings from '../Components/OrganizationSettings'
import TeamSettings from '../Components/TeamSettings'
import IntegrationSettings from '../Components/IntegrationSettings'
import NotificationSettings from '../Components/NotificationSettings'

type TabId = 'profile' | 'organization' | 'team' | 'integrations' | 'notifications' | 'security' | 'billing'

const SETTINGS_MENU = [
  { id: 'profile', label: 'My Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'divider-1', divider: true },
  { id: 'organization', label: 'Organization', icon: Building2 },
  { id: 'team', label: 'Team & Roles', icon: Users },
  { id: 'integrations', label: 'Integrations', icon: Blocks },
  { id: 'divider-2', divider: true },
  { id: 'security', label: 'Security', icon: Shield, disabled: true },
  { id: 'billing', label: 'Billing & Plans', icon: CreditCard, disabled: true },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('profile')

  const renderContent = () => {
    switch (activeTab) {
      case 'profile': return <ProfileSettings />
      case 'organization': return <OrganizationSettings />
      case 'team': return <TeamSettings />
      case 'integrations': return <IntegrationSettings />
      case 'notifications': return <NotificationSettings />
      default: return null
    }
  }

  return (
    <div className="px-5 lg:px-8 py-6 lg:py-8 h-full flex flex-col">
      <PageHeader
        eyebrow="Configuration"
        title="Settings"
        subtitle="Manage your personal preferences and team configurations."
      />

      <div className="flex flex-1 mt-6 bg-white border border-line rounded-xl overflow-hidden shadow-sm">
        {/* Settings Sidebar */}
        <div className="w-64 border-r border-line bg-slate-50/50 flex flex-col shrink-0">
          <div className="p-4">
            <input 
              type="text" 
              placeholder="Search settings..." 
              className="input bg-white"
            />
          </div>
          <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
            {SETTINGS_MENU.map((item, idx) => {
              if (item.divider) {
                return <div key={`divider-${idx}`} className="h-px bg-line my-3 mx-2" />
              }
              const Icon = item.icon!
              return (
                <button
                  key={item.id}
                  disabled={item.disabled}
                  onClick={() => setActiveTab(item.id as TabId)}
                  className={clsx(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors text-left',
                    activeTab === item.id 
                      ? 'bg-brand-blue/10 text-brand-blue'
                      : item.disabled
                        ? 'text-slate-400 opacity-60 cursor-not-allowed'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  )}
                >
                  <Icon className={clsx('h-4 w-4', activeTab === item.id ? 'text-brand-blue' : 'text-slate-400')} />
                  <span className="flex-1">{item.label}</span>
                  {item.disabled && (
                    <span className="text-[9px] uppercase tracking-wider bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded font-bold">
                      Soon
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Settings Content Area */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-white">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}


