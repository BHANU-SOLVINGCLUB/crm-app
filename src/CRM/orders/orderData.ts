import type { Customer } from '../../data/customerData'
import { INITIAL_CUSTOMERS } from '../../data/customerData'
import { initialProducts, type CatalogProduct } from '../product-catalog/data'

export type CommerceOrderStatus =
  | 'New Orders'
  | 'Accepted'
  | 'Processing'
  | 'Ready to Ship'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned'

export type PaymentMethod = 'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking' | 'Cash on Delivery'
export type CommercePaymentStatus = 'Paid' | 'Pending' | 'Failed' | 'Refunded'
export type DeliveryType = 'Standard' | 'Express' | 'Same Day' | 'Store Pickup'

export interface CommerceOrderItem {
  productId: string
  productName: string
  sku: string
  image: string
  quantity: number
  unitPrice: number
  lineTotal: number
}

export interface CommerceOrderCustomer {
  id: number
  name: string
  mobile: string
  email: string
  address: string
}

export interface CommerceOrder {
  id: string
  orderNumber: string
  customerId: number
  customerName: string
  customer: CommerceOrderCustomer
  items: CommerceOrderItem[]
  totalItems: number
  subtotal: number
  tax: number
  shipping: number
  discount: number
  totalAmount: number
  paymentMethod: PaymentMethod
  paymentStatus: CommercePaymentStatus
  deliveryType: DeliveryType
  expectedDeliveryDate: string
  status: CommerceOrderStatus
  createdAt: string
  updatedAt: string
  productId: string
  productName: string
  quantity: number
  unitPrice: number
}

export const ORDER_STATUSES: CommerceOrderStatus[] = [
  'New Orders',
  'Accepted',
  'Processing',
  'Ready to Ship',
  'Shipped',
  'Delivered',
  'Cancelled',
  'Returned',
]

export const FULFILLMENT_STEPS: CommerceOrderStatus[] = [
  'New Orders',
  'Accepted',
  'Processing',
  'Ready to Ship',
  'Shipped',
  'Delivered',
]

export const statusMeta: Record<CommerceOrderStatus, { label: string; tone: string; color: string }> = {
  'New Orders': { label: 'New Orders', tone: 'blue', color: '#2563eb' },
  Accepted: { label: 'Accepted', tone: 'violet', color: '#7c3aed' },
  Processing: { label: 'Processing', tone: 'amber', color: '#d97706' },
  'Ready to Ship': { label: 'Ready to Ship', tone: 'slate', color: '#475569' },
  Shipped: { label: 'Shipped', tone: 'blue', color: '#0284c7' },
  Delivered: { label: 'Delivered', tone: 'emerald', color: '#059669' },
  Cancelled: { label: 'Cancelled', tone: 'rose', color: '#dc2626' },
  Returned: { label: 'Returned', tone: 'amber', color: '#b45309' },
}

const firstNames = [
  'Aarav', 'Anaya', 'Vivaan', 'Isha', 'Kabir', 'Meera', 'Reyansh', 'Diya', 'Aditya', 'Nisha',
  'Rohan', 'Kiara', 'Arjun', 'Priya', 'Saanvi', 'Kavya', 'Nikhil', 'Swati', 'Manish', 'Lakshmi',
]

const lastNames = [
  'Sharma', 'Patel', 'Nair', 'Verma', 'Gupta', 'Joshi', 'Rajan', 'Bansal', 'Iyer', 'Mehta',
  'Kapoor', 'Rao', 'Das', 'Menon', 'Malhotra', 'Krishnan', 'Sinha', 'Chopra', 'Kulkarni', 'Pillai',
]

const streets = [
  'MG Road', 'Linking Road', 'Anna Salai', 'Park Street', 'FC Road', 'Banjara Hills',
  'Indiranagar', 'Civil Lines', 'Satellite Road', 'Salt Lake',
]

