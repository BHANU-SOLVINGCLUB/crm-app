import { apiRequest } from './client'
import type { ApiCustomer, PaginatedResponse } from './types'
import type { Customer } from '../CRM/data/customerData'

export function apiCustomerToUi(customer: ApiCustomer): Customer {
  return {
    id: customer.id,
    name: customer.name,
    company: customer.company,
    phone: customer.phone,
    email: customer.email,
    status: customer.status as Customer['status'],
    revenue: customer.revenue,
    lastActivity: customer.last_activity,
    lastActivityDays: customer.last_activity_days,
    assignedManager: customer.assigned_manager ? String(customer.assigned_manager) : '',
    renewalDate: customer.renewal_date,
    paymentStatus: customer.payment_status as Customer['paymentStatus'],
    notes: customer.notes,
    purchaseHistory: (customer.purchase_records ?? []).map((p) => ({
      date: p.date,
      item: p.item,
      amount: p.amount,
    })),
    supportTickets: (customer.support_tickets ?? []).map((t) => ({
      id: t.ticket_id,
      issue: t.issue,
      status: t.status as Customer['supportTickets'][number]['status'],
      date: t.date,
    })),
  }
}

export function uiCustomerToApi(customer: Partial<Customer> & { industry?: string }) {
  return {
    industry: customer.industry,
    name: customer.name,
    company: customer.company,
    phone: customer.phone,
    email: customer.email,
    status: customer.status,
    revenue: customer.revenue,
    last_activity: customer.lastActivity,
    last_activity_days: customer.lastActivityDays,
    renewal_date: customer.renewalDate,
    payment_status: customer.paymentStatus,
    notes: customer.notes,
  }
}

export async function fetchCustomers(
  orgId: number,
  params: { status?: string; q?: string } = {}
): Promise<ApiCustomer[]> {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value)
  })
  const suffix = query.toString() ? `?${query}` : ''
  const data = await apiRequest<PaginatedResponse<ApiCustomer> | ApiCustomer[]>(
    `/orgs/${orgId}/customers/${suffix}`
  )
  return Array.isArray(data) ? data : data.results
}

export async function createCustomer(
  orgId: number,
  payload: Record<string, unknown>
): Promise<ApiCustomer> {
  return apiRequest<ApiCustomer>(`/orgs/${orgId}/customers/`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function updateCustomerApi(
  orgId: number,
  customerId: number,
  payload: Record<string, unknown>
): Promise<ApiCustomer> {
  return apiRequest<ApiCustomer>(`/orgs/${orgId}/customers/${customerId}/`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export async function deleteCustomerApi(orgId: number, customerId: number): Promise<void> {
  await apiRequest(`/orgs/${orgId}/customers/${customerId}/`, { method: 'DELETE' })
}
