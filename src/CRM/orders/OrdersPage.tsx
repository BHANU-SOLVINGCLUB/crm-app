import { useMemo, useState } from 'react'
import {
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Mail,
  MapPin,
  PackageCheck,
  Phone,
  Search,
  Truck,
  User,
  XCircle,
} from 'lucide-react'
import clsx from 'clsx'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import PageHeader from '../Components/PageHeader'
import { useCRMStore, type Order } from '../store/crmStore'
import { useProductCatalogStore } from '../product-catalog/store'
import { formatINR, formatNumber } from '../lib/format'
import { Badge } from '../../components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import {
  FULFILLMENT_STEPS,
  ORDER_STATUSES,
  calculateOrderAnalytics,
  dailyOrdersTrend,
  formatOrderDate,
  monthlyRevenueTrend,
  ordersByStatus,
  statusMeta,
  topSellingProducts,
  type CommerceOrderStatus,
} from './orderData'
import './OrdersPage.css'

const nextStatus: Partial<Record<CommerceOrderStatus, CommerceOrderStatus>> = {
  'New Orders': 'Accepted',
  Accepted: 'Processing',
  Processing: 'Ready to Ship',
  'Ready to Ship': 'Shipped',
  Shipped: 'Delivered',
}

function statusTone(status: string) {
  return statusMeta[status as CommerceOrderStatus]?.tone as 'slate' | 'blue' | 'amber' | 'emerald' | 'rose' | 'violet'
}

function timelineIndex(status: string) {
  if (status === 'Cancelled' || status === 'Returned') return -1
  return FULFILLMENT_STEPS.indexOf(status as CommerceOrderStatus)
}

function reduceOrderStock(order: Order, reduceStock: ReturnType<typeof useProductCatalogStore.getState>['reduceStock']) {
  (order.items ?? []).forEach((item) => {
    if (!item?.productId) return
    reduceStock(item.productId, item.quantity ?? 1, 'Orders Module', 'Order created', order.orderNumber)
  })
}

function restoreOrderStock(order: Order, addStock: ReturnType<typeof useProductCatalogStore.getState>['addStock']) {
  (order.items ?? []).forEach((item) => {
    if (!item?.productId) return
    addStock(item.productId, item.quantity ?? 1, 'Orders Module', `Stock restored after ${order.status.toLowerCase()}`, undefined)
  })
}

