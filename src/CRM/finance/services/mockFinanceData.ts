import type {
  CollectionRecord,
  ExpenseRecord,
  FinanceKpi,
  FinanceSettingsSection,
  InvoiceRecord,
  MonthlyFinanceDatum,
  PaymentRecord,
  ReportRecord,
  SegmentDatum,
  TransactionItem,
} from '../types'

export const financeKpis: FinanceKpi[] = [
  { label: 'Total Revenue', value: 32400000, delta: 18.6, hint: 'vs previous month', accent: '#10b981' },
  { label: 'Outstanding Amount', value: 4280000, delta: -4.2, hint: 'faster collections', accent: '#f43f5e' },
  { label: 'Collected This Month', value: 8800000, delta: 9.4, hint: 'cash received', accent: '#3b82f6' },
  { label: 'Net Profit', value: 2470000, delta: 6.8, hint: 'after operating expenses', accent: '#8b5cf6' },
]

export const monthlyFinanceData: MonthlyFinanceDatum[] = [
  { month: 'Jan', revenue: 3500000, expenses: 1800000, profit: 1700000, cashFlow: 1200000 },
  { month: 'Feb', revenue: 4100000, expenses: 2100000, profit: 2000000, cashFlow: 1600000 },
  { month: 'Mar', revenue: 3880000, expenses: 2050000, profit: 1830000, cashFlow: 1480000 },
  { month: 'Apr', revenue: 4500000, expenses: 2320000, profit: 2180000, cashFlow: 1840000 },
  { month: 'May', revenue: 4920000, expenses: 2510000, profit: 2410000, cashFlow: 2010000 },
  { month: 'Jun', revenue: 5210000, expenses: 2760000, profit: 2450000, cashFlow: 2140000 },
]

export const revenueSegments: SegmentDatum[] = [
  { name: 'Enterprise', value: 48, amount: 15550000, color: '#2563eb' },
  { name: 'Mid-market', value: 29, amount: 9390000, color: '#8b5cf6' },
  { name: 'SMB', value: 15, amount: 4860000, color: '#10b981' },
  { name: 'Renewals', value: 8, amount: 2590000, color: '#f59e0b' },
]

export const recentTransactions: TransactionItem[] = [
  { id: 'TXN-9087', customer: 'Northstar Logistics', amount: 680000, type: 'Bank transfer', createdAt: '2026-05-27', positive: true },
  { id: 'TXN-9081', customer: 'Veridian Health', amount: 245000, type: 'Refund processed', createdAt: '2026-05-26', positive: false },
  { id: 'TXN-9072', customer: 'BluePeak Energy', amount: 390000, type: 'Card settlement', createdAt: '2026-05-24', positive: true },
  { id: 'TXN-9060', customer: 'Aster Retail Group', amount: 510000, type: 'UPI collection', createdAt: '2026-05-22', positive: true },
]

