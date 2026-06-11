import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import {
  Archive,
  ArrowLeft,
  BadgeAlert,
  Barcode,
  Box,
  CalendarClock,
  Edit3,
  History,
  Layers,
  Minus,
  PackageSearch,
  Plus,
  SlidersHorizontal,
  Tag,
} from 'lucide-react'
import PageHeader from '../../Components/PageHeader'
import CatalogEmptyState from '../components/CatalogEmptyState'
import CatalogStatusBadge, { stockTone } from '../components/CatalogStatusBadge'
import {
  formatCatalogCurrency,
  formatCatalogDateTime,
  getAvailableStock,
  getInventoryValue,
  isInventoryTracked,
  stockLabel,
} from '../data'
import { useProductCatalogStore } from '../store'

type DetailsTab = 'overview' | 'inventory' | 'activity'

function DetailRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-theme py-3 last:border-b-0">
      <span className="text-sm font-medium text-theme-secondary">{label}</span>
      <span className="text-right text-sm font-bold text-theme-primary">{value}</span>
    </div>
  )
}

function MetricTile({
  label,
  value,
  tone = 'default',
}: {
  label: string
  value: string | number
  tone?: 'default' | 'accent' | 'warn'
}) {
  const surfaceStyle =
    tone === 'accent'
      ? {
          background: 'color-mix(in srgb, var(--primary) 14%, var(--card-bg))',
          borderColor: 'color-mix(in srgb, var(--primary) 32%, transparent)',
        }
      : tone === 'warn'
        ? {
            background: 'color-mix(in srgb, #d97706 16%, var(--card-bg))',
            borderColor: 'color-mix(in srgb, #d97706 35%, transparent)',
          }
        : {
            background: 'var(--surface-soft)',
            borderColor: 'var(--card-border)',
          }

  return (
    <div className="rounded-xl border px-3 py-3" style={surfaceStyle}>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-theme-secondary">{label}</div>
      <div className="mt-1 text-lg font-bold tabular-nums tracking-tight text-theme-primary">{value}</div>
    </div>
  )
}

function StockLevelBar({ current, reorder }: { current: number; reorder: number }) {
  const cap = Math.max(current, reorder * 2, 1)
  const fill = Math.min(100, Math.round((current / cap) * 100))
  const marker = Math.min(100, Math.round((reorder / cap) * 100))

  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center justify-between text-xs text-theme-secondary">
        <span>Stock level</span>
        <span>
          {current} units · reorder at {reorder}
        </span>
      </div>
      <div className="relative h-2.5 overflow-hidden rounded-full bg-theme-surface">
        <div
          className={`absolute inset-y-0 left-0 rounded-full transition-all ${
            current <= 0 ? 'bg-rose-500' : current <= reorder ? 'bg-amber-500' : 'bg-emerald-500'
          }`}
          style={{ width: `${fill}%` }}
        />
        {reorder > 0 && (
          <div
            className="absolute inset-y-0 w-0.5 bg-slate-400/80"
            style={{ left: `${marker}%` }}
            title={`Reorder level: ${reorder}`}
          />
        )}
      </div>
    </div>
  )
}

