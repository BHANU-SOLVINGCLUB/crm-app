import { useCallback, useEffect, useState } from 'react'
import {
  apiLeadToRow,
  bulkDeleteLeads,
  createActivity,
  createLead,
  deleteLeadApi,
  fetchActivities,
  fetchLeadSchema,
  fetchLeads,
  resetSampleLeads,
  updateLeadApi,
} from '../api/leads'
import type { LeadColumn, LeadRow } from '../CRM/data/leads'
import type { IndustryKey } from '../CRM/data/industries'
import { usePlatformStore } from '../store/usePlatformStore'

export interface LeadsSchema {
  columns: LeadColumn[]
  sources: string[]
  statuses: string[]
}

export interface SavedInteraction {
  id: number
  type: string
  notes: string
  performed_by: number | null
  performed_by_name: string | null
  created_at: string
}

function getApiId(row: LeadRow): number | null {
  const id = row.__apiId
  if (typeof id === 'number') return id
  const parsed = Number(row.__leadId)
  return isNaN(parsed) ? null : parsed
}

// authUser.organization is always a plain number coming from the backend
// (/auth/me/ returns {"organization": 7}). This helper just guards against
// undefined/null safely — no object-with-id case needed.
function resolveOrgId(organization: number | undefined | null): number | undefined {
  if (typeof organization === 'number') return organization
  return undefined
}

