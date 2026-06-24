import { apiRequest, getTokens } from './client'
import type { ApiLead, ApiLeadSchema, PaginatedResponse } from './types'
import type { LeadRow } from '../CRM/data/leads'

export function apiLeadToRow(lead: ApiLead): LeadRow {
  return {
    ...lead.data,
    status: lead.status,
    source: lead.source,
    __leadId: String(lead.id),
    __apiId: lead.id,
    __assignedToId: lead.assigned_to ?? '',
  }
}

// ── Activity types ────────────────────────────────────────────────────

export type ActivityType =
  | 'call' | 'email' | 'meeting' | 'note'
  | 'whatsapp' | 'sms' | 'status' | 'appointment'
  | 'payment' | 'followup' | 'document' | 'system'

export interface ApiActivity {
  id: number
  lead: number
  performed_by: number | null
  performed_by_name: string | null
  type: ActivityType
  title: string
  notes: string
  created_at: string
  updated_at: string
}

// GET /api/orgs/{org_id}/leads/{lead_id}/activities/
export async function fetchActivities(orgId: number, leadId: number): Promise<ApiActivity[]> {
  const data = await apiRequest<PaginatedResponse<ApiActivity> | ApiActivity[]>(
    `/orgs/${orgId}/leads/${leadId}/activities/`
  )
  return Array.isArray(data) ? data : data.results
}

// POST /api/orgs/{org_id}/leads/{lead_id}/activities/
// title is optional for backward-compat with existing callers that only pass { type, notes }
export async function createActivity(
  orgId: number,
  leadId: number,
  payload: { type: ActivityType | string; title?: string; notes: string }
): Promise<ApiActivity> {
  return apiRequest<ApiActivity>(`/orgs/${orgId}/leads/${leadId}/activities/`, {
    method: 'POST',
    body: JSON.stringify({ type: payload.type, title: payload.title ?? '', notes: payload.notes }),
  })
}

// ── Schema ────────────────────────────────────────────────────────────

export async function fetchLeadSchema(orgId: number, industry: string): Promise<ApiLeadSchema> {
  return apiRequest<ApiLeadSchema>(`/orgs/${orgId}/lead-schemas/${industry}/`)
}

// ── Leads CRUD ────────────────────────────────────────────────────────

export async function fetchLeads(
  orgId: number,
  params: { industry?: string; status?: string; source?: string; q?: string; page?: number } = {}
): Promise<ApiLead[]> {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') query.set(key, String(value))
  })
  const suffix = query.toString() ? `?${query}` : ''
  const data = await apiRequest<PaginatedResponse<ApiLead> | ApiLead[]>(
    `/orgs/${orgId}/leads/${suffix}`
  )
  return Array.isArray(data) ? data : data.results
}

export async function createLead(
  orgId: number,
  payload: { industry: string; status: string; source: string; data: Record<string, string | number> }
): Promise<ApiLead> {
  return apiRequest<ApiLead>(`/orgs/${orgId}/leads/`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function updateLeadApi(
  orgId: number,
  leadId: number,
  payload: Partial<{ status: string; source: string; data: Record<string, string | number> }>
): Promise<ApiLead> {
  return apiRequest<ApiLead>(`/orgs/${orgId}/leads/${leadId}/`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export async function deleteLeadApi(orgId: number, leadId: number): Promise<void> {
  await apiRequest(`/orgs/${orgId}/leads/${leadId}/`, { method: 'DELETE' })
}

export async function bulkDeleteLeads(orgId: number, leadIds: number[]): Promise<void> {
  await apiRequest(`/orgs/${orgId}/leads/bulk-delete/`, {
    method: 'POST',
    body: JSON.stringify({ ids: leadIds }),
  })
}

export async function resetSampleLeads(orgId: number, industry: string): Promise<void> {
  await apiRequest(`/orgs/${orgId}/leads/reset-sample/?industry=${industry}`, {
    method: 'POST',
  })
}

export async function fetchLeadStats(orgId: number, industry?: string) {
  const suffix = industry ? `?industry=${industry}` : ''
  return apiRequest<Record<string, unknown>>(`/orgs/${orgId}/leads/stats/${suffix}`)
}

export async function fetchLeadById(orgId: number, leadId: number): Promise<ApiLead> {
  return apiRequest<ApiLead>(`/orgs/${orgId}/leads/${leadId}/`)
}

// ── Org users ─────────────────────────────────────────────────────────

export interface OrgUser {
  id: number
  email: string
  username: string
  role: 'admin' | 'manager' | 'sales'
  phone: string
  organization: number
}

export async function fetchOrgUsers(orgId: number): Promise<OrgUser[]> {
  const data = await apiRequest<PaginatedResponse<OrgUser> | OrgUser[]>(
    `/orgs/${orgId}/users/`
  )
  return Array.isArray(data) ? data : data.results
}

// ── Lead assignment ───────────────────────────────────────────────────

export async function assignLead(
  orgId: number,
  leadId: number,
  userId: number | null
): Promise<ApiLead> {
  return apiRequest<ApiLead>(`/orgs/${orgId}/leads/${leadId}/assign/`, {
    method: 'PATCH',
    body: JSON.stringify({ assigned_to: userId }),
  })
}

// ── CSV Import ────────────────────────────────────────────────────────
// POST /api/orgs/{org_id}/leads/bulk-import/
// Accepts a real CSV file. Cannot use apiRequest() here since that
// forces Content-Type: application/json, breaking multipart/form-data.
// Uses fetch() directly with the same auth pattern as client.ts.

export async function importLeadsCSV(
  orgId: number,
  file: File
): Promise<{ created: number; failed: number; errors: { row: number; errors: unknown }[] }> {
  const API_BASE = (import.meta.env as Record<string, string>).VITE_API_BASE_URL ?? '/api'
  const tokens = getTokens()

  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(`${API_BASE}/orgs/${orgId}/leads/bulk-import/`, {
    method: 'POST',
    headers: tokens?.access ? { Authorization: `Bearer ${tokens.access}` } : {},
    body: formData,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw { ...err, status: res.status }
  }
  return res.json()
}