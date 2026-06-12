import type { LeadRow, LeadSchema } from '../data/leads'
import type { Customer } from '../data/customerData'
import type { CatalogProduct } from '../product-catalog/data'
import { isInventoryTracked, isLowStock } from '../product-catalog/data'
import type { ActivityEntry, Order } from './crmStore'
import { calculateOrderAnalytics, isPendingOrder, isRevenueOrder } from '../orders/orderData'

/** Lead statuses that represent a successful conversion */
export const CONVERTED_STATUSES = new Set([
  'Won', 'Booked', 'Admitted', 'Confirmed', 'Signed', 'Ordered',
  'PO Received', 'Closed', 'Checked-in', 'Shipped', 'Token Paid',
  'Recovered', 'Visited',
])

/** Lead statuses excluded from funnel / active counts */
export const DEAD_STATUSES = new Set([
  'Lost', 'Spam', 'Duplicate', 'Cancelled', 'Dropped', 'Returned',
])

const FUNNEL_COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#06b6d4', '#ec4899', '#14b8a6', '#f43f5e']

export interface DashboardKPIs {
  totalLeads: number
  qualifiedLeads: number
  convertedLeads: number
  totalCustomers: number
  totalProducts: number
  lowStock: number
  outOfStock: number
  pendingOrders: number
  totalOrders: number
  deliveredOrders: number
  cancelledOrders: number
  todayRevenue: number
  monthlyRevenue: number
  averageOrderValue: number
  totalRevenue: number
  revenueDelta: number
}

export interface FunnelStage {
  stage: string
  count: number
  color: string
}

export interface TopProductRow {
  id: string
  name: string
  sold: number
  revenue: number
}

export interface LowStockAlertRow {
  id: string
  name: string
  stock: number
  minStock: number
}

export function isConvertedStatus(status: string) {
  return CONVERTED_STATUSES.has(status)
}

export function isDeadStatus(status: string) {
  return DEAD_STATUSES.has(status)
}

export function isQualifiedLead(lead: LeadRow, schema: LeadSchema) {
  const status = String(lead.status ?? '')
  if (!status || isDeadStatus(status)) return false
  const idx = schema.statuses.indexOf(status)
  return idx > 0
}

export function computeDashboardKPIs(input: {
  leads: LeadRow[]
  schema: LeadSchema
  customers: Customer[]
  products: CatalogProduct[]
  orders: Order[]
}): DashboardKPIs {
  const { leads, schema, customers, products, orders } = input

  const totalLeads = leads.length
  const qualifiedLeads = leads.filter((l) => isQualifiedLead(l, schema)).length
  const convertedLeads = leads.filter((l) => isConvertedStatus(String(l.status ?? ''))).length

  const totalCustomers = customers.length
  const totalProducts = products.filter((p) => p.status === 'Active').length

  const trackedProducts = products.filter((p) => p.status !== 'Archived' && isInventoryTracked(p))
  const lowStock = trackedProducts.filter((p) => isLowStock(p)).length
  const outOfStock = trackedProducts.filter((p) => p.stockQuantity <= 0).length

  const orderAnalytics = calculateOrderAnalytics(orders)
  const pendingOrders = orders.filter((o) => isPendingOrder(o.status)).length
  const completedOrders = orders.filter((o) => isRevenueOrder(o.status))
  const totalRevenue = orderAnalytics.totalRevenue

  const now = Date.now()
  const weekMs = 7 * 24 * 60 * 60 * 1000
  const thisWeekRev = completedOrders
    .filter((o) => now - new Date(o.createdAt).getTime() <= weekMs)
    .reduce((sum, o) => sum + o.totalAmount, 0)
  const lastWeekRev = completedOrders
    .filter((o) => {
      const age = now - new Date(o.createdAt).getTime()
      return age > weekMs && age <= 2 * weekMs
    })
    .reduce((sum, o) => sum + o.totalAmount, 0)
  const revenueDelta =
    lastWeekRev > 0 ? +(((thisWeekRev - lastWeekRev) / lastWeekRev) * 100).toFixed(1) : 0

  return {
    totalLeads,
    qualifiedLeads,
    convertedLeads,
    totalCustomers,
    totalProducts,
    lowStock,
    outOfStock,
    pendingOrders,
    totalOrders: orderAnalytics.totalOrders,
    deliveredOrders: orderAnalytics.deliveredOrders,
    cancelledOrders: orderAnalytics.cancelledOrders,
    todayRevenue: orderAnalytics.todayRevenue,
    monthlyRevenue: orderAnalytics.monthlyRevenue,
    averageOrderValue: orderAnalytics.averageOrderValue,
    totalRevenue,
    revenueDelta,
  }
}

