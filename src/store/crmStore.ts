import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Customer } from '../data/customerData'
import {
  commerceCustomers,
  initialCommerceOrders,
  type CommerceOrder,
  type CommerceOrderStatus,
} from '../CRM/orders/orderData'

// ─── Types ────────────────────────────────────────────────────────────────────

export type OrderStatus = CommerceOrderStatus
export type Order = CommerceOrder

export type TaskStatus = 'pending' | 'inprogress' | 'completed'

export interface Task {
  id: string
  title: string
  desc: string
  status: TaskStatus
  createdAt: string
}

export type ActivityModule = 'Leads' | 'Customers' | 'Products' | 'Orders' | 'Tasks' | 'System'
export type ActivityIconType = 'lead' | 'customer' | 'product' | 'order' | 'task' | 'award'

export interface ActivityEntry {
  id: string
  action: string
  user: string
  module: ActivityModule
  iconType: ActivityIconType
  iconColor: string
  createdAt: string
}

// ─── Seed helpers ─────────────────────────────────────────────────────────────

function daysAgo(days: number, hoursOffset = 0): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  d.setHours(d.getHours() - hoursOffset)
  return d.toISOString()
}

function monthsAgo(months: number): string {
  const d = new Date()
  d.setMonth(d.getMonth() - months)
  return d.toISOString()
}

// ─── Seed Orders (cover 7d, 30d, 12m chart ranges) ───────────────────────────