const cities = ['Bengaluru', 'Mumbai', 'Delhi', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad']
const paymentMethods: PaymentMethod[] = ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Cash on Delivery']
const deliveryTypes: DeliveryType[] = ['Standard', 'Express', 'Same Day', 'Store Pickup']

function daysAgo(days: number, hour = 10) {
  const date = new Date()
  date.setDate(date.getDate() - days)
  date.setHours(hour, (days * 11) % 60, 0, 0)
  return date.toISOString()
}

function daysAfter(value: string, days: number) {
  const date = new Date(value)
  date.setDate(date.getDate() + days)
  return date.toISOString()
}

function seededCustomers(): Customer[] {
  const generated: Customer[] = Array.from({ length: 38 }, (_, index) => {
    const id = index + 13
    const name = `${firstNames[index % firstNames.length]} ${lastNames[(index * 3) % lastNames.length]}`
    const revenue = 85_000 + index * 42_500
    return {
      id,
      name,
      company: `${lastNames[(index * 5) % lastNames.length]} Retail ${index + 1}`,
      phone: `+91 9${String(100000000 + index * 73421).slice(0, 9)}`,
      email: `${name.toLowerCase().replaceAll(' ', '.')}@example.in`,
      status: index % 9 === 0 ? 'VIP' : index % 7 === 0 ? 'Pending' : index % 11 === 0 ? 'Inactive' : 'Active',
      revenue,
      lastActivity: 'Order activity synced',
      lastActivityDays: index % 14,
      assignedManager: ['Rahul Mehta', 'Sneha Iyer', 'Anita Das'][index % 3],
      renewalDate: daysAfter(daysAgo(index % 60), 90 + index).slice(0, 10),
      paymentStatus: index % 8 === 0 ? 'Pending' : index % 13 === 0 ? 'Overdue' : 'Paid',
      notes: 'Generated ecommerce CRM customer with order history.',
      purchaseHistory: [{ date: daysAgo(index % 90).slice(0, 10), item: 'Online store order', amount: revenue }],
      supportTickets: [],
    }
  })
  return [...INITIAL_CUSTOMERS, ...generated]
}

export const commerceCustomers = seededCustomers()

function customerAddress(index: number) {
  return `${42 + index}, ${streets[index % streets.length]}, ${cities[index % cities.length]} - ${560001 + index}`
}

function orderStatus(index: number): CommerceOrderStatus {
  const weighted: CommerceOrderStatus[] = [
    'New Orders', 'New Orders', 'Accepted', 'Processing', 'Processing', 'Ready to Ship',
    'Shipped', 'Shipped', 'Delivered', 'Delivered', 'Delivered', 'Delivered', 'Cancelled', 'Returned',
  ]
  return weighted[index % weighted.length]
}

function paymentStatus(status: CommerceOrderStatus, index: number): CommercePaymentStatus {
  if (status === 'Cancelled' || status === 'Returned') return index % 2 === 0 ? 'Refunded' : 'Paid'
  if (index % 17 === 0) return 'Failed'
  if (index % 5 === 0) return 'Pending'
  return 'Paid'
}

export function buildCommerceOrders(
  customers: Customer[] = commerceCustomers,
  products: CatalogProduct[] = initialProducts
): CommerceOrder[] {
  return Array.from({ length: 128 }, (_, index) => {
    const customer = customers[index % customers.length]
    const createdAt = daysAgo(index % 180, 9 + (index % 10))
    const itemCount = 1 + (index % 4)
    const selectedProducts = Array.from({ length: itemCount }, (_, itemIndex) => products[(index * 7 + itemIndex * 13) % products.length])
    const items = selectedProducts.map((product, itemIndex) => {
      const quantity = 1 + ((index + itemIndex) % 4)
      const unitPrice = product.salePrice || product.price
      return {
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        image: product.images[0] ?? '',
        quantity,
        unitPrice,
        lineTotal: quantity * unitPrice,
      }
    })
    const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0)
    const tax = Math.round(subtotal * 0.09)
    const shipping = subtotal > 5000 ? 0 : 149
    const discount = index % 6 === 0 ? Math.round(subtotal * 0.08) : index % 10 === 0 ? 250 : 0
    const status = orderStatus(index)
    const firstItem = items[0]
    return {
      id: `ord-${String(10_001 + index)}`,
      orderNumber: `ORD-${String(10_001 + index)}`,
      customerId: customer.id,
      customerName: customer.name,
      customer: {
        id: customer.id,
        name: customer.name,
        mobile: customer.phone,
        email: customer.email,
        address: customerAddress(index),
      },
      items,
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal,
      tax,
      shipping,
      discount,
      totalAmount: subtotal + tax + shipping - discount,
      paymentMethod: paymentMethods[index % paymentMethods.length],
      paymentStatus: paymentStatus(status, index),
      deliveryType: deliveryTypes[index % deliveryTypes.length],
      expectedDeliveryDate: daysAfter(createdAt, 2 + (index % 5)),
      status,
      createdAt,
      updatedAt: daysAfter(createdAt, Math.min(3, index % 6)),
      productId: firstItem.productId,
      productName: firstItem.productName,
      quantity: firstItem.quantity,
      unitPrice: firstItem.unitPrice,
    }
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export const initialCommerceOrders = buildCommerceOrders()

export function isRevenueOrder(status: string) {
  return status === 'Delivered' || status === 'Shipped' || status === 'Ready to Ship' || status === 'Processing' || status === 'Accepted'
}

export function isPendingOrder(status: string) {
  return status === 'New Orders' || status === 'Accepted' || status === 'Processing' || status === 'Ready to Ship'
}

export function formatOrderDate(value: string | undefined | null) {
  if (!value) return 'N/A'
  const date = new Date(value)
  if (isNaN(date.getTime())) return 'Invalid Date'
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

export function calculateOrderAnalytics(orders: CommerceOrder[]) {
  const now = new Date()
  const todayKey = now.toDateString()
  const month = now.getMonth()
  const year = now.getFullYear()
  const revenueOrders = orders.filter((order) => isRevenueOrder(order.status))
  const todayRevenue = revenueOrders
    .filter((order) => new Date(order.createdAt).toDateString() === todayKey)
    .reduce((sum, order) => sum + order.totalAmount, 0)
  const monthlyRevenue = revenueOrders
    .filter((order) => {
      const date = new Date(order.createdAt)
      return date.getMonth() === month && date.getFullYear() === year
    })
    .reduce((sum, order) => sum + order.totalAmount, 0)
  const totalRevenue = revenueOrders.reduce((sum, order) => sum + order.totalAmount, 0)

  return {
    totalOrders: orders.length,
    pendingOrders: orders.filter((order) => isPendingOrder(order.status)).length,
    deliveredOrders: orders.filter((order) => order.status === 'Delivered').length,
    cancelledOrders: orders.filter((order) => order.status === 'Cancelled').length,
    todayRevenue,
    monthlyRevenue,
    averageOrderValue: revenueOrders.length ? Math.round(totalRevenue / revenueOrders.length) : 0,
    totalRevenue,
  }
}

export function ordersByStatus(orders: CommerceOrder[]) {
  return ORDER_STATUSES.map((status) => ({
    name: status,
    value: orders.filter((order) => order.status === status).length,
    color: statusMeta[status].color,
  }))
}

export function dailyOrdersTrend(orders: CommerceOrder[], days = 14) {
  const now = new Date()
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(now)
    date.setDate(date.getDate() - (days - 1 - index))
    const dateKey = date.toDateString()
    const dayOrders = orders.filter((order) => new Date(order.createdAt).toDateString() === dateKey)
    return {
      day: new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short' }).format(date),
      orders: dayOrders.length,
      revenue: dayOrders.reduce((sum, order) => sum + order.totalAmount, 0),
    }
  })
}

export function monthlyRevenueTrend(orders: CommerceOrder[]) {
  const now = new Date()
  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now)
    date.setMonth(date.getMonth() - (5 - index))
    const revenue = orders
      .filter((order) => {
        const orderDate = new Date(order.createdAt)
        return orderDate.getMonth() === date.getMonth() && orderDate.getFullYear() === date.getFullYear() && isRevenueOrder(order.status)
      })
      .reduce((sum, order) => sum + order.totalAmount, 0)
    return {
      month: new Intl.DateTimeFormat('en-IN', { month: 'short' }).format(date),
      revenue,
    }
  })
}

export function topSellingProducts(orders: CommerceOrder[], limit = 5) {
  const rows = new Map<string, { id: string; name: string; sku: string; sold: number; revenue: number }>()
  orders
    .filter((order) => isRevenueOrder(order.status))
    .flatMap((order) => {
      if (order.items && order.items.length > 0) return order.items
      // Fallback for flat legacy orders that lack an items array
      if (order.productId) {
        return [{
          productId: order.productId,
          productName: order.productName ?? 'Unknown',
          sku: '',
          image: '',
          quantity: order.quantity ?? 1,
          unitPrice: order.unitPrice ?? 0,
          lineTotal: order.totalAmount ?? 0,
        }]
      }
      return []
    })
    .forEach((item) => {
      if (!item?.productId) return
      const previous = rows.get(item.productId) ?? { id: item.productId, name: item.productName, sku: item.sku, sold: 0, revenue: 0 }
      rows.set(item.productId, {
        ...previous,
        sold: previous.sold + (item.quantity ?? 0),
        revenue: previous.revenue + (item.lineTotal ?? 0),
      })
    })
  return Array.from(rows.values()).sort((a, b) => b.revenue - a.revenue).slice(0, limit)
}
