import { apiRequest } from './client'
import type { ApiLead, ApiLeadSchema, PaginatedResponse } from './types'
import type { LeadRow } from '../CRM/data/leads'

export function apiLeadToRow(lead: ApiLead): LeadRow {
  return {
    ...lead.data,
    status: lead.status,
    source: lead.source,
    __leadId: String(lead.id),
    __apiId: lead.id,
  }
}

export async function fetchLeadSchema(orgId: number, industry: string): Promise<ApiLeadSchema> {
  return apiRequest<ApiLeadSchema>(`/orgs/${orgId}/lead-schemas/${industry}/`)
}

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
  await apiRequest(`/orgs/${orgId}/leads/reset-sample/`, {
    method: 'POST',
    body: JSON.stringify({ industry }),
  })
}

export async function fetchLeadStats(orgId: number, industry?: string) {
  const suffix = industry ? `?industry=${industry}` : ''
  return apiRequest<Record<string, unknown>>(`/orgs/${orgId}/leads/stats/${suffix}`)
}

export async function createActivity(
  orgId: number,
  leadId: number,
  payload: { type: string; notes: string }
) {
  return apiRequest(`/orgs/${orgId}/leads/${leadId}/activities/`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function fetchActivities(orgId: number, leadId: number) {
  return apiRequest(`/orgs/${orgId}/leads/${leadId}/activities/`)
}
