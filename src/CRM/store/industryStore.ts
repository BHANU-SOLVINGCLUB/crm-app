import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { industries, type IndustryKey, getIndustry } from '../data/industries'
import { leadsByIndustry, type LeadInteraction, type LeadRow } from '../data/leads'
import { getLeadDisplayName } from './dashboardSelectors'
import { pushCRMActivity } from './crmStore'

interface IndustryState {
  current: IndustryKey
  setIndustry: (key: IndustryKey) => void
  leadsOverrides: Partial<Record<IndustryKey, LeadRow[]>>
  leadInteractions: Partial<Record<IndustryKey, Record<string, LeadInteraction[]>>>
  getLeads: (key: IndustryKey) => LeadRow[]
  addLead: (key: IndustryKey, row: LeadRow) => void
  updateLead: (key: IndustryKey, rowIndex: number, field: string, value: string | number) => void
  deleteLeads: (key: IndustryKey, rowIndexes: Set<number>) => void
  setLeads: (key: IndustryKey, rows: LeadRow[]) => void
  getLeadInteractions: (key: IndustryKey, leadId: string) => LeadInteraction[]
  addLeadInteraction: (key: IndustryKey, leadId: string, interaction: LeadInteraction) => void
  resetLeads: (key: IndustryKey) => void
}

function sanitizeLeadRows(rows: unknown): LeadRow[] {
  if (!Array.isArray(rows)) return []
  return rows.filter((row): row is LeadRow => typeof row === 'object' && row !== null && !Array.isArray(row))
}

function withLeadIds(key: IndustryKey, rows: LeadRow[]): LeadRow[] {
  return rows.map((row, index) => {
    const rawLeadId = row.__leadId
    const leadId = typeof rawLeadId === 'string' && rawLeadId.trim() ? rawLeadId : `${key}-lead-${index + 1}`
    return { ...row, __leadId: leadId }
  })
}

function sanitizeLeadInteractions(entries: unknown): LeadInteraction[] {
  if (!Array.isArray(entries)) return []
  return entries.filter(
    (entry): entry is LeadInteraction =>
      typeof entry === 'object' &&
      entry !== null &&
      !Array.isArray(entry) &&
      typeof (entry as LeadInteraction).id === 'string' &&
      typeof (entry as LeadInteraction).leadId === 'string' &&
      typeof (entry as LeadInteraction).interactionType === 'string' &&
      typeof (entry as LeadInteraction).interactionChannel === 'string' &&
      typeof (entry as LeadInteraction).interactionOutcome === 'string' &&
      typeof (entry as LeadInteraction).remarks === 'string'
  )
}

function hasCoreLeadIdentity(key: IndustryKey, row: LeadRow): boolean {
  const schema = leadsByIndustry[key].schema
  const preferredKeys = ['name', 'student', 'guest', 'company', 'contact', 'parent', 'phone', 'email']
  const identityColumns = preferredKeys
    .map((field) => schema.columns.find((col) => col.key === field))
    .filter((col): col is NonNullable<typeof col> => Boolean(col))

  return identityColumns.some((col) => {
    const value = row[col.key]
    if (value === undefined || value === null) return false
    return String(value).trim() !== ''
  })
}

function getSafeRows(overrides: Partial<Record<IndustryKey, LeadRow[]>>, key: IndustryKey): LeadRow[] {
  const rawRows = overrides[key]
  if (rawRows === undefined) return withLeadIds(key, leadsByIndustry[key].rows)
  if (!Array.isArray(rawRows)) return withLeadIds(key, leadsByIndustry[key].rows)

  const sanitized = sanitizeLeadRows(rawRows)

  // Drop individual blank/corrupted rows (rows with no name, phone, or email).
  // Previously the guard was all-or-nothing: if even one row had a name the whole
  // array was kept, leaving blank rows visible in the table.
  const identityRows = sanitized.filter((row) => hasCoreLeadIdentity(key, row))

  if (identityRows.length === 0) return withLeadIds(key, leadsByIndustry[key].rows)

  return withLeadIds(key, identityRows)
}

function getSafeInteractionList(
  interactions: Partial<Record<IndustryKey, Record<string, LeadInteraction[]>>>,
  key: IndustryKey,
  leadId: string
): LeadInteraction[] {
  const industryInteractions = interactions[key]
  if (!industryInteractions || typeof industryInteractions !== 'object') return []
  return sanitizeLeadInteractions(industryInteractions[leadId])
}

