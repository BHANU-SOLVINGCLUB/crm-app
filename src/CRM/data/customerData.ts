export type CustomerStatus = 'Active' | 'Inactive' | 'VIP' | 'Pending'
export type PaymentStatus = 'Paid' | 'Overdue' | 'Pending'
export type TicketStatus  = 'Open' | 'Closed' | 'In Progress'

export interface PurchaseRecord {
  date: string
  item: string
  amount: number
}

export interface SupportTicket {
  id: string
  issue: string
  status: TicketStatus
  date: string
}

export interface Customer {
  id: number
  name: string
  company: string
  phone: string
  email: string
  status: CustomerStatus
  revenue: number
  lastActivity: string
  lastActivityDays: number
  assignedManager: string
  renewalDate: string
  paymentStatus: PaymentStatus
  notes: string
  purchaseHistory: PurchaseRecord[]
  supportTickets: SupportTicket[]
}

export const fmtRevenue = (n: number) =>
  n >= 1_00_00_000
    ? `₹${(n / 1_00_00_000).toFixed(1)}Cr`
    : n >= 1_00_000
    ? `₹${(n / 1_00_000).toFixed(1)}L`
    : `₹${n.toLocaleString('en-IN')}`

export const statusColor: Record<CustomerStatus, { text: string; bg: string; dot: string }> = {
  Active:   { text: '#059669', bg: '#ecfdf5',  dot: '#059669' },
  Inactive: { text: '#dc2626', bg: '#fef2f2',  dot: '#dc2626' },
  VIP:      { text: '#7c3aed', bg: '#f5f3ff',  dot: '#7c3aed' },
  Pending:  { text: '#d97706', bg: '#fffbeb',  dot: '#d97706' },
}

