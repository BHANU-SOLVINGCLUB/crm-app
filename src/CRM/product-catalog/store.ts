import { create } from 'zustand'
import {
  initialBrands,
  initialCategories,
  initialProducts,
  initialVariantGroups,
  type CatalogBrand,
  type CatalogCategory,
  type CatalogInventoryHistoryEntry,
  isInventoryTracked,
  type CatalogProduct,
  type CatalogProductForm,
  type CatalogActivityTone,
  type CatalogInventoryActionType,
  type CatalogStatus,
  type CatalogVariantGroup,
  stockLabel,
} from './data'
import { pushAppToast } from '../../store/uiStore'
import { pushCRMActivity } from '../store/crmStore'

function logCatalogActivity(action: string, productName?: string) {
  pushCRMActivity({
    action: productName ? `${action}: ${productName}` : action,
    user: 'Product Catalog',
    module: 'Products',
    iconType: 'product',
    iconColor: '#f59e0b',
  })
}

export type CatalogAccessRole = 'Admin' | 'Inventory Manager' | 'Sales User'

interface ProductCatalogState {
  products: CatalogProduct[]
  categories: CatalogCategory[]
  brands: CatalogBrand[]
  variants: CatalogVariantGroup[]
  currentRole: CatalogAccessRole
  setCurrentRole: (role: CatalogAccessRole) => void
  saveProduct: (form: CatalogProductForm, existingId?: string) => string
  updateProduct: (id: string, patch: Partial<CatalogProduct>) => void
  addStock: (id: string, quantity: number, user: string, notes: string, supplier?: string, purchaseCost?: number, receivedAt?: string) => void
  reduceStock: (id: string, quantity: number, user: string, reason: string, notes: string) => void
  adjustStock: (id: string, quantity: number, user: string, notes: string) => void
  reserveStock: (id: string, quantity: number, user: string, notes: string) => void
  archiveProducts: (ids: string[]) => void
  setProductStatus: (ids: string[], status: CatalogStatus) => void
  deleteProducts: (ids: string[]) => void
  addCategory: (category: Omit<CatalogCategory, 'id' | 'updatedAt'>) => void
  updateCategory: (id: string, patch: Partial<Omit<CatalogCategory, 'id'>>) => void
  deleteCategory: (id: string) => void
  addBrand: (brand: Omit<CatalogBrand, 'id' | 'updatedAt'>) => void
  updateBrand: (id: string, patch: Partial<Omit<CatalogBrand, 'id'>>) => void
  deleteBrand: (id: string) => void
  updateVariantGroup: (id: string, patch: Partial<Omit<CatalogVariantGroup, 'id'>>) => void
  resetCatalogSeed: () => void
}

function nowIso() {
  return new Date().toISOString()
}

function historyEntry(
  actionType: CatalogInventoryActionType,
  previousQuantity: number,
  newQuantity: number,
  user: string,
  notes: string,
  timestamp = nowIso()
): CatalogInventoryHistoryEntry {
  return {
    id: `${actionType}-${timestamp}`,
    actionType,
    quantityChanged: newQuantity - previousQuantity,
    previousQuantity,
    newQuantity,
    user,
    timestamp,
    notes,
  }
}

