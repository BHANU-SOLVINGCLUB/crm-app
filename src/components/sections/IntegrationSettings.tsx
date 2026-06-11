import { useMemo, useState } from 'react'
import { ExternalLink, Plug, RefreshCw, ShieldCheck, SlidersHorizontal } from 'lucide-react'
import { pushAppToast } from '../../store/uiStore'
import './IntegrationSettings.css'

type IntegrationState = {
  name: string
  description: string
  icon: string
  connected: boolean
  status: 'Connected' | 'Available'
  cadence: string
  owner: string
  lastSync: string
}

const INITIAL_INTEGRATIONS: IntegrationState[] = [
  { name: 'Google Workspace', description: 'Sync emails, contacts, and calendar events.', icon: 'G', connected: true, status: 'Connected', cadence: 'Every 5 min', owner: 'IT Admin', lastSync: '2 min ago' },
  { name: 'Slack', description: 'Push pipeline alerts and support escalations into channels.', icon: '#', connected: false, status: 'Available', cadence: 'Instant', owner: 'Operations', lastSync: 'Never' },
  { name: 'Stripe', description: 'Match invoices, payments, and billing alerts automatically.', icon: 'S', connected: true, status: 'Connected', cadence: 'Every 15 min', owner: 'Finance', lastSync: '8 min ago' },
  { name: 'Zoom', description: 'Attach meetings to customer and deal timelines.', icon: 'Z', connected: false, status: 'Available', cadence: 'On demand', owner: 'Sales Ops', lastSync: 'Never' },
  { name: 'Mailchimp', description: 'Sync audience segments and campaign outcomes.', icon: 'M', connected: false, status: 'Available', cadence: 'Every hour', owner: 'Marketing', lastSync: 'Never' },
  { name: 'Zendesk', description: 'Share customer context with support tickets.', icon: 'Z', connected: false, status: 'Available', cadence: 'Every 10 min', owner: 'Support Ops', lastSync: 'Never' },
]

export default function IntegrationSettings() {
  const [integrations, setIntegrations] = useState<IntegrationState[]>(INITIAL_INTEGRATIONS)

  const stats = useMemo(
    () => ({
      connected: integrations.filter((integration) => integration.connected).length,
      available: integrations.filter((integration) => !integration.connected).length,
    }),
    [integrations]
  )

  const toggleIntegration = (name: string) => {
    setIntegrations((current) =>
      current.map((app) => {
        if (app.name !== name) return app
        const connected = !app.connected
        pushAppToast(connected ? `${app.name} connected successfully.` : `${app.name} disconnected.`, 'success')
        return {
          ...app,
          connected,
          status: connected ? 'Connected' : 'Available',
          lastSync: connected ? 'just now' : 'Never',
        }
      })
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Integrations</div>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">Connected systems</h3>
          <p className="mt-1 text-sm text-slate-500">Connect the tools that feed leads, billing, support, and communication into the CRM.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="rounded-xl border border-line bg-slate-50 px-4 py-3">
            <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Connected</div>
            <div className="mt-1 text-2xl font-bold text-slate-900">{stats.connected}</div>
          </div>
          <div className="rounded-xl border border-line bg-slate-50 px-4 py-3">
            <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Available</div>
            <div className="mt-1 text-2xl font-bold text-slate-900">{stats.available}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {integrations.map((app) => (
          <div key={app.name} className="card-soft p-5 flex flex-col h-full">
            <div className="flex items-start justify-between mb-3">
              <div className={`integration-icon integration-${app.name.toLowerCase().replaceAll(' ', '-')}`}>
                {app.icon}
              </div>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                app.connected ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
              }`}>
                {app.status}
              </span>
            </div>

            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-semibold text-slate-900 text-[15px]">{app.name}</h4>
                <p className="text-[13px] text-slate-500 mt-1">{app.description}</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-[12px] text-slate-600">
              <div className="rounded-lg bg-slate-50 px-3 py-2">
                <div className="uppercase tracking-wider text-slate-400 font-semibold">Owner</div>
                <div className="mt-1 font-semibold text-slate-800">{app.owner}</div>
              </div>
              <div className="rounded-lg bg-slate-50 px-3 py-2">
                <div className="uppercase tracking-wider text-slate-400 font-semibold">Cadence</div>
                <div className="mt-1 font-semibold text-slate-800">{app.cadence}</div>
              </div>
            </div>

            <div className="mt-3 rounded-lg border border-dashed border-line bg-slate-50/60 px-3 py-2 text-[12px] text-slate-500 flex items-center justify-between gap-2">
              <span>Last sync: {app.lastSync}</span>
              <button
                className="text-brand-blue font-semibold hover:text-brand-blue/80"
                onClick={() => pushAppToast(`${app.name} sync settings opened.`, 'success')}
              >
                <SlidersHorizontal className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                className={`flex-1 py-2 rounded-lg text-[13px] font-semibold transition-colors ${
                  app.connected
                    ? 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                    : 'bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/20'
                }`}
                onClick={() => toggleIntegration(app.name)}
              >
                {app.connected ? (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </>
                ) : (
                  <>
                    <Plug className="h-4 w-4" />
                    Connect
                  </>
                )}
              </button>
              <button
                className="px-3 py-2 rounded-lg border border-line text-slate-600 hover:bg-slate-50 transition-colors"
                onClick={() => pushAppToast(`${app.name} documentation opened.`, 'success')}
                title="Open docs"
              >
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-line bg-slate-50/70 p-4 text-[13px] text-slate-600 flex items-start gap-3">
        <ShieldCheck className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
        <p>
          Connected apps are scoped to this workspace and inherit the same staff, role, and automation rules defined in Settings.
        </p>
      </div>
    </div>
  )
}
