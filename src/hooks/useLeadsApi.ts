import { useCallback, useEffect, useState } from 'react'
import {
  apiLeadToRow,
  bulkDeleteLeads,
  createActivity,
  createLead,
  deleteLeadApi,
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

function getApiId(row: LeadRow): number | null {
  const id = row.__apiId
  return typeof id === 'number' ? id : Number(row.__leadId) || null
}

export function useLeadsApi(industryKey: IndustryKey) {
  const authUser = usePlatformStore((s) => s.authUser)
  const orgId = authUser?.organization?.id
  const enabled = Boolean(orgId)

  const [schema, setSchema] = useState<LeadsSchema | null>(null)
  const [rows, setRows] = useState<LeadRow[]>([])
  const [loading, setLoading] = useState(enabled)
  const [error, setError] = useState<string | null>(null)

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
        columns: schemaData.columns as LeadColumn[],
        sources: schemaData.sources,
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

  const updateCell = useCallback(
    async (rowIdx: number, key: string, value: string | number) => {
      if (!orgId) return
      const row = rows[rowIdx]
      const leadId = row ? getApiId(row) : null

      setRows((current) =>
        current.map((item, index) => (index === rowIdx ? { ...item, [key]: value } : item))
      )

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

  const addRow = useCallback(
    async (blank: LeadRow) => {
      if (!orgId || !schema) return
      const status = String(blank.status ?? schema.statuses[0] ?? 'New')
      const source = String(blank.source ?? schema.sources[0] ?? '')
      const data: Record<string, string | number> = {}
      schema.columns.forEach((col) => {
        if (col.key === 'status' || col.key === 'source') return
        const val = blank[col.key]
        if (val !== undefined) data[col.key] = val
      })

      const created = await createLead(orgId, { industry: industryKey, status, source, data })
      setRows((current) => [apiLeadToRow(created), ...current])
    },
    [orgId, schema, industryKey]
  )

  const deleteRows = useCallback(
    async (indexes: Set<number>) => {
      if (!orgId) return
      const ids = [...indexes]
        .map((idx) => rows[idx])
        .map((row) => (row ? getApiId(row) : null))
        .filter((id): id is number => id !== null)

      setRows((current) => current.filter((_, index) => !indexes.has(index)))

      if (ids.length === 1) await deleteLeadApi(orgId, ids[0])
      else if (ids.length > 1) await bulkDeleteLeads(orgId, ids)
    },
    [orgId, rows]
  )

  const resetRows = useCallback(async () => {
    if (!orgId) return
    await resetSampleLeads(orgId, industryKey)
    await reload()
  }, [orgId, industryKey, reload])

  const saveInteraction = useCallback(
    async (rowIdx: number, type: string, notes: string) => {
      if (!orgId) return
      const row = rows[rowIdx]
      const leadId = row ? getApiId(row) : null
      if (!leadId) return
      await createActivity(orgId, leadId, { type, notes })
    },
    [orgId, rows]
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
    deleteRows,
    resetRows,
    saveInteraction,
  }
}
