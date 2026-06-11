import { useMemo, useState } from 'react'
import { MoreHorizontal, Trash2, UserPlus, Users, UserCheck, UserCog } from 'lucide-react'
import { usePlatformStore } from '../../store/usePlatformStore'
import { pushAppToast } from '../../store/uiStore'
import './TeamSettings.css'

const roleOptions = ['Admin', 'Sales Manager', 'Sales Executive', 'Support Agent', 'Finance Manager']

const roleDefaults: Record<string, { department: string; team: string }> = {
  'Sales Manager': { department: 'Sales', team: 'Inside Sales' },
  'Sales Executive': { department: 'Sales', team: 'Inside Sales' },
  'Support Agent': { department: 'Support', team: 'Customer Success' },
  'Finance Manager': { department: 'Finance', team: 'Billing Ops' },
  Admin: { department: 'Administration', team: 'Operations' },
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function getAvatarColor(index: number) {
  const tones = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#0ea5e9']
  return tones[index % tones.length]
}

export default function TeamSettings() {
  const organization = usePlatformStore((state) => state.organization)
  const employees = organization.invitedEmployees
  const addEmployee = usePlatformStore((state) => state.addEmployee)
  const updateEmployee = usePlatformStore((state) => state.updateEmployee)
  const removeEmployee = usePlatformStore((state) => state.removeEmployee)
  const [showInviteForm, setShowInviteForm] = useState(false)
  const [draft, setDraft] = useState({
    name: '',
    email: '',
    role: 'Sales Executive',
    department: 'Sales',
    team: 'Inside Sales',
    status: 'Invited' as const,
  })

  const stats = useMemo(
    () => ({
      total: employees.length,
      active: employees.filter((employee) => employee.status === 'Active').length,
      invited: employees.filter((employee) => employee.status === 'Invited').length,
      managers: employees.filter((employee) => employee.role.toLowerCase().includes('manager') || employee.role.toLowerCase() === 'admin').length,
    }),
    [employees]
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Staff & users</div>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">Team directory</h3>
          <p className="mt-1 text-sm text-slate-500">Manage employees, account status, and the staff members who touch CRM records.</p>
        </div>
        <button
          className="btn-primary !py-1.5"
          onClick={() => {
            setShowInviteForm((current) => !current)
          }}
        >
          <UserPlus className="h-4 w-4" />
          Add staff
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="team-stat-card">
          <span className="team-stat-icon"><Users className="h-4 w-4" /></span>
          <small>Total Staff</small>
          <strong>{stats.total}</strong>
        </div>
        <div className="team-stat-card">
          <span className="team-stat-icon tone-emerald"><UserCheck className="h-4 w-4" /></span>
          <small>Active Members</small>
          <strong>{stats.active}</strong>
        </div>
        <div className="team-stat-card">
          <span className="team-stat-icon tone-amber"><UserPlus className="h-4 w-4" /></span>
          <small>Pending Invites</small>
          <strong>{stats.invited}</strong>
        </div>
        <div className="team-stat-card">
          <span className="team-stat-icon tone-violet"><UserCog className="h-4 w-4" /></span>
          <small>Admins & Managers</small>
          <strong>{stats.managers}</strong>
        </div>
      </div>

      {showInviteForm && (
        <div className="card p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h4 className="text-base font-semibold text-slate-900">Invite a staff member</h4>
              <p className="mt-1 text-sm text-slate-500">Add a user to the workspace and place them in the right team from day one.</p>
            </div>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <label className="team-field">
              <span>Name</span>
              <input className="input" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
            </label>
            <label className="team-field">
              <span>Email</span>
              <input className="input" type="email" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} />
            </label>
            <label className="team-field">
              <span>Role</span>
              <select
                className="input"
                value={draft.role}
                onChange={(event) => {
                  const role = event.target.value
                  const defaults = roleDefaults[role] ?? { department: draft.department, team: draft.team }
                  setDraft({ ...draft, role, department: defaults.department, team: defaults.team })
                }}
              >
                {roleOptions.map((role) => (
                  <option key={role}>{role}</option>
                ))}
              </select>
            </label>
            <label className="team-field">
              <span>Department</span>
              <input className="input" value={draft.department} onChange={(event) => setDraft({ ...draft, department: event.target.value })} />
            </label>
            <label className="team-field">
              <span>Team</span>
              <input className="input" value={draft.team} onChange={(event) => setDraft({ ...draft, team: event.target.value })} />
            </label>
            <label className="team-field">
              <span>Status</span>
              <select className="input" value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as typeof draft.status })}>
                <option>Invited</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </label>
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <button className="btn-ghost" onClick={() => setShowInviteForm(false)}>Cancel</button>
            <button
              className="btn-primary"
              onClick={() => {
                if (!draft.name.trim() || !draft.email.trim()) {
                  pushAppToast('Name and email are required to add staff.', 'info')
                  return
                }
                addEmployee(draft)
                pushAppToast(`${draft.name} added to the staff directory.`, 'success')
                setDraft({
                  name: '',
                  email: '',
                  role: 'Sales Executive',
                  department: 'Sales',
                  team: 'Inside Sales',
                  status: 'Invited',
                })
                setShowInviteForm(false)
              }}
            >
              Save staff member
            </button>
          </div>
        </div>
      )}

      <div className="card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-line text-[12px] uppercase tracking-wider text-slate-500 font-semibold">
              <th className="px-5 py-3">User</th>
              <th className="px-5 py-3">Role</th>
              <th className="px-5 py-3">Department</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line text-[13px]">
            {employees.map((member, index) => (
              <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="team-avatar" style={{ background: getAvatarColor(index) }}>{getInitials(member.name)}</div>
                    <div>
                      <div className="font-medium text-slate-800">{member.name}</div>
                      <div className="text-[12px] text-slate-500">{member.email}</div>
                      <div className="text-[12px] text-slate-400">{member.team}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <select
                    className="input !py-2 !text-[13px]"
                    value={member.role}
                    onChange={(event) => {
                      const role = event.target.value
                      const defaults = roleDefaults[role] ?? { department: member.department, team: member.team }
                      updateEmployee(member.id, { role, department: defaults.department, team: defaults.team })
                      pushAppToast(`${member.name} updated to ${role}.`, 'success')
                    }}
                  >
                    {roleOptions.map((role) => (
                      <option key={role}>{role}</option>
                    ))}
                  </select>
                </td>
                <td className="px-5 py-3">
                  <input
                    className="input !py-2 !text-[13px]"
                    value={member.department}
                    onChange={(event) => updateEmployee(member.id, { department: event.target.value })}
                    onBlur={() => pushAppToast(`${member.name}'s department updated.`, 'success')}
                  />
                </td>
                <td className="px-5 py-3">
                  <select
                    className="team-status-select"
                    value={member.status}
                    onChange={(event) => {
                      updateEmployee(member.id, { status: event.target.value as 'Active' | 'Invited' | 'Inactive' })
                      pushAppToast(`${member.name} marked ${event.target.value}.`, 'success')
                    }}
                  >
                    <option>Active</option>
                    <option>Invited</option>
                    <option>Inactive</option>
                  </select>
                </td>
                <td className="px-5 py-3 text-right">
                  <div className="inline-flex items-center gap-2">
                    <button
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors"
                      onClick={() => pushAppToast(`Member actions opened for ${member.name}.`, 'success')}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                    <button
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
                      onClick={() => {
                        removeEmployee(member.id)
                        pushAppToast(`${member.name} removed from staff directory.`, 'success')
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
