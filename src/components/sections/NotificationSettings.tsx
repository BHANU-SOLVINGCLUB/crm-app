import { useMemo, useState } from 'react'
import { Bell, Mail, Save, Smartphone } from 'lucide-react'
import { pushAppToast } from '../../store/uiStore'

type NotificationItem = {
  id: string
  label: string
  email: boolean
  app: boolean
}

type Group = {
  title: string
  items: NotificationItem[]
}

const INITIAL_GROUPS: Group[] = [
  {
    title: 'Sales & pipeline',
    items: [
      { id: 'lead-assigned', label: 'New lead assigned to me', email: true, app: true },
      { id: 'deal-won', label: 'Deal moved to Won', email: true, app: true },
      { id: 'inactive-pipeline', label: 'Pipeline inactive for 7 days', email: true, app: false },
    ],
  },
  {
    title: 'Customer & support',
    items: [
      { id: 'ticket-created', label: 'New support ticket created', email: false, app: true },
      { id: 'payment-overdue', label: 'Customer payment overdue', email: true, app: true },
      { id: 'ticket-sla', label: 'Ticket SLA breached', email: true, app: true },
    ],
  },
  {
    title: 'Team & organization',
    items: [
      { id: 'weekly-report', label: 'Weekly performance report', email: true, app: false },
      { id: 'new-member', label: 'New team member joined', email: false, app: true },
      { id: 'maintenance', label: 'System maintenance alerts', email: true, app: true },
    ],
  },
]

export default function NotificationSettings() {
  const [groups, setGroups] = useState<Group[]>(INITIAL_GROUPS)

  const counts = useMemo(
    () => ({
      email: groups.flatMap((group) => group.items).filter((item) => item.email).length,
      app: groups.flatMap((group) => group.items).filter((item) => item.app).length,
    }),
    [groups]
  )

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Notifications</div>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">Delivery rules</h3>
          <p className="mt-1 text-sm text-slate-500">Choose which CRM events should reach the workspace inbox, email, or both.</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-line bg-slate-50 px-4 py-3">
            <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Email alerts</div>
            <div className="mt-1 text-2xl font-bold text-slate-900">{counts.email}</div>
          </div>
          <div className="rounded-xl border border-line bg-slate-50 px-4 py-3">
            <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">In-app alerts</div>
            <div className="mt-1 text-2xl font-bold text-slate-900">{counts.app}</div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-line bg-slate-50/70 p-4 flex items-center gap-3 text-[13px] text-slate-600">
        <Bell className="h-4 w-4 text-brand-blue" />
        Notification rules are workspace-wide. Staff still choose their own delivery preferences for the channels they can access.
      </div>

      <div className="space-y-6">
        {groups.map((group) => (
          <div key={group.title} className="rounded-xl border border-line overflow-hidden bg-white">
            <div className="px-5 py-3 bg-slate-50 border-b border-line flex items-center justify-between">
              <h4 className="font-semibold text-slate-800 text-[14px]">{group.title}</h4>
              <div className="flex gap-6 text-[12px] font-medium text-slate-500">
                <div className="flex items-center gap-1.5 w-14 justify-center"><Mail className="h-3.5 w-3.5" /> Email</div>
                <div className="flex items-center gap-1.5 w-14 justify-center"><Smartphone className="h-3.5 w-3.5" /> App</div>
              </div>
            </div>
            <div className="divide-y divide-line">
              {group.items.map((item) => (
                <div key={item.id} className="px-5 py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                  <span className="text-[13px] text-slate-700">{item.label}</span>
                  <div className="flex gap-6">
                    <div className="w-14 flex justify-center">
                      <input
                        type="checkbox"
                        checked={item.email}
                        onChange={(event) =>
                          setGroups((current) =>
                            current.map((currentGroup) => ({
                              ...currentGroup,
                              items: currentGroup.items.map((currentItem) =>
                                currentItem.id === item.id ? { ...currentItem, email: event.target.checked } : currentItem
                              ),
                            }))
                          )
                        }
                        className="rounded border-slate-300 text-brand-blue focus:ring-brand-blue h-4 w-4"
                      />
                    </div>
                    <div className="w-14 flex justify-center">
                      <input
                        type="checkbox"
                        checked={item.app}
                        onChange={(event) =>
                          setGroups((current) =>
                            current.map((currentGroup) => ({
                              ...currentGroup,
                              items: currentGroup.items.map((currentItem) =>
                                currentItem.id === item.id ? { ...currentItem, app: event.target.checked } : currentItem
                              ),
                            }))
                          )
                        }
                        className="rounded border-slate-300 text-brand-blue focus:ring-brand-blue h-4 w-4"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end border-t border-line pt-4">
        <button className="btn-primary" onClick={() => pushAppToast('Notification preferences saved.', 'success')}>
          <Save className="h-4 w-4" />
          Save preferences
        </button>
      </div>
    </div>
  )
}
