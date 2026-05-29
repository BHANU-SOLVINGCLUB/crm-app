export type FinanceDateRange = '30d' | '90d' | 'ytd'

export type InvoiceStatus = 'Draft' | 'Sent' | 'Viewed' | 'Paid' | 'Partial' | 'Overdue' | 'Cancelled'
export type PaymentStatus = 'Success' | 'Pending' | 'Failed' | 'Refunded' | 'Partial'
export type ExpenseStatus = 'Booked' | 'Pending' | 'Paid'
export type ApprovalStatus = 'Approved' | 'Pending' | 'Rejected' | 'Escalated'
export type CollectionStatus = 'Pending' | 'Reminder Sent' | 'Customer Replied' | 'Promise To Pay' | 'Escalated' | 'Closed'

export interface FinanceKpi {
  label: string
  value: number
  delta: number
  hint: string
  accent: string
}

export interface SegmentDatum {
  name: string
  value: number
  amount: number
  color: string
}

export interface MonthlyFinanceDatum {
  month: string
  revenue: number
  expenses: number
  profit: number
  cashFlow: number
}

export interface TransactionItem {
  id: string
  customer: string
  amount: number
  type: string
  createdAt: string
  positive: boolean
}

export interface InvoiceLineItem {
  description: string
  quantity: number
  rate: number
  total: number
}

export interface TimelineEntry {
  id: string
  title: string
  description: string
  time: string
}

export interface PaymentHistoryItem {
  id: string
  amount: number
  method: string
  status: PaymentStatus
  date: string
}

export interface InvoiceRecord {
  id: string
  customer: string
  company: string
  segment: string
  amount: number
  tax: number
  dueDate: string
  status: InvoiceStatus
  createdBy: string
  updatedAt: string
  email: string
  billingAddress: string
  notes: string
  attachments: string[]
  lineItems: InvoiceLineItem[]
  paymentHistory: PaymentHistoryItem[]
  timeline: TimelineEntry[]
}

export interface PaymentRecord {
  id: string
  customer: string
  invoiceId: string
  amount: number
  method: 'Card' | 'Bank Transfer' | 'UPI' | 'Cheque' | 'Wallet'
  status: PaymentStatus
  date: string
  gateway: string
}

export interface ExpenseRecord {
  id: string
  vendor: string
  department: string
  category: 'Salaries' | 'Marketing' | 'Software' | 'Travel' | 'Office Rent' | 'Utilities'
  amount: number
  status: ExpenseStatus
  approvalStatus: ApprovalStatus
  date: string
  recurring: boolean
}

export interface CollectionRecord {
  id: string
  invoiceId: string
  customer: string
  owner: string
  amount: number
  daysOverdue: number
  nextActionDate: string
  status: CollectionStatus
  promiseToPay?: string
  notes: string
}

export interface ReportRecord {
  id: string
  name: string
  category: string
  lastRun: string
  format: 'CSV' | 'PDF'
  schedule: string
}

export interface FinanceSettingsSection {
  id: string
  title: string
  description: string
  items: Array<{ label: string; value: string }>
}
