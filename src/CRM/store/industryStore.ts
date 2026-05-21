import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { industries, type IndustryKey, getIndustry } from '../data/industries'
import { leadsByIndustry, type LeadRow } from '../data/leads'

interface IndustryState {
  current: IndustryKey
  setIndustry: (key: IndustryKey) => void
  leadsOverrides: Partial<Record<IndustryKey, LeadRow[]>>
  getLeads: (key: IndustryKey) => LeadRow[]
  addLead: (key: IndustryKey, row: LeadRow) => void
  updateLead: (key: IndustryKey, rowIndex: number, field: string, value: string | number) => void
  deleteLeads: (key: IndustryKey, rowIndexes: Set<number>) => void
  setLeads: (key: IndustryKey, rows: LeadRow[]) => void
  resetLeads: (key: IndustryKey) => void
}

export const useIndustryStore = create<IndustryState>()(
  persist(
    (set, get) => ({
      current: 'healthcare',
      setIndustry: (key) => set({ current: key }),
      leadsOverrides: {},
      getLeads: (key) => {
        const overrides = get().leadsOverrides[key]
        return overrides ?? leadsByIndustry[key].rows
      },
      addLead: (key, row) =>
        set((s) => {
          const currentRows = s.leadsOverrides[key] ?? leadsByIndustry[key].rows
          return { leadsOverrides: { ...s.leadsOverrides, [key]: [...currentRows, row] } }
        }),
      updateLead: (key, rowIndex, field, value) =>
        set((s) => {
          const currentRows = s.leadsOverrides[key] ?? leadsByIndustry[key].rows
          const nextRows = currentRows.map((row, index) =>
            index === rowIndex ? { ...row, [field]: value } : row
          )
          return { leadsOverrides: { ...s.leadsOverrides, [key]: nextRows } }
        }),
      deleteLeads: (key, rowIndexes) =>
        set((s) => {
          const currentRows = s.leadsOverrides[key] ?? leadsByIndustry[key].rows
          const nextRows = currentRows.filter((_, index) => !rowIndexes.has(index))
          return { leadsOverrides: { ...s.leadsOverrides, [key]: nextRows } }
        }),
      setLeads: (key, rows) =>
        set((s) => ({ leadsOverrides: { ...s.leadsOverrides, [key]: rows } })),
      resetLeads: (key) =>
        set((s) => {
          const next = { ...s.leadsOverrides }
          delete next[key]
          return { leadsOverrides: next }
        }),
    }),
    { name: 'krisantec-crm' }
  )
)

export function useCurrentIndustry() {
  const key = useIndustryStore((s) => s.current)
  return getIndustry(key)
}

export { industries }