export const payColor: Record<PaymentStatus, string> = {
  Paid:    '#059669',
  Overdue: '#dc2626',
  Pending: '#d97706',
}

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 1,
    name: 'Priya Sharma',
    company: 'TechNova Solutions',
    phone: '+91 98765 43210',
    email: 'priya.sharma@technova.in',
    status: 'VIP',
    revenue: 4850000,
    lastActivity: 'Contract renewed',
    lastActivityDays: 2,
    assignedManager: 'Rahul Mehta',
    renewalDate: '2026-08-15',
    paymentStatus: 'Paid',
    notes: 'Key enterprise account. Interested in AI automation add-on. Schedule quarterly review.',
    purchaseHistory: [
      { date: '2026-04-01', item: 'Enterprise Suite – Annual', amount: 2400000 },
      { date: '2025-10-15', item: 'AI Analytics Module', amount: 850000 },
      { date: '2025-04-01', item: 'Enterprise Suite – Annual', amount: 1600000 },
    ],
    supportTickets: [
      { id: 'TK-1041', issue: 'SSO integration not syncing', status: 'Closed', date: '2026-04-28' },
      { id: 'TK-1089', issue: 'Dashboard export slow', status: 'In Progress', date: '2026-05-10' },
    ],
  },
  {
    id: 2,
    name: 'Arjun Patel',
    company: 'FinEdge Capital',
    phone: '+91 91234 56789',
    email: 'arjun.patel@finedge.co',
    status: 'Active',
    revenue: 1920000,
    lastActivity: 'Call scheduled',
    lastActivityDays: 1,
    assignedManager: 'Sneha Iyer',
    renewalDate: '2026-09-30',
    paymentStatus: 'Paid',
    notes: 'Wants to upgrade to Pro plan. Discuss custom reporting requirements next call.',
    purchaseHistory: [
      { date: '2026-02-20', item: 'Pro Plan – Annual', amount: 960000 },
      { date: '2025-08-10', item: 'Onboarding Package', amount: 120000 },
      { date: '2025-02-20', item: 'Starter Plan – Annual', amount: 840000 },
    ],
    supportTickets: [
      { id: 'TK-1055', issue: 'CSV import failing', status: 'Closed', date: '2026-03-15' },
    ],
  },
  {
    id: 3,
    name: 'Kavya Nair',
    company: 'MediPlus Hospitals',
    phone: '+91 87654 32109',
    email: 'kavya.nair@mediplus.org',
    status: 'Active',
    revenue: 3200000,
    lastActivity: 'Invoice sent',
    lastActivityDays: 4,
    assignedManager: 'Rahul Mehta',
    renewalDate: '2026-11-01',
    paymentStatus: 'Pending',
    notes: 'Compliance team needs HIPAA documentation. Follow up on pending invoice.',
    purchaseHistory: [
      { date: '2026-03-01', item: 'Healthcare CRM Suite', amount: 1800000 },
      { date: '2025-09-15', item: 'Staff Training Pack', amount: 400000 },
      { date: '2025-03-01', item: 'Healthcare CRM Suite', amount: 1000000 },
    ],
    supportTickets: [
      { id: 'TK-1072', issue: 'Patient data sync delay', status: 'Open', date: '2026-05-08' },
      { id: 'TK-1083', issue: 'Report template missing', status: 'In Progress', date: '2026-05-12' },
    ],
  },
  {
    id: 4,
    name: 'Rohit Verma',
    company: 'AutoDrive Motors',
    phone: '+91 99887 76655',
    email: 'rohit.verma@autodrive.in',
    status: 'Pending',
    revenue: 720000,
    lastActivity: 'Demo completed',
    lastActivityDays: 3,
    assignedManager: 'Anita Das',
    renewalDate: '2026-06-20',
    paymentStatus: 'Pending',
    notes: 'Evaluating CRM vs competitor. Price-sensitive. Offer 15% discount on annual plan.',
    purchaseHistory: [
      { date: '2026-01-05', item: 'Trial Conversion – Starter', amount: 360000 },
      { date: '2025-07-20', item: 'Add-on: Lead Scoring', amount: 360000 },
    ],
    supportTickets: [
      { id: 'TK-1060', issue: 'Mobile app login issue', status: 'Closed', date: '2026-02-18' },
    ],
  },
  {
    id: 5,
    name: 'Divya Krishnamurthy',
    company: 'EduSpark Institute',
    phone: '+91 76543 21098',
    email: 'divya.k@eduspark.edu',
    status: 'VIP',
    revenue: 6100000,
    lastActivity: 'Upsell proposal',
    lastActivityDays: 0,
    assignedManager: 'Sneha Iyer',
    renewalDate: '2027-01-10',
    paymentStatus: 'Paid',
    notes: 'Flagship education account. Looking at multi-campus rollout. Prepare ROI deck.',
    purchaseHistory: [
      { date: '2026-05-01', item: 'Campus Suite – 3 Year', amount: 3600000 },
      { date: '2024-05-01', item: 'Campus Suite – 2 Year', amount: 2500000 },
    ],
    supportTickets: [
      { id: 'TK-1090', issue: 'Bulk enrolment import crash', status: 'Open', date: '2026-05-14' },
    ],
  },
  {
    id: 6,
    name: 'Manish Gupta',
    company: 'RetailFirst India',
    phone: '+91 82345 67890',
    email: 'manish.gupta@retailfirst.com',
    status: 'Inactive',
    revenue: 480000,
    lastActivity: 'No response',
    lastActivityDays: 45,
    assignedManager: 'Anita Das',
    renewalDate: '2026-05-31',
    paymentStatus: 'Overdue',
    notes: 'Churned after onboarding issues. Win-back campaign due. Overdue payment follow-up critical.',
    purchaseHistory: [
      { date: '2025-06-01', item: 'Basic Plan – Annual', amount: 480000 },
    ],
    supportTickets: [
      { id: 'TK-1010', issue: 'Onboarding walkthrough broken', status: 'Closed', date: '2025-07-01' },
      { id: 'TK-1015', issue: 'Data import failed', status: 'Closed', date: '2025-07-10' },
    ],
  },
  {
    id: 7,
    name: 'Swati Joshi',
    company: 'CloudMind Technologies',
    phone: '+91 94567 89012',
    email: 'swati.joshi@cloudmind.io',
    status: 'Active',
    revenue: 2750000,
    lastActivity: 'Feature request logged',
    lastActivityDays: 6,
    assignedManager: 'Rahul Mehta',
    renewalDate: '2026-10-15',
    paymentStatus: 'Paid',
    notes: 'Engineering team needs API docs. Interested in webhook integrations.',
    purchaseHistory: [
      { date: '2026-04-15', item: 'Developer Pro – Annual', amount: 1500000 },
      { date: '2025-10-15', item: 'API Module Add-on', amount: 750000 },
      { date: '2025-04-15', item: 'Developer Pro – Annual', amount: 500000 },
    ],
    supportTickets: [
      { id: 'TK-1077', issue: 'Webhook delivery lag', status: 'In Progress', date: '2026-05-05' },
    ],
  },
  {
    id: 8,
    name: 'Nikhil Rajan',
    company: 'GreenPath Logistics',
    phone: '+91 73456 78901',
    email: 'nikhil.r@greenpath.co.in',
    status: 'Active',
    revenue: 1350000,
    lastActivity: 'Monthly check-in',
    lastActivityDays: 8,
    assignedManager: 'Anita Das',
    renewalDate: '2026-12-01',
    paymentStatus: 'Paid',
    notes: 'Stable account. Consider upgrading to fleet management add-on.',
    purchaseHistory: [
      { date: '2026-01-01', item: 'Operations Suite – Annual', amount: 900000 },
      { date: '2025-01-01', item: 'Starter Ops – Annual', amount: 450000 },
    ],
    supportTickets: [],
  },
  {
    id: 9,
    name: 'Lakshmi Venkatesh',
    company: 'AgroSmart India',
    phone: '+91 63789 01234',
    email: 'lakshmi.v@agrosmart.farm',
    status: 'Pending',
    revenue: 540000,
    lastActivity: 'Trial started',
    lastActivityDays: 5,
    assignedManager: 'Sneha Iyer',
    renewalDate: '2026-06-14',
    paymentStatus: 'Pending',
    notes: 'Free trial ends June 14. Strong candidate for conversion. Send case studies.',
    purchaseHistory: [
      { date: '2026-05-01', item: 'AgriCRM Trial – 45 days', amount: 0 },
    ],
    supportTickets: [
      { id: 'TK-1088', issue: 'Soil sensor integration error', status: 'Open', date: '2026-05-11' },
    ],
  },
  {
    id: 10,
    name: 'Vikram Malhotra',
    company: 'SkyHigh Realty',
    phone: '+91 85678 23456',
    email: 'vikram.m@skyhigh.properties',
    status: 'Inactive',
    revenue: 960000,
    lastActivity: 'Cancelled subscription',
    lastActivityDays: 60,
    assignedManager: 'Rahul Mehta',
    renewalDate: '2026-07-01',
    paymentStatus: 'Overdue',
    notes: 'Downgraded and then cancelled. Competitor switch. Last chance for win-back.',
    purchaseHistory: [
      { date: '2025-07-01', item: 'Realty Pro – Annual', amount: 960000 },
    ],
    supportTickets: [
      { id: 'TK-999', issue: 'Bulk listing import error', status: 'Closed', date: '2025-08-20' },
    ],
  },
  {
    id: 11,
    name: 'Pooja Bansal',
    company: 'PixelCraft Studios',
    phone: '+91 90123 45678',
    email: 'pooja.b@pixelcraft.design',
    status: 'Active',
    revenue: 890000,
    lastActivity: 'Feedback survey sent',
    lastActivityDays: 3,
    assignedManager: 'Anita Das',
    renewalDate: '2026-09-01',
    paymentStatus: 'Paid',
    notes: 'Creative agency. Uses CRM for project tracking. Explore collaboration module.',
    purchaseHistory: [
      { date: '2025-09-01', item: 'Creative Pro – Annual', amount: 540000 },
      { date: '2025-03-10', item: 'Project Module Add-on', amount: 350000 },
    ],
    supportTickets: [
      { id: 'TK-1065', issue: 'Kanban view not loading', status: 'Closed', date: '2026-04-02' },
    ],
  },
  {
    id: 12,
    name: 'Suresh Nambiar',
    company: 'HarborTech Maritime',
    phone: '+91 88901 23456',
    email: 'suresh.n@harbortech.com',
    status: 'VIP',
    revenue: 8200000,
    lastActivity: 'Executive meeting',
    lastActivityDays: 1,
    assignedManager: 'Sneha Iyer',
    renewalDate: '2027-03-31',
    paymentStatus: 'Paid',
    notes: 'Strategic partner. Co-marketing opportunity. Exec sponsor: CFO.',
    purchaseHistory: [
      { date: '2026-04-01', item: 'Enterprise Global – 2 Year', amount: 5200000 },
      { date: '2024-04-01', item: 'Enterprise – Annual', amount: 3000000 },
    ],
    supportTickets: [
      { id: 'TK-1085', issue: 'Multi-region data residency', status: 'In Progress', date: '2026-05-09' },
    ],
  },
]


