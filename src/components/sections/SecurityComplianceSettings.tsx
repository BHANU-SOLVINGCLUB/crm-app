import { useMemo, useState } from 'react'
import { KeyRound, LockKeyhole, Save, ShieldCheck, Timer, UserCheck } from 'lucide-react'
import { pushAppToast } from '../../store/uiStore'

const INITIAL_POLICIES = [
  { id: 'mfa', title: 'Two-factor authentication', description: 'Require a verification code after email/password login.', enabled: true, icon: KeyRound },
  { id: 'session', title: 'Session timeout', description: 'End inactive sessions after a defined period.', enabled: true, icon: Timer },
  { id: 'ip', title: 'Trusted IP ranges', description: 'Restrict admin access to approved networks.', enabled: false, icon: LockKeyhole },
  { id: 'approval', title: 'Admin change approvals', description: 'Require approval before high-impact setup changes go live.', enabled: false, icon: UserCheck },
]

const AUDIT_EVENTS = [
  { time: 'Today, 10:14 AM', actor: 'Nisha Verma', action: 'Updated Sales Manager permissions', severity: 'Normal' },
  { time: 'Yesterday, 5:32 PM', actor: 'Bhavik Kumar', action: 'Enabled invoice reminder workflow', severity: 'Normal' },
  { time: 'Yesterday, 2:05 PM', actor: 'Rohan Shah', action: 'Viewed support ticket export', severity: 'Review' },
  { time: 'May 30, 9:28 AM', actor: 'System', action: 'Completed scheduled workspace backup', severity: 'Normal' },
]

export default function SecurityComplianceSettings() {
  const [policies, setPolicies] = useState(INITIAL_POLICIES)
  const enabledCount = useMemo(() => policies.filter((policy) => policy.enabled).length, [policies])

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Security center</div>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">Login, access, and audit controls</h3>
          <p className="mt-1 text-sm text-slate-500">Manage authentication policy, admin safeguards, session rules, and workspace audit posture.</p>
        </div>
        <div className="rounded-xl border border-line bg-slate-50 px-4 py-3">
          <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-700">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Policies enabled
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{enabledCount}/{policies.length}</div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {policies.map((policy) => {
          const Icon = policy.icon
          return (
            <div key={policy.id} className="rounded-xl border border-line bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-slate-50 text-brand-blue">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <h4 className="text-[15px] font-semibold text-slate-900">{policy.title}</h4>
                    <p className="mt-1 text-[13px] leading-5 text-slate-500">{policy.description}</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={policy.enabled}
                  onChange={(event) =>
                    setPolicies((current) =>
                      current.map((item) => (item.id === policy.id ? { ...item, enabled: event.target.checked } : item))
                    )
                  }
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
                />
              </div>
            </div>
          )
        })}
      </div>

      <div className="rounded-xl border border-line bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h4 className="text-[15px] font-semibold text-slate-900">Audit trail</h4>
            <p className="mt-1 text-[13px] text-slate-500">Recent setup and data governance events for admins to review.</p>
          </div>
          <button className="btn-ghost !text-[13px]" onClick={() => pushAppToast('Audit export prepared.', 'success')}>
            Export audit log
          </button>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-line">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Actor</th>
                <th className="px-4 py-3">Event</th>
                <th className="px-4 py-3">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {AUDIT_EVENTS.map((event) => (
                <tr key={`${event.time}-${event.action}`}>
                  <td className="px-4 py-3 text-slate-600">{event.time}</td>
                  <td className="px-4 py-3 font-semibold text-slate-800">{event.actor}</td>
                  <td className="px-4 py-3 text-slate-600">{event.action}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${event.severity === 'Review' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {event.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end border-t border-line pt-4">
        <button className="btn-primary" onClick={() => pushAppToast('Security settings saved.', 'success')}>
          <Save className="h-4 w-4" />
          Save security policy
        </button>
      </div>
    </div>
  )
}
