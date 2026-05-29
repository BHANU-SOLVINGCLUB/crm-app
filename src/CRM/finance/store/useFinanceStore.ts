import { create } from 'zustand'
import type { FinanceDateRange } from '../types'

interface FinanceStoreState {
  dateRange: FinanceDateRange
  setDateRange: (range: FinanceDateRange) => void
}

export const useFinanceStore = create<FinanceStoreState>((set) => ({
  dateRange: '30d',
  setDateRange: (dateRange) => set({ dateRange }),
}))
