import { useMemo, useState } from 'react'
import { Plus, Save, Workflow } from 'lucide-react'
import { pushAppToast } from '../../store/uiStore'

type AutomationRule = {
  id: string
  name: string
  trigger: string
  action: string
  owner: string
  enabled: boolean
}

const INITIAL_RULES: AutomationRule[] = [
  {
    id: 'rule-1',
    name: 'Lead assignment',
    trigger: 'New lead created',
    action: 'Assign to the on-duty sales rep',
    owner: 'Sales Ops',
    enabled: true,
  },
  {
    id: 'rule-2',
    name: 'Invoice reminder',
    trigger: 'Invoice due in 3 days',
    action: 'Send finance reminder to customer and owner',
    owner: 'Finance',
    enabled: true,
  },
  {
    id: 'rule-3',
    name: 'SLA escalation',
    trigger: 'Ticket unresolved after 24 hours',
    action: 'Escalate to support manager',
    owner: 'Support',
    enabled: false,
  },
]

const TRIGGERS = [
  'New lead created',
  'Deal stage changed',
  'Invoice due in 3 days',
  'Ticket unresolved after 24 hours',
  'Customer marked at risk',
]

const ACTIONS = [
  'Assign to the on-duty sales rep',
  'Send finance reminder to customer and owner',
  'Escalate to support manager',
  'Create a follow-up task',
  'Notify the account owner in-app',
]

const OWNERS = ['Sales Ops', 'Support', 'Finance', 'Operations']

export default function AutomationSettings() {
  const [rules, setRules] = useState<AutomationRule[]>(INITIAL_RULES)
  const [draft, setDraft] = useState({
    name: '',
    trigger: TRIGGERS[0],
    action: ACTIONS[0],
    owner: OWNERS[0],
  })

  const stats = useMemo(
    () => ({
      enabled: rules.filter((rule) => rule.enabled).length,
      disabled: rules.filter((rule) => !rule.enabled).length,
    }),
    [rules]
  )

  const addRule = () => {
    if (!draft.name.trim()) {
      pushAppToast('Give the automation a name first.', 'info')
      return
    }

    setRules((current) => [
      {
        id: `rule-${Date.now()}`,
        name: draft.name.trim(),
        trigger: draft.trigger,
        action: draft.action,
        owner: draft.owner,
        enabled: true,
      },
      ...current,
    ])

    setDraft({
      name: '',
      trigger: TRIGGERS[0],
      action: ACTIONS[0],
      owner: OWNERS[0],
    })
    pushAppToast('Automation rule created.', 'success')
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Automation</div>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">Workflow rules</h3>
          <p className="mt-1 text-sm text-slate-500">Automate common handoffs so lead, support, and finance work keeps moving.</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-line bg-slate-50 px-4 py-3">
            <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Enabled</div>
            <div className="mt-1 text-2xl font-bold text-slate-900">{stats.enabled}</div>
          </div>
          <div className="rounded-xl border border-line bg-slate-50 px-4 py-3">
            <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Paused</div>
            <div className="mt-1 text-2xl font-bold text-slate-900">{stats.disabled}</div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-line bg-slate-50/70 p-4 flex items-start gap-3 text-[13px] text-slate-600">
        <Workflow className="h-4 w-4 text-brand-blue mt-0.5 shrink-0" />
        Automations can assign ownership, trigger reminders, and route escalations without manual follow-up.
      </div>

      <div className="rounded-xl border border-line bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h4 className="text-[15px] font-semibold text-slate-900">Create rule</h4>
            <p className="mt-1 text-[13px] text-slate-500">Set a trigger, action, and owning team for the workflow.</p>
          </div>
          <button className="btn-ghost !text-[13px]" onClick={addRule}>
            <Plus className="h-4 w-4" />
            Add rule
          </button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="grid gap-1.5 xl:col-span-2">
            <span className="text-[12px] font-semibold uppercase tracking-wider text-slate-500">Rule name</span>
            <input className="input" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="Lead reassignment" />
          </label>
          <label className="grid gap-1.5">
            <span className="text-[12px] font-semibold uppercase tracking-wider text-slate-500">Owner</span>
            <select className="input" value={draft.owner} onChange={(event) => setDraft({ ...draft, owner: event.target.value })}>
              {OWNERS.map((owner) => (
                <option key={owner}>{owner}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-1.5">
            <span className="text-[12px] font-semibold uppercase tracking-wider text-slate-500">Trigger</span>
            <select className="input" value={draft.trigger} onChange={(event) => setDraft({ ...draft, trigger: event.target.value })}>
              {TRIGGERS.map((trigger) => (
                <option key={trigger}>{trigger}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-1.5 xl:col-span-2">
            <span className="text-[12px] font-semibold uppercase tracking-wider text-slate-500">Action</span>
            <select className="input" value={draft.action} onChange={(event) => setDraft({ ...draft, action: event.target.value })}>
              {ACTIONS.map((action) => (
                <option key={action}>{action}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="space-y-3">
        {rules.map((rule) => (
          <div key={rule.id} className="rounded-xl border border-line bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h4 className="text-[15px] font-semibold text-slate-900">{rule.name}</h4>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${rule.enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {rule.enabled ? 'Enabled' : 'Paused'}
                  </span>
                </div>
                <div className="mt-2 grid gap-2 text-[13px] text-slate-600 md:grid-cols-3">
                  <div className="rounded-lg bg-slate-50 px-3 py-2">
                    <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Trigger</div>
                    <div className="mt-1 font-semibold text-slate-800">{rule.trigger}</div>
                  </div>
                  <div className="rounded-lg bg-slate-50 px-3 py-2 md:col-span-1">
                    <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Action</div>
                    <div className="mt-1 font-semibold text-slate-800">{rule.action}</div>
                  </div>
                  <div className="rounded-lg bg-slate-50 px-3 py-2">
                    <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Owner</div>
                    <div className="mt-1 font-semibold text-slate-800">{rule.owner}</div>
                  </div>
                </div>
              </div>

              <button
                className={`rounded-lg px-3 py-2 text-[13px] font-semibold border transition-colors ${
                  rule.enabled ? 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100' : 'border-brand-blue/20 bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/20'
                }`}
                onClick={() => {
                  setRules((current) =>
                    current.map((currentRule) =>
                      currentRule.id === rule.id ? { ...currentRule, enabled: !currentRule.enabled } : currentRule
                    )
                  )
                  pushAppToast(`${rule.name} ${rule.enabled ? 'paused' : 'enabled'}.`, 'success')
                }}
              >
                {rule.enabled ? 'Pause' : 'Enable'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end border-t border-line pt-4">
        <button className="btn-primary" onClick={() => pushAppToast('Automation settings saved.', 'success')}>
          <Save className="h-4 w-4" />
          Save automation
        </button>
      </div>
    </div>
  )
}
