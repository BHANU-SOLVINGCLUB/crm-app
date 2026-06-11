import { Outlet, useNavigate } from 'react-router-dom'
import { ArrowRight, BarChart3, Shield, Package2, AlertTriangle } from 'lucide-react'
import PageHeader from '../../Components/PageHeader'
import { getInventoryValue, isInventoryTracked } from '../data'
import { useProductCatalogStore } from '../store'
import ProductCatalogNav from './ProductCatalogNav'

export default function ProductCatalogLayout() {
  const navigate = useNavigate()
  const products = useProductCatalogStore((state) => state.products)
  const currentRole = useProductCatalogStore((state) => state.currentRole)
  const setCurrentRole = useProductCatalogStore((state) => state.setCurrentRole)

  const productCount = products.length
  const inStockCount = products.filter((product) => isInventoryTracked(product) && product.stockQuantity > product.reorderLevel).length
  const lowStockCount = products.filter((product) => isInventoryTracked(product) && product.stockQuantity <= product.reorderLevel).length
  const outOfStockCount = products.filter((product) => isInventoryTracked(product) && product.stockQuantity <= 0).length
  const inventoryValue = products.reduce((sum, product) => sum + getInventoryValue(product), 0)

  return (
    <div className="py-6 lg:py-8">
      <div className="px-5 lg:px-8">
        <PageHeader
          eyebrow="Catalog Operations"
          title="Product Catalog"
          subtitle="Manage products, pricing, inventory, categories, brands, and variants from one workspace."
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-2 rounded-xl border border-theme bg-white px-3 py-2 text-sm font-semibold text-theme-primary shadow-sm">
                <Shield className="h-4 w-4 text-brand-blue" />
                <select
                  value={currentRole}
                  onChange={(event) => setCurrentRole(event.target.value as typeof currentRole)}
                  className="bg-transparent outline-none"
                >
                  <option value="Admin">Admin</option>
                  <option value="Inventory Manager">Inventory Manager</option>
                  <option value="Sales User">Sales User</option>
                </select>
              </label>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => navigate('/products/categories')}
              >
                Categories
              </button>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => navigate('/products/reports')}
              >
                <BarChart3 className="h-4 w-4" />
                Reports
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => navigate('/products/new')}
              >
                Add Product
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          }
        />
        {lowStockCount > 0 && (
          <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5" />
              <div>
                <div className="font-bold">Inventory alert</div>
                <p className="text-sm text-amber-800">{lowStockCount} product{lowStockCount === 1 ? '' : 's'} are at or below reorder level.</p>
              </div>
            </div>
          </div>
        )}
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <div className="card-soft flex items-center gap-4 p-4">
            <div className="icon-tile bg-blue-50 text-brand-blue">
              <Package2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Total Products</div>
              <div className="text-[24px] font-bold">{productCount}</div>
            </div>
          </div>
          <div className="card-soft flex items-center gap-4 p-4">
            <div className="icon-tile bg-emerald-50 text-emerald-600">
              <Package2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">In Stock Products</div>
              <div className="text-[24px] font-bold">{inStockCount}</div>
            </div>
          </div>
          <div className="card-soft flex items-center gap-4 p-4">
            <div className="icon-tile bg-amber-50 text-amber-600">
              <Package2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Low Stock Products</div>
              <div className="text-[24px] font-bold">{lowStockCount}</div>
            </div>
          </div>
          <div className="card-soft flex items-center gap-4 p-4">
            <div className="icon-tile bg-rose-50 text-rose-600">
              <Package2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Out Of Stock</div>
              <div className="text-[24px] font-bold">{outOfStockCount}</div>
            </div>
          </div>
          <div className="card-soft flex items-center gap-4 p-4">
            <div className="icon-tile bg-theme-surface text-theme-secondary">
              <Package2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Inventory Value</div>
              <div className="text-[24px] font-bold">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(inventoryValue)}</div>
            </div>
          </div>
        </div>
      </div>
      <ProductCatalogNav />
      <div className="px-5 pt-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  )
}