const SEED_ORDERS: unknown[] = [
  // ── Last 7 days ──
  { id: 'ord-001', orderNumber: 'ORD-1001', customerName: 'Priya Sharma',   productId: 'prod-1001', productName: 'Aero Wireless Headphones', quantity: 8,  unitPrice: 10999, totalAmount: 87992,  status: 'Completed', createdAt: daysAgo(0, 2) },
  { id: 'ord-002', orderNumber: 'ORD-1002', customerName: 'Arjun Patel',    productId: 'prod-1002', productName: 'Urban Linen Shirt',         quantity: 15, unitPrice: 1599,  totalAmount: 23985,  status: 'Completed', createdAt: daysAgo(0, 5) },
  { id: 'ord-003', orderNumber: 'ORD-1003', customerName: 'Kavya Nair',     productId: 'prod-1001', productName: 'Aero Wireless Headphones', quantity: 3,  unitPrice: 10999, totalAmount: 32997,  status: 'Pending',   createdAt: daysAgo(0, 1) },
  { id: 'ord-004', orderNumber: 'ORD-1004', customerName: 'Rohit Verma',    productId: 'prod-1005', productName: 'Doctor Consultation',       quantity: 5,  unitPrice: 799,   totalAmount: 3995,   status: 'Completed', createdAt: daysAgo(1, 3) },
  { id: 'ord-005', orderNumber: 'ORD-1005', customerName: 'Divya K',        productId: 'prod-1002', productName: 'Urban Linen Shirt',         quantity: 20, unitPrice: 1599,  totalAmount: 31980,  status: 'Completed', createdAt: daysAgo(1, 1) },
  { id: 'ord-006', orderNumber: 'ORD-1006', customerName: 'Swati Joshi',    productId: 'prod-1001', productName: 'Aero Wireless Headphones', quantity: 6,  unitPrice: 10999, totalAmount: 65994,  status: 'Processing',createdAt: daysAgo(1, 6) },
  { id: 'ord-007', orderNumber: 'ORD-1007', customerName: 'Nikhil Rajan',   productId: 'prod-1002', productName: 'Urban Linen Shirt',         quantity: 10, unitPrice: 1599,  totalAmount: 15990,  status: 'Pending',   createdAt: daysAgo(2, 2) },
  { id: 'ord-008', orderNumber: 'ORD-1008', customerName: 'Lakshmi V',      productId: 'prod-1005', productName: 'Doctor Consultation',       quantity: 8,  unitPrice: 799,   totalAmount: 6392,   status: 'Completed', createdAt: daysAgo(2, 4) },
  { id: 'ord-009', orderNumber: 'ORD-1009', customerName: 'Vikram M',       productId: 'prod-1001', productName: 'Aero Wireless Headphones', quantity: 12, unitPrice: 10999, totalAmount: 131988, status: 'Completed', createdAt: daysAgo(3, 1) },
  { id: 'ord-010', orderNumber: 'ORD-1010', customerName: 'Pooja Bansal',   productId: 'prod-1002', productName: 'Urban Linen Shirt',         quantity: 8,  unitPrice: 1599,  totalAmount: 12792,  status: 'Cancelled', createdAt: daysAgo(3, 7) },
  { id: 'ord-011', orderNumber: 'ORD-1011', customerName: 'Suresh N',       productId: 'prod-1001', productName: 'Aero Wireless Headphones', quantity: 10, unitPrice: 10999, totalAmount: 109990, status: 'Completed', createdAt: daysAgo(4, 2) },
  { id: 'ord-012', orderNumber: 'ORD-1012', customerName: 'Manish Gupta',   productId: 'prod-1005', productName: 'Doctor Consultation',       quantity: 12, unitPrice: 799,   totalAmount: 9588,   status: 'Completed', createdAt: daysAgo(4, 5) },
  { id: 'ord-013', orderNumber: 'ORD-1013', customerName: 'Priya Sharma',   productId: 'prod-1002', productName: 'Urban Linen Shirt',         quantity: 5,  unitPrice: 1599,  totalAmount: 7995,   status: 'Pending',   createdAt: daysAgo(5, 3) },
  { id: 'ord-014', orderNumber: 'ORD-1014', customerName: 'Arjun Patel',    productId: 'prod-1001', productName: 'Aero Wireless Headphones', quantity: 4,  unitPrice: 10999, totalAmount: 43996,  status: 'Completed', createdAt: daysAgo(5, 1) },
  { id: 'ord-015', orderNumber: 'ORD-1015', customerName: 'Kavya Nair',     productId: 'prod-1005', productName: 'Doctor Consultation',       quantity: 6,  unitPrice: 799,   totalAmount: 4794,   status: 'Completed', createdAt: daysAgo(6, 2) },
  { id: 'ord-016', orderNumber: 'ORD-1016', customerName: 'Divya K',        productId: 'prod-1002', productName: 'Urban Linen Shirt',         quantity: 25, unitPrice: 1599,  totalAmount: 39975,  status: 'Completed', createdAt: daysAgo(6, 4) },
  // ── Days 7–30 (30d chart) ──
  { id: 'ord-017', orderNumber: 'ORD-1017', customerName: 'Swati Joshi',  productId: 'prod-1001', productName: 'Aero Wireless Headphones', quantity: 7,  unitPrice: 10999, totalAmount: 76993,  status: 'Completed', createdAt: daysAgo(8)  },
  { id: 'ord-018', orderNumber: 'ORD-1018', customerName: 'Nikhil Rajan', productId: 'prod-1002', productName: 'Urban Linen Shirt',         quantity: 12, unitPrice: 1599,  totalAmount: 19188,  status: 'Completed', createdAt: daysAgo(9)  },
  { id: 'ord-019', orderNumber: 'ORD-1019', customerName: 'Priya Sharma', productId: 'prod-1005', productName: 'Doctor Consultation',       quantity: 10, unitPrice: 799,   totalAmount: 7990,   status: 'Completed', createdAt: daysAgo(10) },
  { id: 'ord-020', orderNumber: 'ORD-1020', customerName: 'Arjun Patel',  productId: 'prod-1001', productName: 'Aero Wireless Headphones', quantity: 5,  unitPrice: 10999, totalAmount: 54995,  status: 'Completed', createdAt: daysAgo(12) },
  { id: 'ord-021', orderNumber: 'ORD-1021', customerName: 'Kavya Nair',   productId: 'prod-1002', productName: 'Urban Linen Shirt',         quantity: 18, unitPrice: 1599,  totalAmount: 28782,  status: 'Completed', createdAt: daysAgo(14) },
  { id: 'ord-022', orderNumber: 'ORD-1022', customerName: 'Rohit Verma',  productId: 'prod-1001', productName: 'Aero Wireless Headphones', quantity: 9,  unitPrice: 10999, totalAmount: 98991,  status: 'Completed', createdAt: daysAgo(16) },
  { id: 'ord-023', orderNumber: 'ORD-1023', customerName: 'Divya K',      productId: 'prod-1005', productName: 'Doctor Consultation',       quantity: 15, unitPrice: 799,   totalAmount: 11985,  status: 'Completed', createdAt: daysAgo(18) },
  { id: 'ord-024', orderNumber: 'ORD-1024', customerName: 'Suresh N',     productId: 'prod-1001', productName: 'Aero Wireless Headphones', quantity: 14, unitPrice: 10999, totalAmount: 153986, status: 'Completed', createdAt: daysAgo(20) },
  { id: 'ord-025', orderNumber: 'ORD-1025', customerName: 'Manish Gupta', productId: 'prod-1002', productName: 'Urban Linen Shirt',         quantity: 22, unitPrice: 1599,  totalAmount: 35178,  status: 'Completed', createdAt: daysAgo(22) },
  { id: 'ord-026', orderNumber: 'ORD-1026', customerName: 'Pooja Bansal', productId: 'prod-1001', productName: 'Aero Wireless Headphones', quantity: 6,  unitPrice: 10999, totalAmount: 65994,  status: 'Completed', createdAt: daysAgo(25) },
  { id: 'ord-027', orderNumber: 'ORD-1027', customerName: 'Vikram M',     productId: 'prod-1005', productName: 'Doctor Consultation',       quantity: 8,  unitPrice: 799,   totalAmount: 6392,   status: 'Completed', createdAt: daysAgo(28) },
  // ── Months 1–11 (12m chart) ──
  { id: 'ord-030', orderNumber: 'ORD-1030', customerName: 'Priya Sharma', productId: 'prod-1001', productName: 'Aero Wireless Headphones', quantity: 20, unitPrice: 10999, totalAmount: 219980, status: 'Completed', createdAt: monthsAgo(1)  },
  { id: 'ord-031', orderNumber: 'ORD-1031', customerName: 'Arjun Patel',  productId: 'prod-1002', productName: 'Urban Linen Shirt',         quantity: 45, unitPrice: 1599,  totalAmount: 71955,  status: 'Completed', createdAt: monthsAgo(1)  },
  { id: 'ord-032', orderNumber: 'ORD-1032', customerName: 'Kavya Nair',   productId: 'prod-1001', productName: 'Aero Wireless Headphones', quantity: 18, unitPrice: 10999, totalAmount: 197982, status: 'Completed', createdAt: monthsAgo(2)  },
  { id: 'ord-033', orderNumber: 'ORD-1033', customerName: 'Rohit Verma',  productId: 'prod-1002', productName: 'Urban Linen Shirt',         quantity: 30, unitPrice: 1599,  totalAmount: 47970,  status: 'Completed', createdAt: monthsAgo(2)  },
  { id: 'ord-034', orderNumber: 'ORD-1034', customerName: 'Divya K',      productId: 'prod-1001', productName: 'Aero Wireless Headphones', quantity: 25, unitPrice: 10999, totalAmount: 274975, status: 'Completed', createdAt: monthsAgo(3)  },
  { id: 'ord-035', orderNumber: 'ORD-1035', customerName: 'Swati Joshi',  productId: 'prod-1005', productName: 'Doctor Consultation',       quantity: 40, unitPrice: 799,   totalAmount: 31960,  status: 'Completed', createdAt: monthsAgo(3)  },
  { id: 'ord-036', orderNumber: 'ORD-1036', customerName: 'Suresh N',     productId: 'prod-1001', productName: 'Aero Wireless Headphones', quantity: 30, unitPrice: 10999, totalAmount: 329970, status: 'Completed', createdAt: monthsAgo(4)  },
  { id: 'ord-037', orderNumber: 'ORD-1037', customerName: 'Manish Gupta', productId: 'prod-1002', productName: 'Urban Linen Shirt',         quantity: 50, unitPrice: 1599,  totalAmount: 79950,  status: 'Completed', createdAt: monthsAgo(4)  },
  { id: 'ord-038', orderNumber: 'ORD-1038', customerName: 'Pooja Bansal', productId: 'prod-1001', productName: 'Aero Wireless Headphones', quantity: 22, unitPrice: 10999, totalAmount: 241978, status: 'Completed', createdAt: monthsAgo(5)  },
  { id: 'ord-039', orderNumber: 'ORD-1039', customerName: 'Vikram M',     productId: 'prod-1002', productName: 'Urban Linen Shirt',         quantity: 35, unitPrice: 1599,  totalAmount: 55965,  status: 'Completed', createdAt: monthsAgo(5)  },
  { id: 'ord-040', orderNumber: 'ORD-1040', customerName: 'Priya Sharma', productId: 'prod-1001', productName: 'Aero Wireless Headphones', quantity: 15, unitPrice: 10999, totalAmount: 164985, status: 'Completed', createdAt: monthsAgo(6)  },
  { id: 'ord-041', orderNumber: 'ORD-1041', customerName: 'Nikhil Rajan', productId: 'prod-1005', productName: 'Doctor Consultation',       quantity: 25, unitPrice: 799,   totalAmount: 19975,  status: 'Completed', createdAt: monthsAgo(7)  },
  { id: 'ord-042', orderNumber: 'ORD-1042', customerName: 'Lakshmi V',    productId: 'prod-1001', productName: 'Aero Wireless Headphones', quantity: 12, unitPrice: 10999, totalAmount: 131988, status: 'Completed', createdAt: monthsAgo(8)  },
  { id: 'ord-043', orderNumber: 'ORD-1043', customerName: 'Arjun Patel',  productId: 'prod-1002', productName: 'Urban Linen Shirt',         quantity: 28, unitPrice: 1599,  totalAmount: 44772,  status: 'Completed', createdAt: monthsAgo(9)  },
  { id: 'ord-044', orderNumber: 'ORD-1044', customerName: 'Kavya Nair',   productId: 'prod-1001', productName: 'Aero Wireless Headphones', quantity: 16, unitPrice: 10999, totalAmount: 175984, status: 'Completed', createdAt: monthsAgo(10) },
  { id: 'ord-045', orderNumber: 'ORD-1045', customerName: 'Rohit Verma',  productId: 'prod-1005', productName: 'Doctor Consultation',       quantity: 20, unitPrice: 799,   totalAmount: 15980,  status: 'Completed', createdAt: monthsAgo(11) },
]

