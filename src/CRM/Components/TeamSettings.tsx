import { UserPlus, MoreHorizontal } from 'lucide-react'
import { pushAppToast } from '../store/uiStore'
import './TeamSettings.css'

const TEAM = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Admin', status: 'Active', initials: 'JD' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Sales Manager', status: 'Active', initials: 'JS' },
  { id: 3, name: 'Mike Johnson', email: 'mike.j@example.com', role: 'Support Agent', status: 'Inactive', initials: 'MJ' },
  { id: 4, name: 'Sarah Wilson', email: 'sarah.w@example.com', role: 'Sales Rep', status: 'Active', initials: 'SW' },
]

export default function TeamSettings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-theme-primary">Team Management</h3>
          <p className="text-sm text-theme-secondary mt-1">Manage users, roles, and access permissions.</p>
        </div>
        <button className="btn-primary !py-1.5" onClick={() => pushAppToast('Invite user dialog opened.', 'success')}>
          <UserPlus className="h-4 w-4" /> Invite User
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-theme-surface border-b border-theme text-[12px] uppercase tracking-wider text-theme-secondary font-semibold">
              <th className="px-5 py-3">User</th>
              <th className="px-5 py-3">Role</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line text-[13px]">
            {TEAM.map(member => (
              <tr key={member.id} className="hover:bg-theme-surface transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`team-avatar team-avatar-${member.id}`}>{member.initials}</div>
                    <div>
                      <div className="font-medium text-theme-primary">{member.name}</div>
                      <div className="text-[12px] text-theme-secondary">{member.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className="font-medium text-theme-primary">{member.role}</span>
                </td>
                <td className="px-5 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                    member.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-theme-surface text-theme-secondary'
                  }`}>
                    {member.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <button className="p-1.5 text-theme-muted hover:text-theme-primary rounded-md hover:bg-theme-surface transition-colors" onClick={() => pushAppToast(`Member actions opened for ${member.name}.`, 'success')}>
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
