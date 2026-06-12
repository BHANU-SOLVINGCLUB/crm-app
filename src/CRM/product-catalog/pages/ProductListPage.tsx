import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Archive, Download, Filter, Plus, RotateCcw, Search, Shield, Trash2 } from 'lucide-react'
import PageHeader from '../../Components/PageHeader'
import CatalogEmptyState from '../components/CatalogEmptyState'
import ProductTable from '../components/ProductTable'
import { stockLabel } from '../data'
import { useProductCatalogStore } from '../store'
import { pushAppToast } from '../../../store/uiStore'

type StockFilter = 'All' | 'In stock' | 'Low stock' | 'Out of stock' | 'Not tracked'
type StatusFilter = 'All' | 'Active' | 'Draft' | 'Archived'

const PAGE_SIZE = 6

export default function ProductListPage() {
  const navigate = useNavigate()
  const products = useProductCatalogStore((state) => state.products)
  const categories = useProductCatalogStore((state) => state.categories)
  const brands = useProductCatalogStore((state) => state.brands)
  const currentRole = useProductCatalogStore((state) => state.currentRole)
  const updateProduct = useProductCatalogStore((state) => state.updateProduct)
  const archiveProducts = useProductCatalogStore((state) => state.archiveProducts)
  const setProductStatus = useProductCatalogStore((state) => state.setProductStatus)
  const deleteProducts = useProductCatalogStore((state) => state.deleteProducts)
  const canEdit = currentRole !== 'Sales User'

  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All')
  const [stockFilter, setStockFilter] = useState<StockFilter>('All')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [brandFilter, setBrandFilter] = useState('All')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase()
    return products.filter((product) => {
      if (statusFilter !== 'All' && product.status !== statusFilter) return false
      if (categoryFilter !== 'All' && product.categoryId !== categoryFilter) return false
      if (brandFilter !== 'All' && product.brandId !== brandFilter) return false
      if (stockFilter !== 'All' && stockLabel(product) !== stockFilter) return false
      if (!search) return true

      const category = categories.find((item) => item.id === product.categoryId)?.name ?? ''
      const brand = brands.find((item) => item.id === product.brandId)?.name ?? ''
      const fields = [
        product.name,
        product.sku,
        product.productCode,
        product.barcode,
        category,
        brand,
        product.status,
        product.visibility,
        product.tags.join(' '),
      ]
      return fields.some((field) => field.toLowerCase().includes(search))
    })
  }, [products, query, statusFilter, stockFilter, categoryFilter, brandFilter, categories, brands])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const totals = useMemo(() => {
    const active = products.filter((product) => product.status === 'Active').length
    const draft = products.filter((product) => product.status === 'Draft').length
    const archived = products.filter((product) => product.status === 'Archived').length
    const lowStock = products.filter((product) => stockLabel(product) === 'Low stock').length
    return { active, draft, archived, lowStock, total: products.length }
  }, [products])

  const toggleSelect = (id: string) => {
    setSelected((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    setSelected((current) => {
      const next = new Set(current)
      const allOnPage = paginated.every((product) => next.has(product.id))
      paginated.forEach((product) => {
        if (allOnPage) next.delete(product.id)
        else next.add(product.id)
      })
      return next
    })
  }

  const selectedOnPage = useMemo(() => paginated.filter((product) => selected.has(product.id)), [paginated, selected])
  const clearFilters = () => {
    setQuery('')
    setStatusFilter('All')
    setStockFilter('All')
    setCategoryFilter('All')
    setBrandFilter('All')
    setPage(1)
  }

  const handleBulk = (action: 'archive' | 'active' | 'draft' | 'delete') => {
    const ids = selectedOnPage.map((product) => product.id)
    if (!ids.length) return
    if (action === 'archive') archiveProducts(ids)
    if (action === 'active') setProductStatus(ids, 'Active')
    if (action === 'draft') setProductStatus(ids, 'Draft')
    if (action === 'delete') deleteProducts(ids)
    setSelected((current) => {
      const next = new Set(current)
      ids.forEach((id) => next.delete(id))
      return next
    })
  }

  return (
    <div className="grid gap-5">
      <PageHeader
        eyebrow="Catalog Manager"
        title="Product List"
        subtitle="Search, filter, and manage the full e-commerce catalog from one workspace."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" className="btn-ghost" onClick={clearFilters}>
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
            <button type="button" className="btn-primary" onClick={() => navigate('/products/new')}>
              <Plus className="h-4 w-4" />
              Add Product
            </button>
          </div>
        }
      />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <div className="card-soft p-4">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Total Products</div>
          <div className="mt-2 text-[28px] font-bold text-theme-primary">{totals.total}</div>
        </div>
        <div className="card-soft p-4">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Active</div>
          <div className="mt-2 text-[28px] font-bold text-emerald-600">{totals.active}</div>
        </div>
        <div className="card-soft p-4">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Draft</div>
          <div className="mt-2 text-[28px] font-bold text-amber-600">{totals.draft}</div>
        </div>
        <div className="card-soft p-4">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Low Stock</div>
          <div className="mt-2 text-[28px] font-bold text-rose-600">{totals.lowStock}</div>
        </div>
        <div className="card-soft p-4">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Archived</div>
          <div className="mt-2 text-[28px] font-bold text-theme-secondary">{totals.archived}</div>
        </div>
      </div>

      <div className="card p-4">
        <div className="grid gap-3 xl:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
          <label className="relative xl:col-span-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-theme-muted" />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setPage(1)
              }}
              className="input pl-9"
              placeholder="Search products, SKU, brand..."
            />
          </label>
          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value as StatusFilter)
              setPage(1)
            }}
            className="input"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
            <option value="Archived">Archived</option>
          </select>
          <select
            value={stockFilter}
            onChange={(event) => {
              setStockFilter(event.target.value as StockFilter)
              setPage(1)
            }}
            className="input"
          >
            <option value="All">All Stock Levels</option>
            <option value="In stock">In stock</option>
            <option value="Low stock">Low stock</option>
            <option value="Out of stock">Out of stock</option>
            <option value="Not tracked">Not tracked</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(event) => {
              setCategoryFilter(event.target.value)
              setPage(1)
            }}
            className="input"
          >
            <option value="All">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            value={brandFilter}
            onChange={(event) => {
              setBrandFilter(event.target.value)
              setPage(1)
            }}
            className="input"
          >
            <option value="All">All Brands</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {canEdit && selectedOnPage.length > 0 && (
        <div className="card flex flex-wrap items-center justify-between gap-3 p-4">
          <div className="text-sm font-semibold text-theme-primary">{selectedOnPage.length} selected on this page</div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-ghost" onClick={() => handleBulk('active')}>
              <Shield className="h-4 w-4" />
              Mark Active
            </button>
            <button type="button" className="btn-ghost" onClick={() => handleBulk('draft')}>
              <Filter className="h-4 w-4" />
              Mark Draft
            </button>
            <button type="button" className="btn-ghost" onClick={() => handleBulk('archive')}>
              <Archive className="h-4 w-4" />
              Archive
            </button>
            <button type="button" className="btn-ghost" onClick={() => handleBulk('delete')}>
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                const exportCount = selectedOnPage.length || paginated.length
                pushAppToast(`Exported ${exportCount} product${exportCount === 1 ? '' : 's'}`, 'success')
              }}
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <CatalogEmptyState
          icon={Search}
          title="No products found"
          description="Try a different search term, adjust the filters, or add a new product to start building the catalog."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <button type="button" className="btn-ghost" onClick={clearFilters}>
                Clear filters
              </button>
              <button type="button" className="btn-primary" onClick={() => navigate('/products/new')}>
                Add Product
              </button>
            </div>
          }
        />
      ) : (
        <>
          <ProductTable
            rows={paginated}
            selected={selected}
            onToggleSelect={toggleSelect}
            onToggleSelectAll={toggleSelectAll}
            onView={(product) => navigate(`/products/${product.id}`)}
            onEdit={(product) => navigate(`/products/new?productId=${product.id}`)}
            onArchive={(product) => archiveProducts([product.id])}
            onUpdateProduct={updateProduct}
            categories={categories}
            brands={brands}
          />

          <div className="flex flex-col gap-3 rounded-2xl border border-theme bg-white px-4 py-4 shadow-sm md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-theme-secondary">
              Showing <span className="font-semibold text-theme-primary">{paginated.length}</span> of{' '}
              <span className="font-semibold text-theme-primary">{filtered.length}</span> products
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

      <div className="flex flex-wrap items-center gap-2 text-xs text-theme-secondary">
        <span className="chip">Search</span>
        <span className="chip">Filters</span>
        <span className="chip">Bulk actions</span>
        <span className="chip">Pagination</span>
      </div>
    </div>
  )
}
