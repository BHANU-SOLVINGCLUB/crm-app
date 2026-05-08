import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { industries, type IndustryKey, getIndustry } from '../data/industries'
import { leadsByIndustry, type LeadRow } from '../data/leads'

interface IndustryState {
  current: IndustryKey
  setIndustry: (key: IndustryKey) => void
  leadsOverrides: Partial<Record<IndustryKey, LeadRow[]>>
  getLeads: (key: IndustryKey) => LeadRow[]
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
