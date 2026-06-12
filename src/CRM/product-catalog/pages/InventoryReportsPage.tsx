import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BarChart3,
  Download,
  Filter,
  Package2,
  Search,
  TriangleAlert,
} from 'lucide-react'
import PageHeader from '../../../components/common/PageHeader'
import { formatCatalogCurrency, formatCatalogDateTime, getAvailableStock, getInventoryValue, isInventoryTracked } from '../data'
import { useProductCatalogStore } from '../store'

type ReportTab = 'Summary' | 'Low Stock' | 'Movement' | 'Out of Stock'
type SortKey = 'name' | 'stock' | 'value' | 'updatedAt' | 'timestamp'
type SummaryRow = {
  id: string
  product: string
  sku: string
  category: string
  brand: string
  type: string
  status: string
  currentStock: number
  reservedStock: number
  availableStock: number
  reorderLevel: number
  value: number
  updatedAt: string
}
type MovementRow = {
  id: string
  product: string
  sku: string
  actionType: string
  quantityChanged: number
  previousQuantity: number
  newQuantity: number
  user: string
  timestamp: string
  notes: string
}

const PAGE_SIZE = 8

function downloadCsv(filename: string, rows: string[][]) {
  const csv = rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export default function InventoryReportsPage() {
  const navigate = useNavigate()
  const products = useProductCatalogStore((state) => state.products)
  const categories = useProductCatalogStore((state) => state.categories)
  const brands = useProductCatalogStore((state) => state.brands)
  const [tab, setTab] = useState<ReportTab>('Summary')
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const summaryRows = useMemo<SummaryRow[]>(() => {
    return products.map((product) => {
      const category = categories.find((item) => item.id === product.categoryId)?.name ?? 'Unassigned'
      const brand = brands.find((item) => item.id === product.brandId)?.name ?? 'Unassigned'
      const tracked = isInventoryTracked(product)
      return {
        id: product.id,
        product: product.name,
        sku: product.sku,
        category,
        brand,
        type: product.productType,
        status: product.status,
        currentStock: tracked ? product.stockQuantity : 0,
        reservedStock: tracked ? product.reservedStock : 0,
        availableStock: tracked ? getAvailableStock(product) : 0,
        reorderLevel: tracked ? product.reorderLevel : 0,
        value: getInventoryValue(product),
        updatedAt: product.updatedAt,
      }
    })
  }, [products, categories, brands])

  const movementRows = useMemo<MovementRow[]>(() => {
    return products.flatMap((product) =>
      product.inventoryHistory.map((entry) => ({
        id: entry.id,
        product: product.name,
        sku: product.sku,
        actionType: entry.actionType,
        quantityChanged: entry.quantityChanged,
        previousQuantity: entry.previousQuantity,
        newQuantity: entry.newQuantity,
        user: entry.user,
        timestamp: entry.timestamp,
        notes: entry.notes,
      }))
    )
  }, [products])

  const lowStockRows = useMemo(() => summaryRows.filter((row) => row.currentStock <= row.reorderLevel && row.currentStock > 0), [summaryRows])
  const outOfStockRows = useMemo(() => summaryRows.filter((row) => row.currentStock <= 0 && row.type === 'Physical'), [summaryRows])

  const visibleRows = useMemo<Array<SummaryRow | MovementRow>>(() => {
    const search = query.trim().toLowerCase()
    const source =
      tab === 'Summary'
        ? summaryRows
        : tab === 'Low Stock'
          ? lowStockRows
          : tab === 'Movement'
            ? movementRows
            : outOfStockRows

    const filtered = source.filter((row) => {
      if (!search) return true
      return Object.values(row).some((value) => String(value).toLowerCase().includes(search))
    })

    const sorted = [...filtered].sort((a, b) => {
      const aValue = (a as Record<string, string | number | undefined>)[sortKey]
      const bValue = (b as Record<string, string | number | undefined>)[sortKey]
      if (typeof aValue === 'number' && typeof bValue === 'number') return bValue - aValue
      return String(aValue ?? '').localeCompare(String(bValue ?? ''))
    })

    return sorted
  }, [tab, query, sortKey, summaryRows, lowStockRows, movementRows, outOfStockRows])

  const totalPages = Math.max(1, Math.ceil(visibleRows.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paginated = visibleRows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const trackedCount = products.filter((product) => isInventoryTracked(product)).length
  const inStockCount = summaryRows.filter((row) => row.currentStock > row.reorderLevel).length
  const lowStockCount = lowStockRows.length
  const outOfStockCount = outOfStockRows.length
  const totalValue = summaryRows.reduce((sum, row) => sum + row.value, 0)

  const toggleSelect = (id: string) => {
    setSelected((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const clearSelection = () => setSelected(new Set())

  const exportRows = (rows = paginated) => {
    if (!rows.length) return
    if (tab === 'Movement') {
      downloadCsv(`inventory-movement-${Date.now()}.csv`, [
        ['Product', 'SKU', 'Action Type', 'Quantity Changed', 'Previous Quantity', 'New Quantity', 'User', 'Date & Time', 'Notes'],
        ...rows.map((row) => {
          const item = row as MovementRow
          return [
            item.product,
            item.sku,
            item.actionType,
            String(item.quantityChanged),
            String(item.previousQuantity),
            String(item.newQuantity),
            item.user,
            formatCatalogDateTime(item.timestamp),
            item.notes,
          ]
        }),
      ])
      return
    }

    downloadCsv(`inventory-report-${Date.now()}.csv`, [
      ['Product', 'SKU', 'Category', 'Brand', 'Type', 'Current Stock', 'Reserved Stock', 'Available Stock', 'Reorder Level', 'Inventory Value', 'Updated'],
      ...rows.map((row) => {
        const item = row as SummaryRow
        return [
          item.product,
          item.sku,
          item.category,
          item.brand,
          item.type,
          String(item.currentStock),
          String(item.reservedStock),
          String(item.availableStock),
          String(item.reorderLevel),
          String(item.value),
          formatCatalogDateTime(item.updatedAt),
        ]
      }),
    ])
  }

  const tabs: ReportTab[] = ['Summary', 'Low Stock', 'Movement', 'Out of Stock']

  const renderTableRow = (row: SummaryRow | MovementRow) => {
    const item = row
    return (
      <tr key={item.id}>
        <td className="row-num !text-center">
          <input
            type="checkbox"
            className="accent-brand-blue"
            checked={selected.has(item.id)}
            onChange={() => toggleSelect(item.id)}
          />
        </td>
        <td className="font-semibold text-theme-primary">{item.product}</td>
        {tab !== 'Movement' && <td>{(item as SummaryRow).category}</td>}
        {tab !== 'Movement' && <td>{(item as SummaryRow).brand}</td>}
        {tab === 'Summary' && <td className="tabular-nums">{(item as SummaryRow).currentStock}</td>}
        {tab === 'Summary' && <td className="tabular-nums">{(item as SummaryRow).availableStock}</td>}
        {tab === 'Summary' && <td className="tabular-nums">{(item as SummaryRow).reorderLevel}</td>}
        {tab === 'Summary' && <td>{formatCatalogCurrency((item as SummaryRow).value, 'INR')}</td>}
        {tab === 'Movement' && <td className="font-semibold">{(item as MovementRow).actionType}</td>}
        {tab === 'Movement' && <td className="tabular-nums">{(item as MovementRow).quantityChanged}</td>}
        {tab === 'Movement' && <td className="tabular-nums">{(item as MovementRow).previousQuantity}</td>}
        {tab === 'Movement' && <td className="tabular-nums">{(item as MovementRow).newQuantity}</td>}
        {tab === 'Movement' && <td>{(item as MovementRow).user}</td>}
        {tab === 'Movement' && <td>{formatCatalogDateTime((item as MovementRow).timestamp)}</td>}
        {tab === 'Movement' && <td className="max-w-[320px] whitespace-normal">{(item as MovementRow).notes}</td>}
        {(tab === 'Low Stock' || tab === 'Out of Stock') && <td className="tabular-nums">{(item as SummaryRow).currentStock}</td>}
        {(tab === 'Low Stock' || tab === 'Out of Stock') && <td>{formatCatalogCurrency((item as SummaryRow).value, 'INR')}</td>}
        {tab !== 'Movement' && <td>{(item as SummaryRow).status}</td>}
      </tr>
    )
  }

  return (
    <div className="grid gap-5">
      <PageHeader
        eyebrow="Inventory Reports"
        title="Inventory Tracking"
        subtitle="Review stock levels, movement history, and out-of-stock items across the product catalog."
        actions={
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-ghost" onClick={() => navigate('/products')}>
              Back to Products
            </button>
            <button type="button" className="btn-primary" onClick={() => exportRows()}>
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        }
      />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <div className="card-soft p-4">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Total Products</div>
          <div className="mt-2 text-[28px] font-bold text-theme-primary">{products.length}</div>
        </div>
        <div className="card-soft p-4">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">In Stock Products</div>
          <div className="mt-2 text-[28px] font-bold text-emerald-600">{inStockCount}</div>
        </div>
        <div className="card-soft p-4">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Low Stock Products</div>
          <div className="mt-2 text-[28px] font-bold text-amber-600">{lowStockCount}</div>
        </div>
        <div className="card-soft p-4">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Out Of Stock</div>
          <div className="mt-2 text-[28px] font-bold text-rose-600">{outOfStockCount}</div>
        </div>
        <div className="card-soft p-4">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Inventory Value</div>
          <div className="mt-2 text-[28px] font-bold text-theme-primary">{formatCatalogCurrency(totalValue, 'INR')}</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 rounded-2xl border border-theme bg-white p-2 shadow-sm">
        {tabs.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => {
              setTab(item)
              setPage(1)
              clearSelection()
            }}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
              tab === item
                ? 'bg-brand-blue text-white shadow-sm'
                : 'text-theme-secondary hover:bg-theme-surface hover:text-theme-primary'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            {item}
          </button>
        ))}
      </div>

      <div className="card p-4">
        <div className="grid gap-3 xl:grid-cols-[1.4fr_1fr_1fr]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-theme-muted" />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setPage(1)
                clearSelection()
              }}
              className="input pl-9"
              placeholder="Search product, SKU, user, or notes..."
            />
          </label>
          <select className="input" value={sortKey} onChange={(event) => setSortKey(event.target.value as SortKey)}>
            <option value="name">Sort by Name</option>
            <option value="stock">Sort by Stock</option>
            <option value="value">Sort by Value</option>
            <option value="updatedAt">Sort by Updated</option>
            <option value="timestamp">Sort by Date</option>
          </select>
          <button type="button" className="btn-ghost justify-center" onClick={() => exportRows()}>
            <Download className="h-4 w-4" />
            Export current view
          </button>
        </div>
      </div>

      {selected.size > 0 && (
        <div className="card flex flex-wrap items-center justify-between gap-3 p-4">
          <div className="text-sm font-semibold text-theme-primary">{selected.size} selected</div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-ghost" onClick={() => exportRows(paginated.filter((row) => selected.has(row.id)))}>
              <Download className="h-4 w-4" />
              Export Selected
            </button>
            <button type="button" className="btn-ghost" onClick={clearSelection}>
              Clear
            </button>
          </div>
        </div>
      )}

      <section className="card p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-theme-secondary">{tab} Report</div>
            <h3 className="mt-1 text-[18px] font-bold text-theme-primary">Inventory data set</h3>
          </div>
          <div className="flex items-center gap-2 text-xs text-theme-secondary">
            <Filter className="h-4 w-4" />
            Search, filters, sorting, pagination
          </div>
        </div>

        {paginated.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-theme bg-theme-surface p-8 text-center text-sm text-theme-secondary">
            No rows match the current report view.
          </div>
        ) : (
          <>
            <div className="overflow-auto rounded-2xl border border-theme">
              <table className="sheet min-w-[1100px]">
                <thead>
                  <tr>
                    <th className="row-num !text-center">
                      <input
                        type="checkbox"
                        className="accent-brand-blue"
                        checked={selected.size > 0 && paginated.every((row) => selected.has(row.id))}
                        onChange={() => {
                          const allSelected = paginated.every((row) => selected.has(row.id))
                          setSelected((current) => {
                            const next = new Set(current)
                            paginated.forEach((row) => {
                              if (allSelected) next.delete(row.id)
                              else next.add(row.id)
                            })
                            return next
                          })
                        }}
                      />
                    </th>
                    <th>Product</th>
                    {tab !== 'Movement' && <th>Category</th>}
                    {tab !== 'Movement' && <th>Brand</th>}
                    {tab === 'Summary' && <th>Current Stock</th>}
                    {tab === 'Summary' && <th>Available</th>}
                    {tab === 'Summary' && <th>Reorder</th>}
                    {tab === 'Summary' && <th>Value</th>}
                    {tab === 'Movement' && <th>Action Type</th>}
                    {tab === 'Movement' && <th>Qty Changed</th>}
                    {tab === 'Movement' && <th>Previous</th>}
                    {tab === 'Movement' && <th>New</th>}
                    {tab === 'Movement' && <th>User</th>}
                    {tab === 'Movement' && <th>Date &amp; Time</th>}
                    {tab === 'Movement' && <th>Notes</th>}
                    {(tab === 'Low Stock' || tab === 'Out of Stock') && <th>Stock</th>}
                    {(tab === 'Low Stock' || tab === 'Out of Stock') && <th>Value</th>}
                    {tab !== 'Movement' && <th>Status</th>}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map(renderTableRow)}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-3 rounded-2xl border border-theme bg-white px-4 py-4 shadow-sm md:flex-row md:items-center md:justify-between">
              <div className="text-sm text-theme-secondary">
                Showing <span className="font-semibold text-theme-primary">{paginated.length}</span> of{' '}
                <span className="font-semibold text-theme-primary">{visibleRows.length}</span> records
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={safePage === 1}
                >
                  Previous
                </button>
                <div className="inline-flex items-center rounded-xl border border-theme bg-theme-surface px-3 py-2 text-sm font-semibold text-theme-primary">
                  Page {safePage} of {totalPages}
                </div>
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                  disabled={safePage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="card-soft flex items-center gap-4 p-4">
          <div className="icon-tile bg-blue-50 text-brand-blue">
            <Package2 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Tracked Products</div>
            <div className="text-[24px] font-bold">{trackedCount}</div>
          </div>
        </div>
        <div className="card-soft flex items-center gap-4 p-4">
          <div className="icon-tile bg-amber-50 text-amber-600">
            <TriangleAlert className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Low Stock Report</div>
            <div className="text-[24px] font-bold">{lowStockCount}</div>
          </div>
        </div>
        <div className="card-soft flex items-center gap-4 p-4">
          <div className="icon-tile bg-rose-50 text-rose-600">
            <TriangleAlert className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Out Of Stock Report</div>
            <div className="text-[24px] font-bold">{outOfStockCount}</div>
          </div>
        </div>
        <div className="card-soft flex items-center gap-4 p-4">
          <div className="icon-tile bg-theme-surface text-theme-secondary">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Movement Entries</div>
            <div className="text-[24px] font-bold">{movementRows.length}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
