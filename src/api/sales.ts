import { apiRequest } from './client'
import type { ApiDeal, PaginatedResponse } from './types'
import type { Deal } from '../CRM/data/pipeline'

export function apiDealToUi(deal: ApiDeal): Deal {
  return {
    id:           deal.id,
    company:      deal.company,
    contact:      deal.contact,
    email:        deal.email,
    // Django DecimalField returns a string from the API ("450000.00"),
    // not a number — wrapping in Number() fixes the NaN pipeline value bug
    value:        Number(deal.value),
    stage:        deal.stage,
    prob:         deal.prob,
    priority:     deal.priority,
    closeDate:    deal.close_date ?? '',
    sector:       deal.sector,
    lastAct:      deal.last_act,
    lastActDays:  deal.last_act_days,
    assignedTo:   deal.assigned_to,
  }
}

export function uiDealToApi(deal: Partial<Deal> & { industry?: string }) {
  return {
    industry:      deal.industry,
    company:       deal.company,
    contact:       deal.contact,
    email:         deal.email,
    value:         deal.value,
    stage:         deal.stage,
    prob:          deal.prob,
    priority:      deal.priority,
    close_date:    deal.closeDate || null,
    sector:        deal.sector,
    last_act:      deal.lastAct,
    last_act_days: deal.lastActDays,
    assigned_to:   deal.assignedTo ?? null,
  }
}

export async function fetchDeals(
  orgId: number,
  params: { industry?: string; stage?: string; priority?: string; q?: string } = {}
): Promise<ApiDeal[]> {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value)
  })
  const suffix = query.toString() ? `?${query}` : ''
  const data = await apiRequest<PaginatedResponse<ApiDeal> | ApiDeal[]>(
    `/orgs/${orgId}/sales/deals/${suffix}`
  )
  return Array.isArray(data) ? data : data.results
}

export async function createDeal(orgId: number, payload: Record<string, unknown>): Promise<ApiDeal> {
  return apiRequest<ApiDeal>(`/orgs/${orgId}/sales/deals/`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function updateDealApi(
  orgId: number,
  dealId: number,
  payload: Record<string, unknown>
): Promise<ApiDeal> {
  return apiRequest<ApiDeal>(`/orgs/${orgId}/sales/deals/${dealId}/`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export async function deleteDealApi(orgId: number, dealId: number): Promise<void> {
  await apiRequest(`/orgs/${orgId}/sales/deals/${dealId}/`, { method: 'DELETE' })
}

// GET single deal by id
export async function fetchDealById(orgId: number, dealId: number): Promise<ApiDeal> {
  return apiRequest<ApiDeal>(`/orgs/${orgId}/sales/deals/${dealId}/`)
}

// ── Deal Activities ───────────────────────────────────────────────────

export interface ApiDealActivity {
  id: number
  type: string
  notes: string
  performed_by: number | null
  performed_by_name: string | null
  created_at: string
}

// GET /api/orgs/{org_id}/sales/deals/{deal_id}/activities/
export async function fetchDealActivities(
  orgId: number,
  dealId: number
): Promise<ApiDealActivity[]> {
  const data = await apiRequest<{ results: ApiDealActivity[] } | ApiDealActivity[]>(
    `/orgs/${orgId}/sales/deals/${dealId}/activities/`
  )
  return Array.isArray(data) ? data : data.results
}

// POST /api/orgs/{org_id}/sales/deals/{deal_id}/activities/
export async function createDealActivity(
  orgId: number,
  dealId: number,
  payload: { type: string; notes: string }
): Promise<ApiDealActivity> {
  return apiRequest<ApiDealActivity>(
    `/orgs/${orgId}/sales/deals/${dealId}/activities/`,
    { method: 'POST', body: JSON.stringify(payload) }
  )
}