const SEED_TASKS: Task[] = [
  { id: 'task-001', title: 'Follow-up with Enterprise Lead', desc: 'Call regarding bulk order quotation.',  status: 'pending',    createdAt: daysAgo(0, 2) },
  { id: 'task-002', title: 'Approve Pending Invoices',       desc: 'Review 5 new vendor invoices.',         status: 'inprogress', createdAt: daysAgo(1, 3) },
  { id: 'task-003', title: 'Weekly Sales Sync',              desc: 'Team meeting at 2:00 PM.',              status: 'completed',  createdAt: daysAgo(2, 1) },
  { id: 'task-004', title: 'Restock Alert Processing',       desc: 'Order placed for 3 low stock items.',   status: 'completed',  createdAt: daysAgo(3, 4) },
]

const SEED_ACTIVITIES: ActivityEntry[] = [
  { id: 'act-001', action: 'New order: Aero Headphones ×8',       user: 'Priya Sharma',  module: 'Orders',    iconType: 'order',    iconColor: '#3b82f6', createdAt: daysAgo(0, 2) },
  { id: 'act-002', action: 'Customer registered: Kavya Nair',     user: 'Web Portal',    module: 'Customers', iconType: 'customer', iconColor: '#8b5cf6', createdAt: daysAgo(0, 4) },
  { id: 'act-003', action: 'New lead captured via WhatsApp',       user: 'Sales Team',    module: 'Leads',     iconType: 'lead',     iconColor: '#10b981', createdAt: daysAgo(0, 6) },
  { id: 'act-004', action: 'Stock updated: Urban Linen Shirt',     user: 'Inventory Bot', module: 'Products',  iconType: 'product',  iconColor: '#f59e0b', createdAt: daysAgo(1, 1) },
  { id: 'act-005', action: 'Order completed: ₹1.31L revenue',      user: 'Vikram M',      module: 'Orders',    iconType: 'award',    iconColor: '#10b981', createdAt: daysAgo(1, 3) },
]

