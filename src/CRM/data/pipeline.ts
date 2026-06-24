export interface Deal {
  id: number
  company: string
  contact: string
  email: string
  value: number
  stage: string
  prob: number
  priority: 'high' | 'medium' | 'low'
  closeDate: string
  sector: string
  lastAct: string
  lastActDays: number
  assignedTo: number | null   // real backend assigned_to FK — replaces fake DEAL_OWNERS array
}

export const STAGES = [
  { id: 'lead',        name: 'New Lead',     color: '#7b7fff', bg: '#EEEDFE' },
  { id: 'contacted',   name: 'Contacted',    color: '#4ca9ff', bg: '#EFF6FF' },
  { id: 'qualified',   name: 'Qualified',    color: '#00c9a7', bg: '#E1F5EE' },
  { id: 'proposal',    name: 'Proposal',     color: '#f4a83a', bg: '#FAEEDA' },
  { id: 'negotiation', name: 'Negotiation',  color: '#ff8c42', bg: '#FAECE7' },
  { id: 'closed',      name: 'Closed Won',   color: '#16a34a', bg: '#f0fdf4' },
]

// INITIAL_DEALS is kept as a loading placeholder only — it's replaced
// immediately by the real backend fetch. It no longer shows as real data.
export const INITIAL_DEALS: Deal[] = []

export const fmt = (v: number) => '₹' + Number(v).toLocaleString('en-IN')
export const pColor = (p: string) => p === 'high' ? '#E24B4A' : p === 'medium' ? '#EF9F27' : '#9ca3af'
export const pBg    = (p: string) => p === 'high' ? '#FEF2F2' : p === 'medium' ? '#FFFBEB' : '#F9FAFB'
export const probColor = (v: number) => v >= 70 ? '#16a34a' : v >= 40 ? '#f59e0b' : '#E24B4A'