import type { LucideIcon } from 'lucide-react'
import {
  Activity,
  ChartNoAxesCombined,
  CircleDollarSign,
  ClipboardList,
  FileSpreadsheet,
  HandCoins,
  Receipt,
  Settings2,
} from 'lucide-react'

export interface FinanceRouteItem {
  path: string
  label: string
  icon: LucideIcon
}

export const financeRoutes: FinanceRouteItem[] = [
  { path: '/finance', label: 'Overview', icon: CircleDollarSign },
  { path: '/finance/invoices', label: 'Invoices', icon: Receipt },
  { path: '/finance/payments', label: 'Payments', icon: HandCoins },
  { path: '/finance/expenses', label: 'Expenses', icon: ClipboardList },
  { path: '/finance/collections', label: 'Collections', icon: Activity },
  { path: '/finance/analytics', label: 'Analytics', icon: ChartNoAxesCombined },
  { path: '/finance/reports', label: 'Reports', icon: FileSpreadsheet },
  { path: '/finance/settings', label: 'Settings', icon: Settings2 },
]