function toCsvItems(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function nextActivity(label: string, note: string, tone: CatalogActivityTone = 'info') {
  return {
    id: `${label}-${Date.now()}`,
    title: label,
    note,
    actor: 'You',
    tone,
    timestamp: nowIso(),
  }
}

function buildProduct(
  form: CatalogProductForm,
  existing?: CatalogProduct
): CatalogProduct {
  const activity = existing?.activity ?? []
  const trackStock = form.productType === 'Physical' ? true : false
  const stockQuantity = form.productType === 'Service' ? 0 : form.stockQuantity
  const reservedStock = form.productType === 'Service' ? 0 : form.reservedStock
  const product: CatalogProduct = {
    id: existing?.id ?? `prod-${Date.now()}`,
    name: form.name,
    sku: form.sku,
    productCode: form.productCode,
    barcode: form.barcode,
    categoryId: form.categoryId,
    brandId: form.brandId,
    productType: form.productType,
    status: form.status,
    visibility: form.visibility,
    featured: form.featured,
    shortDescription: form.shortDescription,
    description: form.description,
    price: form.price,
    salePrice: form.salePrice,
    costPrice: form.costPrice,
    taxRate: form.taxRate,
    currency: form.currency,
    stockQuantity,
    reservedStock,
    lowStockThreshold: form.lowStockThreshold,
    reorderLevel: form.reorderLevel,
    warehouse: form.warehouse,
    trackStock,
    images: form.images,
    tags: form.tags,
    variants: form.variants,
    inventoryHistory: existing?.inventoryHistory ?? [],
    createdAt: existing?.createdAt ?? nowIso(),
    updatedAt: nowIso(),
    activity: [
      nextActivity(
        existing ? 'Product updated' : 'Product created',
        existing ? `Updated ${form.name} in the catalog.` : `Created ${form.name} in the catalog.`,
        existing ? 'info' : 'success'
      ),
      ...activity,
    ],
  }
  if (stockLabel(product) === 'Low stock') {
    product.activity.unshift(nextActivity('Stock warning', 'Product is near the reorder threshold.', 'warning'))
  }
  return product
}

const baseState = {
  products: initialProducts,
  categories: initialCategories,
  brands: initialBrands,
  variants: initialVariantGroups,
  currentRole: 'Admin' as CatalogAccessRole,
}

export const useProductCatalogStore = create<ProductCatalogState>((set, get) => ({
  ...baseState,
  setCurrentRole: (role) => set({ currentRole: role }),
  saveProduct: (form, existingId) => {
    const current = existingId ? get().products.find((product) => product.id === existingId) : undefined
    const next = buildProduct(form, current)

    set((state) => {
      const filtered = state.products.filter((product) => product.id !== next.id)
      return { products: [next, ...filtered] }
    })

    pushAppToast(existingId ? 'Product updated' : 'Product added', 'success')
    logCatalogActivity(existingId ? 'Product updated' : 'Product created', next.name)
    return next.id
  },
  updateProduct: (id, patch) => {
    const existing = get().products.find((product) => product.id === id)
    set((state) => ({
      products: state.products.map((product) =>
        product.id === id
          ? (() => {
              const nextType = patch.productType ?? product.productType
              const nextTrackStock = nextType === 'Physical'
              const nextStockQuantity = nextType === 'Service' ? 0 : patch.stockQuantity ?? product.stockQuantity
              const nextReservedStock = nextType === 'Service' ? 0 : patch.reservedStock ?? product.reservedStock

              const nextProduct = {
                ...product,
                ...patch,
                productType: nextType,
                trackStock: nextTrackStock,
                stockQuantity: nextStockQuantity,
                reservedStock: nextReservedStock,
                updatedAt: nowIso(),
                activity: patch.activity ?? product.activity,
              }

              if (stockLabel(nextProduct) === 'Low stock') {
                return {
                  ...nextProduct,
                  activity: [nextActivity('Stock warning', 'Product is near the reorder threshold.', 'warning'), ...nextProduct.activity],
                }
              }

              return nextProduct
            })()
          : product
      ),
    }))
    logCatalogActivity('Product updated', existing?.name)
  },
  addStock: (id, quantity, user, notes, supplier, purchaseCost, receivedAt) => {
    const existing = get().products.find((product) => product.id === id)
    set((state) => ({
      products: state.products.map((product) => {
        if (product.id !== id || !isInventoryTracked(product)) return product
        const previous = product.stockQuantity
        const next = previous + Math.max(0, quantity)
        return {
          ...product,
          stockQuantity: next,
          updatedAt: nowIso(),
          inventoryHistory: [
            historyEntry('Add Stock', previous, next, user, `${notes}${supplier ? ` | Supplier: ${supplier}` : ''}${purchaseCost ? ` | Purchase Cost: ${purchaseCost}` : ''}${receivedAt ? ` | Date Received: ${receivedAt}` : ''}`),
            ...product.inventoryHistory,
          ],
          activity: [nextActivity('Stock added', notes, 'success'), ...product.activity],
        }
      }),
    }))
    logCatalogActivity(`Stock added (+${quantity})`, existing?.name)
  },
  reduceStock: (id, quantity, user, reason, notes) => {
    const existing = get().products.find((product) => product.id === id)
    set((state) => ({
      products: state.products.map((product) => {
        if (product.id !== id || !isInventoryTracked(product)) return product
        const previous = product.stockQuantity
        const next = Math.max(0, previous - Math.max(0, quantity))
        return {
          ...product,
          stockQuantity: next,
          updatedAt: nowIso(),
          inventoryHistory: [
            historyEntry('Reduce Stock', previous, next, user, `${reason} | ${notes}`),
            ...product.inventoryHistory,
          ],
          activity: [nextActivity('Stock reduced', `${reason}: ${notes}`, 'warning'), ...product.activity],
        }
      }),
    }))
    logCatalogActivity(`Stock reduced (-${quantity}, ${reason})`, existing?.name)
  },
  adjustStock: (id, quantity, user, notes) => {
    const existing = get().products.find((product) => product.id === id)
    set((state) => ({
      products: state.products.map((product) => {
        if (product.id !== id || !isInventoryTracked(product)) return product
        const previous = product.stockQuantity
        const next = Math.max(0, quantity)
        return {
          ...product,
          stockQuantity: next,
          updatedAt: nowIso(),
          inventoryHistory: [
            historyEntry('Adjust Stock', previous, next, user, notes),
            ...product.inventoryHistory,
          ],
          activity: [nextActivity('Stock adjusted', notes, 'info'), ...product.activity],
        }
      }),
    }))
    logCatalogActivity(`Stock adjusted to ${quantity}`, existing?.name)
  },
  reserveStock: (id, quantity, user, notes) =>
    set((state) => ({
      products: state.products.map((product) => {
        if (product.id !== id || !isInventoryTracked(product)) return product
        const previous = product.reservedStock
        const next = Math.max(0, quantity)
        return {
          ...product,
          reservedStock: next,
          updatedAt: nowIso(),
          inventoryHistory: [
            historyEntry('Adjust Stock', product.stockQuantity, product.stockQuantity, user, `Reserved stock changed from ${previous} to ${next}. ${notes}`),
            ...product.inventoryHistory,
          ],
        }
      }),
    })),
  archiveProducts: (ids) => {
    const names = get()
      .products.filter((product) => ids.includes(product.id))
      .map((product) => product.name)
    set((state) => {
      pushAppToast(`${ids.length} product${ids.length === 1 ? '' : 's'} archived`, 'success')
      return {
        products: state.products.map((product) =>
          ids.includes(product.id)
            ? { ...product, status: 'Archived', updatedAt: nowIso(), activity: [nextActivity('Archived', 'Product archived from the catalog.', 'warning'), ...product.activity] }
            : product
        ),
      }
    })
    logCatalogActivity(
      names.length === 1 ? 'Product archived' : `${ids.length} products archived`,
      names.length === 1 ? names[0] : undefined
    )
  },
  setProductStatus: (ids, status) => {
    const names = get()
      .products.filter((product) => ids.includes(product.id))
      .map((product) => product.name)
    set((state) => {
      pushAppToast(`${ids.length} product${ids.length === 1 ? '' : 's'} marked ${status.toLowerCase()}`, 'success')
      return {
        products: state.products.map((product) =>
          ids.includes(product.id)
            ? { ...product, status, updatedAt: nowIso(), activity: [nextActivity('Status changed', `Product marked as ${status.toLowerCase()}.`, 'info'), ...product.activity] }
            : product
        ),
      }
    })
    logCatalogActivity(`Product status → ${status}`, names.length === 1 ? names[0] : undefined)
  },
  deleteProducts: (ids) => {
    const names = get()
      .products.filter((product) => ids.includes(product.id))
      .map((product) => product.name)
    set((state) => {
      pushAppToast(`${ids.length} product${ids.length === 1 ? '' : 's'} deleted`, 'success')
      return {
        products: state.products.filter((product) => !ids.includes(product.id)),
      }
    })
    logCatalogActivity(
      names.length === 1 ? 'Product deleted' : `${ids.length} products deleted`,
      names.length === 1 ? names[0] : undefined
    )
  },
  addCategory: (category) =>
    set((state) => {
      pushAppToast('Category added', 'success')
      return {
        categories: [
          {
            ...category,
            id: `cat-${Date.now()}`,
            updatedAt: nowIso(),
          },
          ...state.categories,
        ],
      }
    }),
  updateCategory: (id, patch) =>
    set((state) => {
      pushAppToast('Category updated', 'success')
      return {
        categories: state.categories.map((category) =>
          category.id === id ? { ...category, ...patch, updatedAt: nowIso() } : category
        ),
      }
    }),
  deleteCategory: (id) =>
    set((state) => {
      pushAppToast('Category deleted', 'success')
      return {
        categories: state.categories.filter((category) => category.id !== id),
        products: state.products.map((product) =>
          product.categoryId === id ? { ...product, categoryId: '', updatedAt: nowIso() } : product
        ),
      }
    }),
  addBrand: (brand) =>
    set((state) => {
      pushAppToast('Brand added', 'success')
      return {
        brands: [
          {
            ...brand,
            id: `brand-${Date.now()}`,
            updatedAt: nowIso(),
          },
          ...state.brands,
        ],
      }
    }),
  updateBrand: (id, patch) =>
    set((state) => {
      pushAppToast('Brand updated', 'success')
      return {
        brands: state.brands.map((brand) =>
          brand.id === id ? { ...brand, ...patch, updatedAt: nowIso() } : brand
        ),
      }
    }),
  deleteBrand: (id) =>
    set((state) => {
      pushAppToast('Brand deleted', 'success')
      return {
        brands: state.brands.filter((brand) => brand.id !== id),
        products: state.products.map((product) =>
          product.brandId === id ? { ...product, brandId: '', updatedAt: nowIso() } : product
        ),
      }
    }),
  updateVariantGroup: (id, patch) =>
    set((state) => {
      pushAppToast(`${patch.name ?? 'Variant'} updated`, 'success')
      return {
        variants: state.variants.map((variant) =>
          variant.id === id ? { ...variant, ...patch, updatedAt: nowIso() } : variant
        ),
      }
    }),
  resetCatalogSeed: () => set(baseState),
}))

export function parseTags(value: string) {
  return toCsvItems(value)
}