export default function OrdersPage() {
  const orders = useCRMStore((state) => state.orders)
  const updateOrderStatus = useCRMStore((state) => state.updateOrderStatus)
  const products = useProductCatalogStore((state) => state.products)
  const reduceStock = useProductCatalogStore((state) => state.reduceStock)
  const addStock = useProductCatalogStore((state) => state.addStock)
  const [activeStatus, setActiveStatus] = useState<CommerceOrderStatus | 'All'>('All')
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState(orders[0]?.id ?? '')

  const selectedOrder = orders.find((order) => order.id === selectedId) ?? orders[0]

  const counts = useMemo(
    () =>
      ORDER_STATUSES.reduce(
        (acc, status) => ({ ...acc, [status]: orders.filter((order) => order.status === status).length }),
        {} as Record<CommerceOrderStatus, number>
      ),
    [orders]
  )

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase()
    return orders.filter((order) => {
      const matchesStatus = activeStatus === 'All' || order.status === activeStatus
      const matchesSearch =
        !query ||
        order.orderNumber.toLowerCase().includes(query) ||
        order.customerName.toLowerCase().includes(query)
      return matchesStatus && matchesSearch
    })
  }, [orders, search, activeStatus])

  const analytics = useMemo(() => calculateOrderAnalytics(orders), [orders])
  const statusChart = useMemo(() => ordersByStatus(orders), [orders])
  const dailyTrend = useMemo(() => dailyOrdersTrend(orders, 10), [orders])
  const monthlyTrend = useMemo(() => monthlyRevenueTrend(orders), [orders])
  const sellingProducts = useMemo(() => topSellingProducts(orders, 5), [orders])

  const handleAdvance = () => {
    if (!selectedOrder) return
    const target = nextStatus[selectedOrder.status as CommerceOrderStatus]
    if (!target) return
    if (selectedOrder.status === 'New Orders') {
      reduceOrderStock(selectedOrder, reduceStock)
    }
    updateOrderStatus(selectedOrder.id, target)
  }

  const handleCancel = () => {
    if (!selectedOrder || selectedOrder.status === 'Cancelled') return
    if (selectedOrder.status !== 'New Orders' && selectedOrder.status !== 'Returned') {
      restoreOrderStock(selectedOrder, addStock)
    }
    updateOrderStatus(selectedOrder.id, 'Cancelled')
  }

  return (
    <div className="orders-page">
      <PageHeader
        eyebrow="Commerce Operations"
        title="Order Management"
        subtitle="Manage ecommerce orders, fulfillment status, customers, products, inventory, and revenue."
      />

      <div className="orders-kpi-grid">
        <Card><CardContent><span>Total Orders</span><strong>{formatNumber(analytics.totalOrders)}</strong></CardContent></Card>
        <Card><CardContent><span>Pending Orders</span><strong>{formatNumber(analytics.pendingOrders)}</strong></CardContent></Card>
        <Card><CardContent><span>Delivered</span><strong>{formatNumber(analytics.deliveredOrders)}</strong></CardContent></Card>
        <Card><CardContent><span>Cancelled</span><strong>{formatNumber(analytics.cancelledOrders)}</strong></CardContent></Card>
        <Card><CardContent><span>Today's Revenue</span><strong>{formatINR(analytics.todayRevenue, { compact: true })}</strong></CardContent></Card>
        <Card><CardContent><span>Avg Order Value</span><strong>{formatINR(analytics.averageOrderValue, { compact: true })}</strong></CardContent></Card>
      </div>

      <div className="orders-status-tabs">
        <button className={clsx(activeStatus === 'All' && 'active')} onClick={() => setActiveStatus('All')}>
          <span>All Orders</span><b>{orders.length}</b>
        </button>
        {ORDER_STATUSES.map((status) => (
          <button key={status} className={clsx(activeStatus === status && 'active')} onClick={() => setActiveStatus(status)}>
            <span>{status}</span><b>{counts[status]}</b>
          </button>
        ))}
      </div>

      <div className="orders-sheet-panel">
        <div className="orders-sheet-toolbar">
          <div className="orders-search">
            <Search className="h-4 w-4" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search Order ID or customer" />
          </div>
          <div className="orders-sheet-count">
            <strong>{formatNumber(filteredOrders.length)}</strong> rows
          </div>
        </div>

        <div className="orders-sheet-wrap">
          <table className="orders-sheet-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer Name</th>
                <th>Order Date & Time</th>
                <th>Total Items</th>
                <th>Total Amount</th>
                <th>Payment</th>
                <th>Delivery Type</th>
                <th>Expected Delivery</th>
                <th>Order Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className={clsx(selectedOrder?.id === order.id && 'active')}
                  onClick={() => setSelectedId(order.id)}
                >
                  <td className="orders-sheet-id">{order.orderNumber}</td>
                  <td>{order.customerName}</td>
                  <td>{formatOrderDate(order.createdAt)}</td>
                  <td>{order.totalItems}</td>
                  <td className="orders-sheet-money">{formatINR(order.totalAmount)}</td>
                  <td>{order.paymentStatus}</td>
                  <td>{order.deliveryType}</td>
                  <td>{formatOrderDate(order.expectedDeliveryDate)}</td>
                  <td><Badge tone={statusTone(order.status)}>{order.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <div className="orders-sheet-empty">No orders match this filter.</div>
          )}
        </div>
      </div>

      <div className="orders-layout">

        {selectedOrder && (
          <section className="orders-detail-panel">
            <div className="orders-detail-header">
              <div>
                <span>Order Details</span>
                <h2>{selectedOrder.orderNumber}</h2>
              </div>
              <div className="orders-actions">
                {nextStatus[selectedOrder.status as CommerceOrderStatus] && (
                  <button type="button" className="orders-primary-action" onClick={handleAdvance}>
                    <PackageCheck className="h-4 w-4" />
                    Move to {nextStatus[selectedOrder.status as CommerceOrderStatus]}
                  </button>
                )}
                <button type="button" className="orders-danger-action" onClick={handleCancel}>
                  <XCircle className="h-4 w-4" />
                  Cancel
                </button>
              </div>
            </div>

            <div className="orders-info-grid">
              <Card>
                <CardHeader><CardTitle>Customer Information</CardTitle></CardHeader>
                <CardContent className="orders-info-list">
                  <p><User className="h-4 w-4" />{selectedOrder.customer.name}</p>
                  <p><Phone className="h-4 w-4" />{selectedOrder.customer.mobile}</p>
                  <p><Mail className="h-4 w-4" />{selectedOrder.customer.email}</p>
                  <p><MapPin className="h-4 w-4" />{selectedOrder.customer.address}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Order Information</CardTitle></CardHeader>
                <CardContent className="orders-info-list two-col">
                  <p><CalendarDays className="h-4 w-4" /><span>Order Date</span><b>{formatOrderDate(selectedOrder.createdAt)}</b></p>
                  <p><CreditCard className="h-4 w-4" /><span>Payment</span><b>{selectedOrder.paymentMethod}</b></p>
                  <p><CheckCircle2 className="h-4 w-4" /><span>Payment Status</span><b>{selectedOrder.paymentStatus}</b></p>
                  <p><Truck className="h-4 w-4" /><span>Delivery</span><b>{selectedOrder.deliveryType}</b></p>
                  <p><CalendarDays className="h-4 w-4" /><span>Expected</span><b>{formatOrderDate(selectedOrder.expectedDeliveryDate)}</b></p>
                  <p><PackageCheck className="h-4 w-4" /><span>Status</span><Badge tone={statusTone(selectedOrder.status)}>{selectedOrder.status}</Badge></p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader><CardTitle>Order Timeline</CardTitle></CardHeader>
              <CardContent>
                <div className="orders-timeline">
                  {FULFILLMENT_STEPS.map((step, index) => {
                    const complete = timelineIndex(selectedOrder.status) >= index
                    return (
                      <div key={step} className={clsx('orders-timeline-step', complete && 'complete')}>
                        <span><CheckCircle2 className="h-4 w-4" /></span>
                        <p>{step === 'New Orders' ? 'Order Placed' : step}</p>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <div className="orders-products-summary">
              <Card>
                <CardHeader><CardTitle>Products</CardTitle></CardHeader>
                <CardContent>
                  <div className="orders-table-wrap">
                    <table className="orders-products-table">
                      <thead>
                        <tr>
                          <th>Product Image</th><th>Product Name</th><th>SKU</th><th>Qty</th><th>Price</th><th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(selectedOrder.items ?? []).map((item, i) => {
                          if (!item?.productId) return null
                          return (
                          <tr key={`${selectedOrder.id}-${item.productId}-${i}`}>
                            <td><img src={item.image} alt="" /></td>
                            <td>{item.productName}</td>
                            <td>{item.sku}</td>
                            <td>{item.quantity}</td>
                            <td>{formatINR(item.unitPrice)}</td>
                            <td>{formatINR(item.lineTotal)}</td>
                          </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
                <CardContent className="orders-summary">
                  <p><span>Subtotal</span><b>{formatINR(selectedOrder.subtotal)}</b></p>
                  <p><span>Tax</span><b>{formatINR(selectedOrder.tax)}</b></p>
                  <p><span>Shipping Charges</span><b>{formatINR(selectedOrder.shipping)}</b></p>
                  <p><span>Discount</span><b>-{formatINR(selectedOrder.discount)}</b></p>
                  <p className="grand"><span>Grand Total</span><b>{formatINR(selectedOrder.totalAmount)}</b></p>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        <aside className="orders-analytics-panel">
          <Card>
            <CardHeader><CardTitle>Orders by Status</CardTitle></CardHeader>
            <CardContent className="orders-chart">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusChart} dataKey="value" nameKey="name" outerRadius={72}>
                    {statusChart.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Daily Orders Trend</CardTitle></CardHeader>
            <CardContent className="orders-chart">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Line dataKey="orders" stroke="#2563eb" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Monthly Revenue</CardTitle></CardHeader>
            <CardContent className="orders-chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTrend}>
                  <XAxis dataKey="month" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <Tooltip formatter={(value: unknown) => formatINR(Number(value))} />
                  <Bar dataKey="revenue" fill="#0f766e" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Top Selling Products</CardTitle></CardHeader>
            <CardContent className="orders-top-products">
              {sellingProducts.map((product) => {
                const stock = products.find((item) => item.id === product.id)?.stockQuantity ?? 0
                return (
                  <div key={product.id}>
                    <span>{product.name}</span>
                    <b>{formatNumber(product.sold)} sold</b>
                    <small>{product.sku} · Stock {stock}</small>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}