void SEED_ORDERS

// ─── Store interface ──────────────────────────────────────────────────────────

interface CRMState {
  customers: Customer[]
  orders: Order[]
  tasks: Task[]
  activities: ActivityEntry[]
  _nextCustomerId: number

  // Customer CRUD
  addCustomer: (patch?: Partial<Customer>) => void
  updateCustomer: (id: number, patch: Partial<Customer>) => void
  deleteCustomers: (ids: Set<number>) => void

  // Order CRUD
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateOrderStatus: (id: string, status: OrderStatus) => void
  deleteOrder: (id: string) => void

  // Task CRUD
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void
  updateTask: (id: string, patch: Partial<Task>) => void
  deleteTask: (id: string) => void

  // Activity log
  pushActivity: (entry: Omit<ActivityEntry, 'id' | 'createdAt'>) => void
}

const baseState = {
  customers: commerceCustomers,
  orders: initialCommerceOrders,
  tasks: SEED_TASKS,
  activities: SEED_ACTIVITIES,
  _nextCustomerId: commerceCustomers.length + 1,
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useCRMStore = create<CRMState>()(
  persist(
    (set, get) => ({
      ...baseState,

      // ── Customers ──────────────────────────────────────────────────────────
      addCustomer: (patch = {}) => {
        const id = get()._nextCustomerId
        const customer: Customer = {
          id,
          name: '',
          company: '',
          phone: '',
          email: '',
          status: 'Active',
          revenue: 0,
          lastActivity: 'Customer added',
          lastActivityDays: 0,
          assignedManager: '',
          renewalDate: '',
          paymentStatus: 'Pending',
          notes: '',
          purchaseHistory: [],
          supportTickets: [],
          ...patch,
        }
        set((s) => ({
          customers: [customer, ...s.customers],
          _nextCustomerId: s._nextCustomerId + 1,
        }))
        get().pushActivity({
          action: `Customer added: ${customer.name || 'New Customer'}`,
          user: 'System',
          module: 'Customers',
          iconType: 'customer',
          iconColor: '#8b5cf6',
        })
      },

      updateCustomer: (id, patch) => {
        const existing = get().customers.find((c) => c.id === id)
        set((s) => ({
          customers: s.customers.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        }))
        if ('status' in patch || 'name' in patch) {
          const name = String(patch.name ?? existing?.name ?? 'Customer')
          get().pushActivity({
            action: `Customer updated: ${name}`,
            user: 'Customers',
            module: 'Customers',
            iconType: 'customer',
            iconColor: '#8b5cf6',
          })
        }
      },

      deleteCustomers: (ids) => {
        const count = ids.size
        set((s) => ({ customers: s.customers.filter((c) => !ids.has(c.id)) }))
        get().pushActivity({
          action: `${count} customer(s) removed`,
          user: 'System',
          module: 'Customers',
          iconType: 'customer',
          iconColor: '#f43f5e',
        })
      },

      // ── Orders ─────────────────────────────────────────────────────────────
      addOrder: (order) => {
        const newOrder: Order = {
          ...order,
          id: `ord-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set((s) => ({ orders: [newOrder, ...s.orders] }))
        get().pushActivity({
          action: `New order: ${order.productName} ×${order.quantity}`,
          user: order.customerName,
          module: 'Orders',
          iconType: 'order',
          iconColor: '#3b82f6',
        })
      },

      updateOrderStatus: (id, status) => {
        set((s) => ({
          orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)),
        }))
        get().pushActivity({
          action: `Order status updated → ${status}`,
          user: 'System',
          module: 'Orders',
          iconType: status === 'Delivered' ? 'award' : 'order',
          iconColor: status === 'Delivered' ? '#10b981' : '#3b82f6',
        })
      },

      deleteOrder: (id) => {
        const existing = get().orders.find((o) => o.id === id)
        set((s) => ({ orders: s.orders.filter((o) => o.id !== id) }))
        if (existing) {
          get().pushActivity({
            action: `Order removed: ${existing.orderNumber}`,
            user: 'System',
            module: 'Orders',
            iconType: 'order',
            iconColor: '#f43f5e',
          })
        }
      },

      // ── Tasks ──────────────────────────────────────────────────────────────
      addTask: (task) => {
        const newTask: Task = {
          ...task,
          id: `task-${Date.now()}`,
          createdAt: new Date().toISOString(),
        }
        set((s) => ({ tasks: [newTask, ...s.tasks] }))
        get().pushActivity({
          action: `Task created: ${task.title}`,
          user: 'System',
          module: 'Tasks',
          iconType: 'task',
          iconColor: '#06b6d4',
        })
      },

      updateTask: (id, patch) => {
        const existing = get().tasks.find((t) => t.id === id)
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        }))
        if (existing) {
          get().pushActivity({
            action: `Task updated: ${patch.title ?? existing.title}`,
            user: 'System',
            module: 'Tasks',
            iconType: 'task',
            iconColor: '#06b6d4',
          })
        }
      },

      deleteTask: (id) => {
        const existing = get().tasks.find((t) => t.id === id)
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }))
        if (existing) {
          get().pushActivity({
            action: `Task removed: ${existing.title}`,
            user: 'System',
            module: 'Tasks',
            iconType: 'task',
            iconColor: '#f43f5e',
          })
        }
      },

      // ── Activity log ───────────────────────────────────────────────────────
      pushActivity: (entry) => {
        const newEntry: ActivityEntry = {
          ...entry,
          id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          createdAt: new Date().toISOString(),
        }
        set((s) => ({
          // Keep most recent 50 entries
          activities: [newEntry, ...s.activities].slice(0, 50),
        }))
      },
    }),
    {
      name: 'krisantec-crm-main-v1',
      version: 1,
    }
  )
)

// ─── Helper: push activity from outside React (e.g., LeadCapture, ProductCatalog) ─
export function pushCRMActivity(entry: Omit<ActivityEntry, 'id' | 'createdAt'>) {
  useCRMStore.getState().pushActivity(entry)
}
