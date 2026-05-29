import { create } from 'zustand'
import type { SupportDateRange } from '../types'

interface SupportStoreState {
  dateRange: SupportDateRange
  setDateRange: (range: SupportDateRange) => void
}

export const useSupportStore = create<SupportStoreState>((set) => ({
  dateRange: '7d',
  setDateRange: (dateRange) => set({ dateRange }),
}))