/** Funnel uses each non-dead status from the industry schema */
export function buildLeadFunnel(leads: LeadRow[], schema: LeadSchema): FunnelStage[] {
  const stages = schema.statuses.filter((status) => !isDeadStatus(status))
  return stages.map((status, index) => ({
    stage: status,
    count: leads.filter((lead) => String(lead.status ?? '') === status).length,
    color: FUNNEL_COLORS[index % FUNNEL_COLORS.length],
  }))
}

export function buildSalesChart(orders: Order[], timeframe: string) {
  const nonCancelled = orders.filter((o) => o.status !== 'Cancelled' && o.status !== 'Returned')
  const now = new Date()

  if (timeframe === '7d') {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now)
      d.setDate(d.getDate() - (6 - i))
      const dateStr = d.toDateString()
      const dayOrders = nonCancelled.filter((o) => new Date(o.createdAt).toDateString() === dateStr)
      return {
        day: dayNames[d.getDay()],
        revenue: dayOrders.reduce((sum, o) => sum + o.totalAmount, 0),
        orders: dayOrders.length,
      }
    })
  }

  if (timeframe === '30d') {
    return Array.from({ length: 4 }, (_, i) => {
      const endOffset = (3 - i) * 7
      const startOffset = endOffset + 6
      const weekEnd = new Date(now)
      weekEnd.setDate(weekEnd.getDate() - endOffset)
      const weekStart = new Date(now)
      weekStart.setDate(weekStart.getDate() - startOffset)
      const weekOrds = nonCancelled.filter((o) => {
        const od = new Date(o.createdAt)
        return od >= weekStart && od <= weekEnd
      })
      return {
        day: `Wk ${i + 1}`,
        revenue: weekOrds.reduce((sum, o) => sum + o.totalAmount, 0),
        orders: weekOrds.length,
      }
    })
  }

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return Array.from({ length: 12 }, (_, i) => {
    const target = new Date(now)
    target.setMonth(target.getMonth() - (11 - i))
    const m = target.getMonth()
    const y = target.getFullYear()
    const monthOrds = nonCancelled.filter((o) => {
      const od = new Date(o.createdAt)
      return od.getMonth() === m && od.getFullYear() === y
    })
    return {
      day: monthNames[m],
      revenue: monthOrds.reduce((sum, o) => sum + o.totalAmount, 0),
      orders: monthOrds.length,
    }
  })
}

export function buildTopSellingProducts(orders: Order[], limit = 4): TopProductRow[] {
  const map = new Map<string, TopProductRow>()
  orders
    .filter((o) => isRevenueOrder(o.status))
    .forEach((o) => {
      let items: Array<{ productId: string; productName: string; quantity: number; lineTotal: number }>
      if (o.items && o.items.length > 0) {
        items = o.items
      } else if (o.productId) {
        items = [{ productId: o.productId, productName: o.productName ?? 'Unknown', quantity: o.quantity ?? 1, lineTotal: o.totalAmount ?? 0 }]
      } else {
        return // skip orders with no items and no productId
      }
      items.forEach((item) => {
        if (!item?.productId) return
        const prev = map.get(item.productId) ?? { id: item.productId, name: item.productName, sold: 0, revenue: 0 }
        map.set(item.productId, {
          id: item.productId,
          name: item.productName,
          sold: prev.sold + (item.quantity ?? 0),
          revenue: prev.revenue + (item.lineTotal ?? 0),
        })
      })
    })
  return Array.from(map.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit)
}

/** stock <= reorderLevel (minStock) */
export function buildLowStockAlerts(products: CatalogProduct[], limit = 5): LowStockAlertRow[] {
  return products
    .filter((p) => p.status !== 'Archived' && isInventoryTracked(p) && isLowStock(p))
    .slice(0, limit)
    .map((p) => ({
      id: p.id,
      name: p.name,
      stock: p.stockQuantity,
      minStock: p.reorderLevel,
    }))
}

export function buildCustomerOverview(customers: Customer[]) {
  const total = customers.length || 1
  const returning = customers.filter((c) => c.status === 'Active' || c.status === 'VIP' || c.status === 'Inactive').length
  const newCust = customers.filter((c) => c.status === 'Pending').length
  return [
    { name: 'Returning', value: Math.round((returning / total) * 100), color: '#3b82f6' },
    { name: 'New', value: Math.round((newCust / total) * 100), color: '#10b981' },
  ].filter((c) => c.value > 0)
}

export function getRecentActivities(activities: ActivityEntry[], limit = 5) {
  return [...activities]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)
}

export function getLeadDisplayName(row: LeadRow, preferredKeys = ['name', 'student', 'guest', 'company', 'contact', 'parent']) {
  for (const key of preferredKeys) {
    const value = row[key]
    if (value !== undefined && value !== null && String(value).trim()) {
      return String(value).trim()
    }
  }
  return 'New lead'
}
