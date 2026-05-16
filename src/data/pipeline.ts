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
}

export const STAGES = [
  { id: 'lead',        name: 'New Lead',     color: '#7b7fff', bg: '#EEEDFE' },
  { id: 'contacted',   name: 'Contacted',    color: '#4ca9ff', bg: '#EFF6FF' },
  { id: 'qualified',   name: 'Qualified',    color: '#00c9a7', bg: '#E1F5EE' },
  { id: 'proposal',    name: 'Proposal',     color: '#f4a83a', bg: '#FAEEDA' },
  { id: 'negotiation', name: 'Negotiation',  color: '#ff8c42', bg: '#FAECE7' },
  { id: 'closed',      name: 'Closed Won',   color: '#16a34a', bg: '#f0fdf4' },
]

export const INITIAL_DEALS: Deal[] = [
  { id:1,  company:'Ravi Pharma',       contact:'Ravi Shankar',   email:'ravi@ravipharma.in',       value:450000, stage:'proposal',     prob:70,  priority:'high',   closeDate:'2025-06-10', sector:'Healthcare', lastAct:'Proposal email sent',      lastActDays:2 },
  { id:2,  company:'BlueSky Retail',    contact:'Arjun Verma',    email:'arjun@bluesky.co',         value:280000, stage:'qualified',    prob:55,  priority:'medium', closeDate:'2025-06-28', sector:'Retail',     lastAct:'Discovery call done',      lastActDays:5 },
  { id:3,  company:'TechNova Pvt Ltd',  contact:'Meera Nair',     email:'meera@technova.in',        value:120000, stage:'contacted',    prob:30,  priority:'low',    closeDate:'2025-07-15', sector:'Technology', lastAct:'Intro email sent',         lastActDays:3 },
  { id:4,  company:'Sunrise Logistics', contact:'Deepak Pillai',  email:'deepak@sunrise.co',        value:675000, stage:'negotiation',  prob:85,  priority:'high',   closeDate:'2025-05-30', sector:'Logistics',  lastAct:'Pricing call with CFO',    lastActDays:1 },
  { id:5,  company:'GreenLeaf Foods',   contact:'Priya Menon',    email:'priya@greenleaf.in',       value:195000, stage:'lead',         prob:20,  priority:'medium', closeDate:'2025-08-01', sector:'FMCG',       lastAct:'Inbound inquiry received', lastActDays:0 },
  { id:6,  company:'Apex IT Solutions', contact:'Karan Malhotra', email:'karan@apexit.in',          value:540000, stage:'closed',       prob:100, priority:'high',   closeDate:'2025-05-12', sector:'IT',         lastAct:'Contract signed',          lastActDays:3 },
  { id:7,  company:'Harbour Finance',   contact:'Sunita Rao',     email:'sunita@harbourfinance.in', value:320000, stage:'proposal',     prob:65,  priority:'medium', closeDate:'2025-06-20', sector:'Finance',    lastAct:'Demo presented',           lastActDays:4 },
  { id:8,  company:'UrbanNest Realty',  contact:'Rahul Bose',     email:'rahul@urbannest.in',       value:890000, stage:'qualified',    prob:50,  priority:'high',   closeDate:'2025-07-05', sector:'Real Estate',lastAct:'Requirements gathered',    lastActDays:7 },
  { id:9,  company:'Shiv Agro Pvt',     contact:'Lata Sharma',    email:'lata@shivagro.in',         value:95000,  stage:'lead',         prob:15,  priority:'low',    closeDate:'2025-08-20', sector:'Agriculture',lastAct:'Referred by partner',      lastActDays:1 },
  { id:10, company:'Pixel Studio',      contact:'Ankit Joshi',    email:'ankit@pixel.studio',       value:180000, stage:'contacted',    prob:35,  priority:'medium', closeDate:'2025-07-10', sector:'Media',      lastAct:'Follow-up call done',      lastActDays:6 },
]

export const fmt = (v: number) => '₹' + Number(v).toLocaleString('en-IN')
export const pColor = (p: string) => p === 'high' ? '#E24B4A' : p === 'medium' ? '#EF9F27' : '#9ca3af'
export const pBg    = (p: string) => p === 'high' ? '#FEF2F2' : p === 'medium' ? '#FFFBEB' : '#F9FAFB'
export const probColor = (v: number) => v >= 70 ? '#16a34a' : v >= 40 ? '#f59e0b' : '#E24B4A'
