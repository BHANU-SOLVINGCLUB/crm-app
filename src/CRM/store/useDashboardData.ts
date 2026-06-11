import { useMemo } from 'react'
import { leadsByIndustry } from '../data/leads'
import { normalizeIndustryKey } from '../data/industries'
import { useProductCatalogStore } from '../product-catalog/store'
import { useCRMStore } from './crmStore'
import {
  buildCustomerOverview,
  buildLeadFunnel,
  buildLowStockAlerts,
  buildSalesChart,
  buildTopSellingProducts,
  computeDashboardKPIs,
  getRecentActivities,
} from './dashboardSelectors'
import { useIndustryStore } from './industryStore'

/**
 * Central dashboard data hook — subscribes to all module stores and returns
 * derived KPIs, charts, and feeds. Re-renders when any source data changes.
 */
export function useDashboardData(timeframe: string) {
  const leadsOverrides = useIndustryStore((s) => s.leadsOverrides)
  const currentIndustry = useIndustryStore((s) => s.current)
  const safeKey = normalizeIndustryKey(currentIndustry)

  const products = useProductCatalogStore((s) => s.products)
  const customers = useCRMStore((s) => s.customers)
  const orders = useCRMStore((s) => s.orders)
  const tasks = useCRMStore((s) => s.tasks)
  const activities = useCRMStore((s) => s.activities)

  const leads = useMemo(
    () => useIndustryStore.getState().getLeads(safeKey),
    [leadsOverrides, safeKey]
  )

  const schema = leadsByIndustry[safeKey].schema

  const kpis = useMemo(
    () => computeDashboardKPIs({ leads, schema, customers, products, orders }),
    [leads, schema, customers, products, orders]
  )

  const salesData = useMemo(() => buildSalesChart(orders, timeframe), [orders, timeframe])
  const funnelData = useMemo(() => buildLeadFunnel(leads, schema), [leads, schema])
  const topProducts = useMemo(() => buildTopSellingProducts(orders), [orders])
  const lowStockProducts = useMemo(() => buildLowStockAlerts(products), [products])
  const customerOverview = useMemo(() => buildCustomerOverview(customers), [customers])
  const recentActivities = useMemo(() => getRecentActivities(activities), [activities])

  return {
    leads,
    schema,
    kpis,
    salesData,
    funnelData,
    topProducts,
    lowStockProducts,
    customerOverview,
    recentActivities,
    tasks,
    customers,
    orders,
  }
}
