export type UserRole = 'admin' | 'manager' | 'sales'

export interface AuthTokens {
  access: string
  refresh: string
}

export interface Organization {
  id: number
  name: string
  slug: string
}

export interface AuthUser {
  id: number
  email: string
  username: string
  role: UserRole
  phone?: string
  organization: number
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface ApiLeadSchema {
  columns: Array<{
    key: string
    label: string
    type: string
    width?: number
    options?: string[]
  }>
  sources: string[]
  statuses: string[]
}

export interface ApiLead {
  id: number
  industry: string
  status: string
  source: string
  data: Record<string, string | number>
  assigned_to: number | null
  created_by: number | null
  created_at: string
  updated_at: string
}

export interface ApiDeal {
  id: number
  industry: string
  company: string
  contact: string
  email: string
  value: number
  stage: string
  prob: number
  priority: 'high' | 'medium' | 'low'
  close_date: string
  sector: string
  last_act: string
  last_act_days: number
  assigned_to: number | null
  notes: string
  closed_at: string | null
  lost_reason: string
}

export interface ApiCustomer {
  id: number
  industry: string
  name: string
  company: string
  phone: string
  email: string
  status: string
  revenue: number
  last_activity: string
  last_activity_days: number
  assigned_manager: number | null
  renewal_date: string
  payment_status: string
  notes: string
  converted_at: string
  purchase_records?: Array<{ id: number; date: string; item: string; amount: number }>
  support_tickets?: Array<{ id: number; ticket_id: string; issue: string; status: string; date: string }>
}

export interface ApiError {
  status: number
  error?: string
  detail?: string
  fields?: Record<string, string>
  duplicate?: boolean
  lead_id?: number
}