export const useIndustryStore = create<IndustryState>()(
  persist(
    (set, get) => ({
      current: 'healthcare',
      setIndustry: (key) => set({ current: key }),
      leadsOverrides: {},
      leadInteractions: {},
      getLeads: (key) => {
        return getSafeRows(get().leadsOverrides, key)
      },
      addLead: (key, row) => {
        set((s) => {
          const currentRows = getSafeRows(s.leadsOverrides, key)
          return { leadsOverrides: { ...s.leadsOverrides, [key]: withLeadIds(key, [...currentRows, row]) } }
        })
        pushCRMActivity({
          action: `Lead added: ${getLeadDisplayName(row)}`,
          user: 'Lead Capture',
          module: 'Leads',
          iconType: 'lead',
          iconColor: '#10b981',
        })
      },
      updateLead: (key, rowIndex, field, value) => {
        const currentRows = getSafeRows(get().leadsOverrides, key)
        const target = currentRows[rowIndex]
        set((s) => {
          const rows = getSafeRows(s.leadsOverrides, key)
          const nextRows = withLeadIds(
            key,
            rows.map((row, index) => (index === rowIndex ? { ...row, [field]: value } : row))
          )
          return { leadsOverrides: { ...s.leadsOverrides, [key]: nextRows } }
        })
        if (field === 'status') {
          const label = target ? getLeadDisplayName(target) : 'Lead'
          pushCRMActivity({
            action: `Lead status → ${value} (${label})`,
            user: 'Lead Capture',
            module: 'Leads',
            iconType: 'lead',
            iconColor: '#3b82f6',
          })
        }
      },
      deleteLeads: (key, rowIndexes) => {
        const currentRows = getSafeRows(get().leadsOverrides, key)
        const deletedNames = currentRows
          .filter((_, index) => rowIndexes.has(index))
          .map((row) => getLeadDisplayName(row))
        set((s) => {
          const rows = getSafeRows(s.leadsOverrides, key)
          const deletedLeadIds = rows
            .filter((_, index) => rowIndexes.has(index))
            .map((row) => String(row.__leadId ?? ''))
            .filter(Boolean)
          const nextRows = rows.filter((_, index) => !rowIndexes.has(index))
          const currentInteractions = { ...(s.leadInteractions[key] ?? {}) }
          deletedLeadIds.forEach((leadId) => {
            delete currentInteractions[leadId]
          })
          return {
            leadsOverrides: { ...s.leadsOverrides, [key]: nextRows },
            leadInteractions: { ...s.leadInteractions, [key]: currentInteractions },
          }
        })
        pushCRMActivity({
          action:
            deletedNames.length === 1
              ? `Lead removed: ${deletedNames[0]}`
              : `${rowIndexes.size} lead(s) removed`,
          user: 'Lead Capture',
          module: 'Leads',
          iconType: 'lead',
          iconColor: '#f43f5e',
        })
      },
      setLeads: (key, rows) =>
        set((s) => ({ leadsOverrides: { ...s.leadsOverrides, [key]: withLeadIds(key, sanitizeLeadRows(rows)) } })),
      getLeadInteractions: (key, leadId) => getSafeInteractionList(get().leadInteractions, key, leadId),
      addLeadInteraction: (key, leadId, interaction) => {
        set((s) => {
          const currentIndustryInteractions = { ...(s.leadInteractions[key] ?? {}) }
          const existing = getSafeInteractionList(s.leadInteractions, key, leadId)
          currentIndustryInteractions[leadId] = [interaction, ...existing]

          return {
            leadInteractions: {
              ...s.leadInteractions,
              [key]: currentIndustryInteractions,
            },
          }
        })
        pushCRMActivity({
          action: `Lead interaction: ${interaction.interactionType} (${interaction.leadLabel})`,
          user: 'Lead Capture',
          module: 'Leads',
          iconType: 'lead',
          iconColor: '#06b6d4',
        })
      },
      resetLeads: (key) =>
        set((s) => {
          const next = { ...s.leadsOverrides }
          delete next[key]
          const nextInteractions = { ...s.leadInteractions }
          delete nextInteractions[key]
          return { leadsOverrides: next, leadInteractions: nextInteractions }
        }),
    }),
    {
      name: 'krisantec-crm',
      // Bump version to discard any corrupted localStorage written during the
      // infinite-loop bug. Old persisted state is automatically cleared and
      // replaced with clean default seed data.
      version: 2,
    }
  )
)

export function useCurrentIndustry() {
  const key = useIndustryStore((s) => s.current)
  return getIndustry(key)
}

export { industries }


