import { Smartphone, Mail, Save } from 'lucide-react'

export default function NotificationSettings() {
  const notifGroups = [
    {
      title: 'Sales & Pipeline',
      items: [
        { label: 'New lead assigned to me', email: true, app: true },
        { label: 'Deal moved to Won', email: true, app: true },
        { label: 'Pipeline inactive for 7 days', email: true, app: false },
      ]
    },
    {
      title: 'Customer & Support',
      items: [
        { label: 'New support ticket created', email: false, app: true },
        { label: 'Customer payment overdue', email: true, app: true },
        { label: 'Ticket SLA breached', email: true, app: true },
      ]
    },
    {
      title: 'Team & Organization',
      items: [
        { label: 'Weekly performance report', email: true, app: false },
        { label: 'New team member joined', email: false, app: true },
        { label: 'System maintenance alerts', email: true, app: true },
      ]
    }
  ]

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h3 className="text-lg font-semibold text-slate-800">Notifications</h3>
        <p className="text-sm text-slate-500 mt-1">Choose how and when you want to be notified.</p>
      </div>

      <div className="space-y-6">
        {notifGroups.map((group, idx) => (
          <div key={idx} className="card overflow-hidden">
            <div className="px-5 py-3 bg-slate-50 border-b border-line flex items-center justify-between">
              <h4 className="font-semibold text-slate-700 text-[14px]">{group.title}</h4>
              <div className="flex gap-6 text-[12px] font-medium text-slate-500">
                <div className="flex items-center gap-1.5 w-12 justify-center"><Mail className="h-3.5 w-3.5" /> Email</div>
                <div className="flex items-center gap-1.5 w-12 justify-center"><Smartphone className="h-3.5 w-3.5" /> App</div>
              </div>
            </div>
            <div className="divide-y divide-line">
              {group.items.map((item, i) => (
                <div key={i} className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                  <span className="text-[13px] text-slate-700">{item.label}</span>
                  <div className="flex gap-6">
                    <div className="w-12 flex justify-center">
                      <input type="checkbox" defaultChecked={item.email} className="rounded border-slate-300 text-brand-blue focus:ring-brand-blue h-4 w-4" />
                    </div>
                    <div className="w-12 flex justify-center">
                      <input type="checkbox" defaultChecked={item.app} className="rounded border-slate-300 text-brand-blue focus:ring-brand-blue h-4 w-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 flex justify-end border-t border-line">
        <button className="btn-primary">
          <Save className="h-4 w-4" /> Save Preferences
        </button>
      </div>
    </div>
  )
}
