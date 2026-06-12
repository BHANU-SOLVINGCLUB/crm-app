/** Central CRM data layer — shared by dashboard and modules */
export { useCRMStore, pushCRMActivity } from './crmStore'
export type { Order, Task, ActivityEntry, OrderStatus, TaskStatus, ActivityModule } from './crmStore'
export { useIndustryStore, useCurrentIndustry, industries } from './industryStore'
export { useDashboardData } from './useDashboardData'
export {
  computeDashboardKPIs,
  buildLeadFunnel,
  buildSalesChart,
  buildTopSellingProducts,
  buildLowStockAlerts,
  CONVERTED_STATUSES,
  DEAD_STATUSES,
} from './dashboardSelectors'
