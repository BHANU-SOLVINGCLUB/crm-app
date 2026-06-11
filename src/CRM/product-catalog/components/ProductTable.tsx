import clsx from 'clsx'
import { Edit3, Eye, PackageOpen, Trash2, type LucideIcon } from 'lucide-react'
import { useProductCatalogStore } from '../store'
import type { CatalogBrand, CatalogCategory, CatalogProduct, CatalogStatus } from '../data'
import { formatCatalogDate, getAvailableStock, isInventoryTracked, stockLabel } from '../data'
import CatalogStatusBadge, { stockTone } from './CatalogStatusBadge'

function productInitials(name: string) {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function ProductThumbnail({ product }: { product: CatalogProduct }) {
  const image = product.images[0]
  return image ? (
    <img src={image} alt={product.name} className="h-11 w-11 rounded-xl object-cover ring-1 ring-slate-200" />
  ) : (
    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-theme-surface text-sm font-bold text-theme-primary">
      {productInitials(product.name)}
    </div>
  )
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  destructive,
}: {
  icon: LucideIcon
  label: string
  onClick: () => void
  destructive?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[12px] font-semibold transition',
        destructive
          ? 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
          : 'border-slate-200 bg-white text-theme-primary hover:border-brand-blue/20 hover:text-brand-blue'
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  )
}

