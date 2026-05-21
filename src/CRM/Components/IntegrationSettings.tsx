import './IntegrationSettings.css'

export default function IntegrationSettings() {
  const integrations = [
    { name: 'Google Workspace', desc: 'Sync emails, calendar events, and contacts.', icon: 'G', connected: true },
    { name: 'Slack', desc: 'Receive real-time notifications in your channels.', icon: '#', connected: false },
    { name: 'Stripe', desc: 'Process payments and sync invoices automatically.', icon: 'S', connected: true },
    { name: 'Zoom', desc: 'Automatically create meeting links for events.', icon: 'Z', connected: false },
    { name: 'Mailchimp', desc: 'Sync your marketing audience and campaigns.', icon: 'M', connected: false },
    { name: 'Zendesk', desc: 'Connect support tickets with CRM customer data.', icon: 'Z', connected: false },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-800">Integrations</h3>
        <p className="text-sm text-slate-500 mt-1">Connect your CRM with the tools you use every day.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {integrations.map(app => (
          <div key={app.name} className="card-soft p-5 flex flex-col h-full">
            <div className="flex items-start justify-between mb-3">
              <div className={`integration-icon integration-${app.name.toLowerCase().replaceAll(' ', '-')}`}>
                {app.icon}
              </div>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                app.connected ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
              }`}>
                {app.connected ? 'Connected' : 'Not Connected'}
              </span>
            </div>
            <h4 className="font-semibold text-slate-800 text-[15px]">{app.name}</h4>
            <p className="text-[13px] text-slate-500 mt-1 mb-5 flex-1">{app.desc}</p>
            <button className={`w-full py-2 rounded-lg text-[13px] font-semibold transition-colors ${
              app.connected
                ? 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                : 'bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/20'
            }`}>
              {app.connected ? 'Manage Settings' : 'Connect'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