export function useLeadsApi(industryKey: IndustryKey) {
  const authUser = usePlatformStore((s) => s.authUser)
  const orgId = resolveOrgId(authUser?.organization as number | undefined)
  const enabled = Boolean(orgId)

  const [schema,  setSchema]  = useState<LeadsSchema | null>(null)
  const [rows,    setRows]    = useState<LeadRow[]>([])
  const [loading, setLoading] = useState(enabled)
  const [error,   setError]   = useState<string | null>(null)

  const [interactionCache, setInteractionCache] = useState<
    Record<string, SavedInteraction[]>
  >({})

  // ── reload ────────────────────────────────────────────────
  const reload = useCallback(async () => {
    if (!orgId) return
    setLoading(true)
    setError(null)
    try {
      const [schemaData, leads] = await Promise.all([
        fetchLeadSchema(orgId, industryKey),
        fetchLeads(orgId, { industry: industryKey }),
      ])
      setSchema({
        columns:  schemaData.columns as LeadColumn[],
        sources:  schemaData.sources,
        statuses: schemaData.statuses,
      })
      setRows(leads.map(apiLeadToRow))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load leads'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [orgId, industryKey])

  useEffect(() => {
    if (!enabled) {
      setLoading(false)
      return
    }
    void reload()
  }, [enabled, reload])

  // ── update cell ───────────────────────────────────────────
  // For new unsaved rows (__isNew = true), only update local state.
  // For saved rows, optimistically update then PATCH backend.
  const updateCell = useCallback(
    async (rowIdx: number, key: string, value: string | number) => {
      if (!orgId) return
      const row = rows[rowIdx]

      setRows((current) =>
        current.map((item, index) =>
          index === rowIdx ? { ...item, [key]: value } : item
        )
      )

      if (!row || row.__isNew) return // unsaved row — backend call happens via saveNewRow

      const leadId = getApiId(row)
      if (!leadId) return

      try {
        if (key === 'status' || key === 'source') {
          await updateLeadApi(orgId, leadId, { [key]: value })
        } else {
          await updateLeadApi(orgId, leadId, { data: { [key]: value } })
        }
      } catch {
        void reload()
      }
    },
    [orgId, rows, reload]
  )

  // ── add row ───────────────────────────────────────────────
  // Adds a temporary row to local UI state only.
  // Returns the temp row's array index so the caller can track it.
  const addRow = useCallback(
    async (blank: LeadRow): Promise<number> => {
      // __isNew is a boolean flag, not a string|number lead field,
      // so it's set directly on the row object (LeadRow allows extra keys).
      const tempRow: LeadRow = {
        ...blank,
        __leadId: `temp-${Date.now()}`,
      }
      ;(tempRow as LeadRow & { __isNew?: boolean }).__isNew = true

      setRows((current) => [tempRow, ...current])
      return 0 // new row is always inserted at index 0
    },
    []
  )

  // ── save new row — THE FUNCTION THAT ACTUALLY HITS BACKEND ─
  // Call this when the user clicks "Save" on an unsaved row.
  // Sends a real POST request to Django and replaces the temp row.
  const saveNewRow = useCallback(
    async (rowIdx: number): Promise<boolean> => {
      if (!orgId || !schema) return false
      const row = rows[rowIdx]
      if (!row || !(row as LeadRow & { __isNew?: boolean }).__isNew) return false

      const status = String(row.status ?? schema.statuses[0] ?? 'New')
      const source = String(row.source ?? schema.sources[0] ?? '')

      const data: Record<string, string | number> = {}
      schema.columns.forEach((col) => {
        if (col.key === 'status' || col.key === 'source') return
        const val = row[col.key]
        if (val !== undefined && val !== '' && val !== 0) {
          data[col.key] = val as string | number
        }
      })

      try {
        // ← THIS is the actual fetch() call to Django.
        // If this succeeds you WILL see it in your runserver terminal
        // as: "POST /api/orgs/<id>/leads/ HTTP/1.1" 201
        const created = await createLead(orgId, {
          industry: industryKey,
          status,
          source,
          data,
        })

        setRows((current) =>
          current.map((r, i) => (i === rowIdx ? apiLeadToRow(created) : r))
        )
        return true
      } catch (err) {
        console.error('Failed to save new lead:', err)
        return false
      }
    },
    [orgId, schema, rows, industryKey]
  )

  // ── discard an unsaved new row ─────────────────────────────
  const discardNewRow = useCallback((rowIdx: number) => {
    setRows((current) => current.filter((_, i) => i !== rowIdx))
  }, [])

  // ── delete rows ───────────────────────────────────────────
  const deleteRows = useCallback(
    async (indexes: Set<number>) => {
      if (!orgId) return
      const savedIds: number[] = []

      indexes.forEach((idx) => {
        const row = rows[idx]
        if (!row || (row as LeadRow & { __isNew?: boolean }).__isNew) return
        const id = getApiId(row)
        if (id) savedIds.push(id)
      })

      setRows((current) => current.filter((_, index) => !indexes.has(index)))

      if (savedIds.length === 1)    await deleteLeadApi(orgId, savedIds[0])
      else if (savedIds.length > 1) await bulkDeleteLeads(orgId, savedIds)
    },
    [orgId, rows]
  )

  // ── reset rows ────────────────────────────────────────────
  const resetRows = useCallback(async () => {
    if (!orgId) return
    await resetSampleLeads(orgId, industryKey)
    await reload()
  }, [orgId, industryKey, reload])

  // ── save interaction ──────────────────────────────────────
  const saveInteraction = useCallback(
    async (rowIdx: number, type: string, notes: string) => {
      if (!orgId) return
      const row    = rows[rowIdx]
      const leadId = row ? getApiId(row) : null
      if (!leadId) return
      const saved = (await createActivity(orgId, leadId, { type, notes })) as SavedInteraction
      setInteractionCache((current): Record<string, SavedInteraction[]> => {
        const key = String(leadId)
        const existing = current[key] ?? []
        return {
          ...current,
          [key]: [saved, ...existing],
        }
      })
    },
    [orgId, rows]
  )

  // ── load interactions for a lead ──────────────────────────
  const loadInteractions = useCallback(
    async (leadId: number) => {
      if (!orgId) return
      const key = String(leadId)
      if (interactionCache[key]) return
      try {
        const data = (await fetchActivities(orgId, leadId)) as SavedInteraction[]
        setInteractionCache((current): Record<string, SavedInteraction[]> => ({
          ...current,
          [key]: data,
        }))
      } catch {
        // silently fail — history panel stays empty
      }
    },
    [orgId, interactionCache]
  )

  // ── get interactions from cache ───────────────────────────
  const getInteractions = useCallback(
    (leadId: string): SavedInteraction[] => {
      return interactionCache[leadId] ?? []
    },
    [interactionCache]
  )

  return {
    enabled,
    schema,
    rows,
    loading,
    error,
    reload,
    updateCell,
    addRow,
    saveNewRow,
    discardNewRow,
    deleteRows,
    resetRows,
    saveInteraction,
    loadInteractions,
    getInteractions,
  }
}