export default function ProductTable({
  rows,
  selected,
  onToggleSelect,
  onToggleSelectAll,
  onView,
  onEdit,
  onArchive,
  onUpdateProduct,
  categories,
  brands,
}: {
  rows: CatalogProduct[]
  selected: Set<string>
  onToggleSelect: (id: string) => void
  onToggleSelectAll: () => void
  onView: (product: CatalogProduct) => void
  onEdit: (product: CatalogProduct) => void
  onArchive: (product: CatalogProduct) => void
  onUpdateProduct: (id: string, patch: Partial<CatalogProduct>) => void
  categories: CatalogCategory[]
  brands: CatalogBrand[]
}) {
  const currentRole = useProductCatalogStore((state) => state.currentRole)
  const canEdit = currentRole !== 'Sales User'
  const allSelected = rows.length > 0 && selected.size === rows.length

  return (
    <div className="overflow-auto rounded-2xl border border-theme bg-white shadow-sm">
      <table className="sheet min-w-[1200px]">
        <thead>
          <tr>
            <th className="row-num !text-center">
              <input type="checkbox" className="accent-brand-blue" checked={allSelected} onChange={onToggleSelectAll} />
            </th>
            <th>Product</th>
            <th>SKU</th>
            <th>Category</th>
            <th>Brand</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Updated</th>
            <th className="!text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((product) => (
            <tr key={product.id} className="hover:bg-theme-surface">
              <td className="row-num !text-center" onClick={(event) => event.stopPropagation()}>
                <input
                  type="checkbox"
                  className="accent-brand-blue"
                  checked={selected.has(product.id)}
                  onChange={() => onToggleSelect(product.id)}
                />
              </td>
              <td onClick={(event) => event.stopPropagation()}>
                <div className="flex h-full items-center gap-3 px-3">
                  <ProductThumbnail product={product} />
                  <div className="min-w-0 flex-1">
                    <input
                      value={product.name}
                      onChange={(event) => onUpdateProduct(product.id, { name: event.target.value })}
                      className="cell-input min-w-0 font-semibold"
                      readOnly={!canEdit}
                      placeholder="Product name"
                    />
                    <div className="mt-1 flex flex-wrap gap-1">
                      {product.featured && <span className="chip">Featured</span>}
                      {product.visibility === 'Hidden' && <span className="chip">Hidden</span>}
                    </div>
                  </div>
                </div>
              </td>
              <td onClick={(event) => event.stopPropagation()}>
                <input
                  value={product.sku}
                  onChange={(event) => onUpdateProduct(product.id, { sku: event.target.value })}
                  className="cell-input"
                  readOnly={!canEdit}
                  placeholder="SKU"
                />
              </td>
              <td onClick={(event) => event.stopPropagation()}>
                <select
                  value={product.categoryId}
                  onChange={(event) => onUpdateProduct(product.id, { categoryId: event.target.value })}
                  className="cell-input h-full"
                  disabled={!canEdit}
                >
                  <option value="">Unassigned</option>
                  {categories.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </td>
              <td onClick={(event) => event.stopPropagation()}>
                <select
                  value={product.brandId}
                  onChange={(event) => onUpdateProduct(product.id, { brandId: event.target.value })}
                  className="cell-input h-full"
                  disabled={!canEdit}
                >
                  <option value="">Unassigned</option>
                  {brands.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </td>
              <td onClick={(event) => event.stopPropagation()}>
                <input
                  type="number"
                  value={product.salePrice || product.price}
                  onChange={(event) => onUpdateProduct(product.id, { salePrice: Number(event.target.value) })}
                  className="cell-input text-right tabular-nums font-semibold"
                  readOnly={!canEdit}
                />
              </td>
              <td onClick={(event) => event.stopPropagation()}>
                <div className="flex h-full items-center gap-2 px-3">
                  <div className="grid min-w-0 gap-1">
                    <input
                      type="number"
                      value={product.trackStock ? product.stockQuantity : 0}
                      onChange={(event) => onUpdateProduct(product.id, { stockQuantity: Number(event.target.value) })}
                      className="cell-input text-right tabular-nums font-semibold"
                      readOnly={!canEdit}
                    />
                    <div className="flex flex-wrap gap-1 text-[10px] font-semibold uppercase tracking-widest text-theme-muted">
                      <span>Avail {isInventoryTracked(product) ? getAvailableStock(product) : 'N/A'}</span>
                      {isInventoryTracked(product) && <span>Res {product.reservedStock}</span>}
                    </div>
                  </div>
                  <span className={clsx('inline-flex rounded-full border px-2 py-1 text-[10px] font-semibold', stockTone(product))}>
                    {stockLabel(product)}
                  </span>
                </div>
              </td>
              <td onClick={(event) => event.stopPropagation()}>
                <select
                  value={product.status}
                  onChange={(event) => onUpdateProduct(product.id, { status: event.target.value as CatalogStatus })}
                  className="cell-input h-full"
                  disabled={!canEdit}
                >
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Archived">Archived</option>
                </select>
              </td>
              <td className="text-[12px] text-theme-secondary">{formatCatalogDate(product.updatedAt)}</td>
              <td onClick={(event) => event.stopPropagation()}>
                <div className="flex items-center justify-end gap-2 px-3">
                  <ActionButton icon={Eye} label="View" onClick={() => onView(product)} />
                  {canEdit && <ActionButton icon={Edit3} label="Edit" onClick={() => onEdit(product)} />}
                  {canEdit && <ActionButton icon={PackageOpen} label="Archive" onClick={() => onArchive(product)} />}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="grid gap-3 p-3 lg:hidden">
        <div className="flex items-center justify-between rounded-xl border border-theme bg-theme-surface px-3 py-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-theme-primary">
            <input type="checkbox" className="accent-brand-blue" checked={allSelected} onChange={onToggleSelectAll} />
            Select all
          </label>
          <span className="text-xs font-semibold text-theme-secondary">{rows.length} products</span>
        </div>
        {rows.map((product) => {
          const category = categories.find((item) => item.id === product.categoryId)
          const brand = brands.find((item) => item.id === product.brandId)
          return (
            <div key={product.id} className="rounded-2xl border border-theme bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-2 accent-brand-blue"
                  checked={selected.has(product.id)}
                  onChange={() => onToggleSelect(product.id)}
                />
                <ProductThumbnail product={product} />
                <div className="min-w-0 flex-1">
                  <input
                    value={product.name}
                    onChange={(event) => onUpdateProduct(product.id, { name: event.target.value })}
                    className="cell-input block w-full text-[15px] font-bold text-theme-primary"
                    readOnly={!canEdit}
                  />
                  <div className="mt-1 flex flex-wrap gap-1">
                    <CatalogStatusBadge status={product.status} />
                    {product.featured && <span className="chip">Featured</span>}
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">SKU</div>
                  <input
                    value={product.sku}
                    onChange={(event) => onUpdateProduct(product.id, { sku: event.target.value })}
                    className="cell-input mt-1 w-full"
                    readOnly={!canEdit}
                  />
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Price</div>
                  <input
                    type="number"
                    value={product.salePrice || product.price}
                    onChange={(event) => onUpdateProduct(product.id, { salePrice: Number(event.target.value) })}
                    className="cell-input mt-1 w-full text-right"
                    readOnly={!canEdit}
                  />
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Category</div>
                  <select
                    value={product.categoryId}
                    onChange={(event) => onUpdateProduct(product.id, { categoryId: event.target.value })}
                    className="cell-input mt-1 w-full"
                    disabled={!canEdit}
                  >
                    <option value="">Unassigned</option>
                    {categories.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Brand</div>
                  <select
                    value={product.brandId}
                    onChange={(event) => onUpdateProduct(product.id, { brandId: event.target.value })}
                    className="cell-input mt-1 w-full"
                    disabled={!canEdit}
                  >
                    <option value="">Unassigned</option>
                    {brands.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Stock</div>
                  <input
                    type="number"
                    value={product.stockQuantity}
                    onChange={(event) => onUpdateProduct(product.id, { stockQuantity: Number(event.target.value) })}
                    className="cell-input mt-1 w-full text-right"
                    readOnly={!canEdit}
                  />
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Status</div>
                  <select
                    value={product.status}
                    onChange={(event) => onUpdateProduct(product.id, { status: event.target.value as CatalogStatus })}
                    className="cell-input mt-1 w-full"
                    disabled={!canEdit}
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
                <div className="col-span-2 text-xs text-theme-secondary">
                  {category?.name ?? 'Unassigned'} · {brand?.name ?? 'Unassigned'} · Updated {formatCatalogDate(product.updatedAt)}
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <ActionButton icon={Eye} label="View" onClick={() => onView(product)} />
                {canEdit && <ActionButton icon={Edit3} label="Edit" onClick={() => onEdit(product)} />}
                {canEdit && <ActionButton icon={Trash2} label="Archive" onClick={() => onArchive(product)} destructive />}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
