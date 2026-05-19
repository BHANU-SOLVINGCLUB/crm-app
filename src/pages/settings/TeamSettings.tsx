import { UserPlus, MoreHorizontal } from 'lucide-react'

const TEAM = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Admin', status: 'Active', initials: 'JD', color: '#3b82f6' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Sales Manager', status: 'Active', initials: 'JS', color: '#10b981' },
  { id: 3, name: 'Mike Johnson', email: 'mike.j@example.com', role: 'Support Agent', status: 'Inactive', initials: 'MJ', color: '#f59e0b' },
  { id: 4, name: 'Sarah Wilson', email: 'sarah.w@example.com', role: 'Sales Rep', status: 'Active', initials: 'SW', color: '#8b5cf6' },
]

export default function TeamSettings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Team Management</h3>
          <p className="text-sm text-slate-500 mt-1">Manage users, roles, and access permissions.</p>
        </div>
        <button className="btn-primary !py-1.5">
          <UserPlus className="h-4 w-4" /> Invite User
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-line text-[12px] uppercase tracking-wider text-slate-500 font-semibold">
              <th className="px-5 py-3">User</th>
              <th className="px-5 py-3">Role</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line text-[13px]">
            {TEAM.map(member => (
              <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="h-8 w-8 rounded-full flex items-center justify-center text-white font-bold text-[11px]"
                      style={{ backgroundColor: member.color }}
                    >
                      {member.initials}
                    </div>
                    <div>
                      <div className="font-medium text-slate-800">{member.name}</div>
                      <div className="text-[12px] text-slate-500">{member.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className="font-medium text-slate-700">{member.role}</span>
                </td>
                <td className="px-5 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                    member.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {member.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <button className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors">
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