export const invoices: InvoiceRecord[] = [
  {
    id: 'INV-2026-118',
    customer: 'Ananya Rao',
    company: 'Northstar Logistics',
    segment: 'Enterprise',
    amount: 1250000,
    tax: 225000,
    dueDate: '2026-06-04',
    status: 'Partial',
    createdBy: 'Kiran Menon',
    updatedAt: '2026-05-26',
    email: 'ananya@northstarlogistics.com',
    billingAddress: 'Tower 5, MG Road, Bengaluru',
    notes: 'Customer requested split payment against implementation milestone.',
    attachments: ['msa-northstar.pdf', 'gst-breakup.xlsx'],
    lineItems: [
      { description: 'CRM Enterprise subscription', quantity: 1, rate: 780000, total: 780000 },
      { description: 'Implementation services', quantity: 1, rate: 310000, total: 310000 },
      { description: 'Priority support add-on', quantity: 1, rate: 160000, total: 160000 },
    ],
    paymentHistory: [
      { id: 'PAY-5512', amount: 500000, method: 'Bank Transfer', status: 'Partial', date: '2026-05-22' },
      { id: 'PAY-5548', amount: 350000, method: 'UPI', status: 'Success', date: '2026-05-26' },
    ],
    timeline: [
      { id: 'TL-1', title: 'Invoice viewed', description: 'Billing contact opened invoice from email.', time: '2026-05-25 11:24' },
      { id: 'TL-2', title: 'Partial payment received', description: 'Collection bot matched incoming payment to invoice.', time: '2026-05-26 15:08' },
    ],
  },
  {
    id: 'INV-2026-114',
    customer: 'Rahul Shah',
    company: 'BluePeak Energy',
    segment: 'Mid-market',
    amount: 840000,
    tax: 151200,
    dueDate: '2026-05-21',
    status: 'Overdue',
    createdBy: 'Asha Kumar',
    updatedAt: '2026-05-27',
    email: 'rahul@bluepeakenergy.com',
    billingAddress: 'Plot 18, Banjara Hills, Hyderabad',
    notes: 'Customer has requested 7-day extension pending PO approval.',
    attachments: ['po-followup.msg'],
    lineItems: [
      { description: 'Platform renewal', quantity: 1, rate: 620000, total: 620000 },
      { description: 'Analytics workspace', quantity: 1, rate: 220000, total: 220000 },
    ],
    paymentHistory: [],
    timeline: [
      { id: 'TL-3', title: 'Reminder sent', description: 'Second reminder sent to AP and account owner.', time: '2026-05-24 09:00' },
    ],
  },
  {
    id: 'INV-2026-109',
    customer: 'Priya Nair',
    company: 'Veridian Health',
    segment: 'Enterprise',
    amount: 1460000,
    tax: 262800,
    dueDate: '2026-05-18',
    status: 'Paid',
    createdBy: 'Kiran Menon',
    updatedAt: '2026-05-19',
    email: 'priya@veridianhealth.com',
    billingAddress: 'Cyber Park, Kochi',
    notes: 'Annual contract billed upfront.',
    attachments: ['signed-order-form.pdf'],
    lineItems: [
      { description: 'CRM annual license', quantity: 1, rate: 1120000, total: 1120000 },
      { description: 'Training package', quantity: 1, rate: 340000, total: 340000 },
    ],
    paymentHistory: [
      { id: 'PAY-5481', amount: 1722800, method: 'Bank Transfer', status: 'Success', date: '2026-05-19' },
    ],
    timeline: [
      { id: 'TL-4', title: 'Paid in full', description: 'Bank settlement captured automatically.', time: '2026-05-19 13:18' },
    ],
  },
  {
    id: 'INV-2026-105',
    customer: 'Mohit Batra',
    company: 'Aster Retail Group',
    segment: 'SMB',
    amount: 360000,
    tax: 64800,
    dueDate: '2026-06-09',
    status: 'Sent',
    createdBy: 'Neha Iyer',
    updatedAt: '2026-05-28',
    email: 'mohit@asterretail.com',
    billingAddress: 'Sector 44, Gurugram',
    notes: 'Awaiting customer confirmation for deployment slot.',
    attachments: [],
    lineItems: [
      { description: 'Growth plan quarterly billing', quantity: 1, rate: 240000, total: 240000 },
      { description: 'Onboarding services', quantity: 1, rate: 120000, total: 120000 },
    ],
    paymentHistory: [],
    timeline: [
      { id: 'TL-5', title: 'Invoice sent', description: 'Billing email sent to finance and business owner.', time: '2026-05-28 10:30' },
    ],
  },
  {
    id: 'INV-2026-098',
    customer: 'Sneha Joshi',
    company: 'Mercury Foods',
    segment: 'Mid-market',
    amount: 525000,
    tax: 94500,
    dueDate: '2026-05-29',
    status: 'Viewed',
    createdBy: 'Asha Kumar',
    updatedAt: '2026-05-27',
    email: 'sneha@mercuryfoods.com',
    billingAddress: 'JP Nagar, Bengaluru',
    notes: 'Viewed by AP manager, no disputes raised.',
    attachments: ['tax-summary.pdf'],
    lineItems: [
      { description: 'Service credits', quantity: 1, rate: 525000, total: 525000 },
    ],
    paymentHistory: [],
    timeline: [
      { id: 'TL-6', title: 'Viewed by customer', description: 'Invoice opened from secure payment link.', time: '2026-05-27 16:10' },
    ],
  },
]

export const payments: PaymentRecord[] = [
  { id: 'PAY-5548', customer: 'Northstar Logistics', invoiceId: 'INV-2026-118', amount: 350000, method: 'UPI', status: 'Success', date: '2026-05-26', gateway: 'Razorpay' },
  { id: 'PAY-5531', customer: 'Aster Retail Group', invoiceId: 'INV-2026-102', amount: 180000, method: 'Card', status: 'Pending', date: '2026-05-25', gateway: 'Stripe' },
  { id: 'PAY-5522', customer: 'Veridian Health', invoiceId: 'INV-2026-109', amount: 220000, method: 'Bank Transfer', status: 'Refunded', date: '2026-05-24', gateway: 'ICICI CIB' },
  { id: 'PAY-5512', customer: 'Northstar Logistics', invoiceId: 'INV-2026-118', amount: 500000, method: 'Bank Transfer', status: 'Partial', date: '2026-05-22', gateway: 'HDFC CIB' },
  { id: 'PAY-5493', customer: 'BluePeak Energy', invoiceId: 'INV-2026-114', amount: 120000, method: 'Cheque', status: 'Failed', date: '2026-05-18', gateway: 'Manual reconciliation' },
]