export default function ProductDetailsPage() {
  const navigate = useNavigate()
  const { productId } = useParams()
  const product = useProductCatalogStore((state) => state.products.find((item) => item.id === productId))
  const categories = useProductCatalogStore((state) => state.categories)
  const brands = useProductCatalogStore((state) => state.brands)
  const currentRole = useProductCatalogStore((state) => state.currentRole)
  const archiveProducts = useProductCatalogStore((state) => state.archiveProducts)
  const addStock = useProductCatalogStore((state) => state.addStock)
  const reduceStock = useProductCatalogStore((state) => state.reduceStock)
  const adjustStock = useProductCatalogStore((state) => state.adjustStock)

  const [activeTab, setActiveTab] = useState<DetailsTab>('overview')
  const [addQuantity, setAddQuantity] = useState(0)
  const [addSupplier, setAddSupplier] = useState('Zen Supply Co.')
  const [addPurchaseCost, setAddPurchaseCost] = useState(0)
  const [addReceivedAt, setAddReceivedAt] = useState(new Date().toISOString().slice(0, 10))
  const [addNotes, setAddNotes] = useState('Received stock from supplier.')

  const [reduceQuantity, setReduceQuantity] = useState(0)
  const [reduceReason, setReduceReason] = useState<'Sale' | 'Damage' | 'Return' | 'Adjustment'>('Sale')
  const [reduceNotes, setReduceNotes] = useState('Reduced after order fulfillment.')

  const [adjustQuantity, setAdjustQuantity] = useState(0)
  const [adjustNotes, setAdjustNotes] = useState('Stock count corrected after audit.')

  const productCategory = useMemo(() => categories.find((item) => item.id === product?.categoryId), [categories, product])
  const productBrand = useMemo(() => brands.find((item) => item.id === product?.brandId), [brands, product])

  const canManageInventory = currentRole !== 'Sales User'
  const canEditProduct = currentRole === 'Admin'

  if (!product) {
    return (
      <CatalogEmptyState
        icon={PackageSearch}
        title="Product not found"
        description="This product record may have been removed or is no longer available in the catalog."
        action={
          <Link to="/products" className="btn-primary">
            Back to Product List
          </Link>
        }
      />
    )
  }

  const tracked = isInventoryTracked(product)
  const availableStock = getAvailableStock(product)
  const inventoryValue = getInventoryValue(product)
  const lowStock = tracked && product.stockQuantity <= product.reorderLevel
  const outOfStock = tracked && product.stockQuantity <= 0
  const margin = product.price > 0 ? Math.max(0, Math.round(((product.price - product.costPrice) / product.price) * 100)) : 0
  const salePrice = formatCatalogCurrency(product.salePrice || product.price, product.currency)
  const basePrice = formatCatalogCurrency(product.price, product.currency)

  const tabs: { id: DetailsTab; label: string; icon: LucideIcon }[] = [
    { id: 'overview', label: 'Overview', icon: Tag },
    { id: 'inventory', label: 'Inventory', icon: SlidersHorizontal },
    { id: 'activity', label: 'Activity', icon: History },
  ]

  const handleAddStock = () => {
    if (!canManageInventory || !tracked || addQuantity <= 0) return
    addStock(product.id, addQuantity, 'Inventory Manager', addNotes, addSupplier, addPurchaseCost, addReceivedAt)
    setAddQuantity(0)
    setAddPurchaseCost(0)
    setAddNotes('Received stock from supplier.')
  }

  const handleReduceStock = () => {
    if (!canManageInventory || !tracked || reduceQuantity <= 0) return
    reduceStock(product.id, reduceQuantity, 'Inventory Manager', reduceReason, reduceNotes)
    setReduceQuantity(0)
    setReduceNotes('Reduced after order fulfillment.')
  }

  const handleAdjustStock = () => {
    if (!canManageInventory || !tracked || adjustQuantity < 0) return
    adjustStock(product.id, adjustQuantity, 'Inventory Manager', adjustNotes)
    setAdjustNotes('Stock count corrected after audit.')
  }

  return (
    <div className="grid gap-6">
      <PageHeader
        eyebrow="Catalog Record"
        title={product.name}
        subtitle={`${product.sku} · ${productCategory?.name ?? 'Uncategorized'} · ${productBrand?.name ?? 'No brand'}`}
        actions={
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-ghost" onClick={() => navigate('/products')}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            {canEditProduct && (
              <>
                <button type="button" className="btn-ghost" onClick={() => navigate(`/products/new?productId=${product.id}`)}>
                  <Edit3 className="h-4 w-4" />
                  Edit
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    archiveProducts([product.id])
                    navigate('/products')
                  }}
                >
                  <Archive className="h-4 w-4" />
                  Archive
                </button>
              </>
            )}
          </div>
        }
      />

      <div className="border-b border-theme">
        <nav className="-mb-px flex flex-wrap gap-1" aria-label="Product sections">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
                  active
                    ? 'border-brand-blue text-brand-blue'
                    : 'border-transparent text-theme-secondary hover:border-theme hover:text-theme-primary'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {activeTab === 'overview' && (
        <div className="grid gap-6">
          <section className="card overflow-hidden">
            <div className="grid lg:grid-cols-[minmax(240px,300px)_minmax(0,1fr)]">
              <div className="relative aspect-square bg-theme-surface lg:aspect-auto lg:min-h-[280px]">
                <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
              </div>

              <div className="flex flex-col gap-5 p-5 lg:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <CatalogStatusBadge status={product.status} />
                      <span className="chip">{product.productType}</span>
                      {product.featured && <span className="chip">Featured</span>}
                      {tracked && (
                        <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${stockTone(product)}`}>
                          {stockLabel(product)}
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-theme-primary">{product.name}</h2>
                    <p className="max-w-2xl text-sm leading-6 text-theme-secondary">{product.description}</p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div
                    className="rounded-xl border p-4"
                    style={{
                      background: 'color-mix(in srgb, var(--primary) 12%, var(--card-bg))',
                      borderColor: 'color-mix(in srgb, var(--primary) 28%, transparent)',
                    }}
                  >
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-theme-secondary">Sale price</div>
                    <div className="mt-1 text-2xl font-bold text-theme-primary">{salePrice}</div>
                    <div className="mt-1 text-xs text-theme-secondary">Customer-facing price</div>
                  </div>
                  <div className="rounded-xl border border-theme bg-theme-surface p-4">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-theme-secondary">Base price</div>
                    <div className="mt-1 text-xl font-bold text-theme-primary">{basePrice}</div>
                    <div className="mt-1 text-xs text-theme-secondary">List price</div>
                  </div>
                  <div className="rounded-xl border border-theme bg-theme-surface p-4">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-theme-secondary">Gross margin</div>
                    <div className="mt-1 text-xl font-bold text-emerald-600 dark:text-emerald-400">{margin}%</div>
                    <div className="mt-1 text-xs text-theme-secondary">From cost price</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="chip">{productCategory?.name ?? 'Unassigned category'}</span>
                  <span className="chip">{productBrand?.name ?? 'Unassigned brand'}</span>
                  {product.tags.map((tag) => (
                    <span key={tag} className="chip">
                      <Tag className="h-3.5 w-3.5" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="card p-5 lg:p-6">
              <div className="mb-1 flex items-center gap-2 text-brand-blue">
                <Barcode className="h-4 w-4" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-theme-primary">Product identifiers</h3>
              </div>
              <div className="mt-3">
                <DetailRow label="SKU" value={product.sku} />
                <DetailRow label="Product code" value={product.productCode} />
                <DetailRow label="Barcode" value={product.barcode || 'Not set'} />
                <DetailRow label="Visibility" value={product.visibility} />
                <DetailRow label="Last updated" value={formatCatalogDateTime(product.updatedAt)} />
              </div>
            </section>

            <section className="card p-5 lg:p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 text-brand-blue">
                  <Box className="h-4 w-4" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-theme-primary">Inventory</h3>
                </div>
                {tracked && (
                  <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${stockTone(product)}`}>
                    {stockLabel(product)}
                  </span>
                )}
              </div>

              {!tracked ? (
                <p className="mt-4 text-sm leading-6 text-theme-secondary">
                  Inventory is not tracked for this product type. Stock movements and reorder alerts do not apply.
                </p>
              ) : (
                <>
                  {outOfStock && (
                    <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-900 dark:border-rose-900/40 dark:bg-rose-950/25 dark:text-rose-100">
                      <div className="flex items-center gap-2 font-semibold">
                        <BadgeAlert className="h-4 w-4 shrink-0" />
                        Out of stock — replenish before selling again.
                      </div>
                    </div>
                  )}
                  {lowStock && !outOfStock && (
                    <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/25 dark:text-amber-100">
                      <div className="flex items-center gap-2 font-semibold">
                        <BadgeAlert className="h-4 w-4 shrink-0" />
                        At or below reorder level.
                      </div>
                    </div>
                  )}

                  <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    <MetricTile label="On hand" value={product.stockQuantity} tone="accent" />
                    <MetricTile label="Available" value={availableStock} />
                    <MetricTile label="Reserved" value={product.reservedStock} />
                    <MetricTile label="Reorder at" value={product.reorderLevel} tone={lowStock ? 'warn' : 'default'} />
                    <MetricTile
                      label="Value"
                      value={formatCatalogCurrency(inventoryValue, product.currency)}
                    />
                    <MetricTile label="Tracked" value="Yes" />
                  </div>

                  <StockLevelBar current={product.stockQuantity} reorder={product.reorderLevel} />

                  <button
                    type="button"
                    className="btn-ghost mt-4 w-full justify-center sm:w-auto"
                    onClick={() => setActiveTab('inventory')}
                  >
                    <Layers className="h-4 w-4" />
                    Manage stock
                  </button>
                </>
              )}
            </section>
          </div>
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="grid gap-6">
          {tracked && (
            <section className="card p-5">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                <MetricTile label="On hand" value={product.stockQuantity} tone="accent" />
                <MetricTile label="Available" value={availableStock} />
                <MetricTile label="Reserved" value={product.reservedStock} />
                <MetricTile label="Reorder at" value={product.reorderLevel} tone={lowStock ? 'warn' : 'default'} />
                <MetricTile label="Value" value={formatCatalogCurrency(inventoryValue, product.currency)} />
                <MetricTile label="Tracked" value="Yes" />
              </div>
              <StockLevelBar current={product.stockQuantity} reorder={product.reorderLevel} />
            </section>
          )}

          {!tracked ? (
            <div className="card p-6">
              <div className="rounded-xl border border-theme bg-theme-surface p-5 text-sm text-theme-secondary">
                Service products do not require inventory tracking, stock deduction, or reorder management.
              </div>
            </div>
          ) : (
            <>
              {lowStock && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/25 dark:text-amber-100">
                  <div className="flex items-start gap-3">
                    <BadgeAlert className="mt-0.5 h-5 w-5 shrink-0" />
                    <div>
                      <div className="font-bold">Low stock alert</div>
                      <div className="text-sm text-amber-800 dark:text-amber-200">
                        Current stock is at or below the reorder level and will show up in the low stock report.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid gap-5 xl:grid-cols-3">
                <section className="card p-5">
                  <div className="mb-4">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-theme-secondary">Add Stock</div>
                    <h3 className="mt-1 text-lg font-bold text-theme-primary">Record incoming stock</h3>
                  </div>
                  <div className="grid gap-3">
                    <label className="grid gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Quantity Received</span>
                      <input className="input" type="number" min="0" value={addQuantity} onChange={(event) => setAddQuantity(Number(event.target.value))} disabled={!canManageInventory} />
                    </label>
                    <label className="grid gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Supplier</span>
                      <input className="input" value={addSupplier} onChange={(event) => setAddSupplier(event.target.value)} disabled={!canManageInventory} />
                    </label>
                    <label className="grid gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Purchase Cost</span>
                      <input className="input" type="number" min="0" value={addPurchaseCost} onChange={(event) => setAddPurchaseCost(Number(event.target.value))} disabled={!canManageInventory} />
                    </label>
                    <label className="grid gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Date Received</span>
                      <input className="input" type="date" value={addReceivedAt} onChange={(event) => setAddReceivedAt(event.target.value)} disabled={!canManageInventory} />
                    </label>
                    <label className="grid gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Notes</span>
                      <textarea className="input min-h-24 resize-y" value={addNotes} onChange={(event) => setAddNotes(event.target.value)} disabled={!canManageInventory} />
                    </label>
                    <button type="button" className="btn-primary justify-center" onClick={handleAddStock} disabled={!canManageInventory}>
                      <Plus className="h-4 w-4" />
                      Add Stock
                    </button>
                  </div>
                </section>

                <section className="card p-5">
                  <div className="mb-4">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-theme-secondary">Reduce Stock</div>
                    <h3 className="mt-1 text-lg font-bold text-theme-primary">Record stock out</h3>
                  </div>
                  <div className="grid gap-3">
                    <label className="grid gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Quantity</span>
                      <input className="input" type="number" min="0" value={reduceQuantity} onChange={(event) => setReduceQuantity(Number(event.target.value))} disabled={!canManageInventory} />
                    </label>
                    <label className="grid gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Reason</span>
                      <select className="input" value={reduceReason} onChange={(event) => setReduceReason(event.target.value as typeof reduceReason)} disabled={!canManageInventory}>
                        <option value="Sale">Sale</option>
                        <option value="Damage">Damage</option>
                        <option value="Return">Return</option>
                        <option value="Adjustment">Adjustment</option>
                      </select>
                    </label>
                    <label className="grid gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Notes</span>
                      <textarea className="input min-h-24 resize-y" value={reduceNotes} onChange={(event) => setReduceNotes(event.target.value)} disabled={!canManageInventory} />
                    </label>
                    <button type="button" className="btn-primary justify-center" onClick={handleReduceStock} disabled={!canManageInventory}>
                      <Minus className="h-4 w-4" />
                      Reduce Stock
                    </button>
                  </div>
                </section>

                <section className="card p-5">
                  <div className="mb-4">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-theme-secondary">Adjust Stock</div>
                    <h3 className="mt-1 text-lg font-bold text-theme-primary">Correct inventory count</h3>
                  </div>
                  {!canManageInventory && (
                    <div className="mb-3 rounded-xl border border-theme bg-theme-surface px-4 py-3 text-sm text-theme-secondary">
                      View-only access for Sales users.
                    </div>
                  )}
                  <div className="grid gap-3">
                    <label className="grid gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">New Quantity</span>
                      <input className="input" type="number" min="0" value={adjustQuantity} onChange={(event) => setAdjustQuantity(Number(event.target.value))} disabled={!canManageInventory} />
                    </label>
                    <label className="grid gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Notes</span>
                      <textarea className="input min-h-24 resize-y" value={adjustNotes} onChange={(event) => setAdjustNotes(event.target.value)} disabled={!canManageInventory} />
                    </label>
                    <button type="button" className="btn-primary justify-center" onClick={handleAdjustStock} disabled={!canManageInventory}>
                      <SlidersHorizontal className="h-4 w-4" />
                      Adjust Stock
                    </button>
                  </div>
                </section>
              </div>

              <section className="card p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-theme-secondary">Inventory History</div>
                    <h3 className="mt-1 text-lg font-bold text-theme-primary">Stock movement log</h3>
                  </div>
                  <button type="button" className="btn-ghost">
                    <CalendarClock className="h-4 w-4" />
                    View History
                  </button>
                </div>

                {product.inventoryHistory.length > 0 ? (
                  <div className="overflow-auto rounded-xl border border-theme">
                    <table className="sheet min-w-[900px]">
                      <thead>
                        <tr>
                          <th>Action Type</th>
                          <th>Quantity Changed</th>
                          <th>Previous Quantity</th>
                          <th>New Quantity</th>
                          <th>User</th>
                          <th>Date &amp; Time</th>
                          <th>Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {product.inventoryHistory.map((entry) => (
                          <tr key={entry.id}>
                            <td className="font-semibold text-theme-primary">{entry.actionType}</td>
                            <td className="tabular-nums">{entry.quantityChanged}</td>
                            <td className="tabular-nums">{entry.previousQuantity}</td>
                            <td className="tabular-nums">{entry.newQuantity}</td>
                            <td>{entry.user}</td>
                            <td>{formatCatalogDateTime(entry.timestamp)}</td>
                            <td className="max-w-[320px] whitespace-normal text-theme-secondary">{entry.notes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-theme bg-theme-surface p-8 text-center text-sm text-theme-secondary">
                    No stock movements recorded yet.
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      )}

      {activeTab === 'activity' && (
        <section className="card p-5 lg:p-6">
          <div className="mb-5">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-theme-secondary">Activity Timeline</div>
            <h3 className="mt-1 text-lg font-bold text-theme-primary">Recent catalog changes</h3>
          </div>
          <div className="relative space-y-0 pl-6 before:absolute before:bottom-2 before:left-[7px] before:top-2 before:w-px before:bg-[var(--card-border)]">
            {product.activity.map((entry) => (
              <div key={entry.id} className="relative pb-6 last:pb-0">
                <span
                  className={`absolute -left-6 top-1.5 h-3.5 w-3.5 rounded-full ring-4 ring-[var(--card-bg)] ${
                    entry.tone === 'success'
                      ? 'bg-emerald-500'
                      : entry.tone === 'warning'
                        ? 'bg-amber-500'
                        : 'bg-brand-blue'
                  }`}
                />
                <div className="rounded-xl border border-theme bg-theme-surface p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-sm font-bold text-theme-primary">{entry.title}</div>
                    <div className="text-xs text-theme-secondary">{formatCatalogDateTime(entry.timestamp)}</div>
                  </div>
                  <p className="mt-1.5 text-sm leading-6 text-theme-secondary">{entry.note}</p>
                  <div className="mt-2 text-xs font-medium text-theme-secondary">{entry.actor}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