export const expenses: ExpenseRecord[] = [
  { id: 'EXP-4008', vendor: 'PeopleOps Payroll', department: 'Operations', category: 'Salaries', amount: 1480000, status: 'Paid', approvalStatus: 'Approved', date: '2026-05-25', recurring: true },
  { id: 'EXP-3994', vendor: 'CloudNimbus', department: 'Engineering', category: 'Software', amount: 420000, status: 'Booked', approvalStatus: 'Approved', date: '2026-05-23', recurring: true },
  { id: 'EXP-3982', vendor: 'Skylane Media', department: 'Marketing', category: 'Marketing', amount: 315000, status: 'Pending', approvalStatus: 'Pending', date: '2026-05-21', recurring: false },
  { id: 'EXP-3965', vendor: 'Orbit Stay', department: 'Sales', category: 'Travel', amount: 98000, status: 'Paid', approvalStatus: 'Approved', date: '2026-05-19', recurring: false },
  { id: 'EXP-3940', vendor: 'Metro Workspace', department: 'Administration', category: 'Office Rent', amount: 260000, status: 'Paid', approvalStatus: 'Approved', date: '2026-05-01', recurring: true },
]

export const collections: CollectionRecord[] = [
  { id: 'COL-210', invoiceId: 'INV-2026-114', customer: 'BluePeak Energy', owner: 'Asha Kumar', amount: 991200, daysOverdue: 7, nextActionDate: '2026-05-30', status: 'Promise To Pay', promiseToPay: '2026-05-31', notes: 'Customer finance head committed payment after PO clearance.' },
  { id: 'COL-204', invoiceId: 'INV-2026-087', customer: 'Summit Bio Labs', owner: 'Ritesh Jain', amount: 442500, daysOverdue: 19, nextActionDate: '2026-05-29', status: 'Escalated', notes: 'Escalated to account director after 3 missed reminders.' },
  { id: 'COL-198', invoiceId: 'INV-2026-081', customer: 'UrbanGrid Infra', owner: 'Neha Iyer', amount: 286000, daysOverdue: 11, nextActionDate: '2026-05-29', status: 'Reminder Sent', notes: 'Second reminder sent with payment link.' },
]

export const reports: ReportRecord[] = [
  { id: 'RPT-11', name: 'Profit & Loss Snapshot', category: 'Profit & Loss', lastRun: '2026-05-27', format: 'PDF', schedule: 'Every Monday' },
  { id: 'RPT-12', name: 'Cash Flow by Region', category: 'Cash Flow', lastRun: '2026-05-26', format: 'CSV', schedule: 'Month end' },
  { id: 'RPT-13', name: 'Aging Report - Enterprise', category: 'Aging Reports', lastRun: '2026-05-25', format: 'PDF', schedule: 'Daily 8:00 AM' },
  { id: 'RPT-14', name: 'Expense Control Summary', category: 'Expense Reports', lastRun: '2026-05-23', format: 'CSV', schedule: 'Manual' },
]

export const financeSettings: FinanceSettingsSection[] = [
  {
    id: 'currency',
    title: 'Currency & regional settings',
    description: 'Primary money format, tax locale, and reporting country for consolidated books.',
    items: [
      { label: 'Base currency', value: 'INR (₹)' },
      { label: 'Reporting locale', value: 'India - GST enabled' },
      { label: 'Fiscal year', value: 'Apr 01 - Mar 31' },
    ],
  },
  {
    id: 'invoicing',
    title: 'Invoice controls',
    description: 'Numbering, reminders, and approval thresholds for customer billing operations.',
    items: [
      { label: 'Invoice prefix', value: 'INV-2026-' },
      { label: 'Reminder cadence', value: 'T-3, due date, T+5' },
      { label: 'Cancellation approval', value: 'Controller and Finance Ops' },
    ],
  },
  {
    id: 'gateway',
    title: 'Payments & automation',
    description: 'Collections, gateways, and auto-reconciliation policies for incoming payments.',
    items: [
      { label: 'Primary gateway', value: 'Razorpay + Stripe fallback' },
      { label: 'Auto-reconciliation', value: 'Enabled for bank + card settlements' },
      { label: 'Finance notifications', value: 'Slack, email, daily digest' },
    ],
  },
]
