import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ImagePlus, Save, Sparkles, Upload } from 'lucide-react'
import PageHeader from '../../Components/PageHeader'
import CatalogEmptyState from '../components/CatalogEmptyState'
import CatalogStatusBadge from '../components/CatalogStatusBadge'
import { parseTags, useProductCatalogStore } from '../store'
import type { CatalogProduct, CatalogProductForm, CatalogProductVariant } from '../data'

type VariantDraft = Record<'size' | 'color' | 'material', { enabled: boolean; options: string }>

function productToForm(product: CatalogProduct): CatalogProductForm {
  return {
    name: product.name,
    sku: product.sku,
    productCode: product.productCode,
    barcode: product.barcode,
    categoryId: product.categoryId,
    brandId: product.brandId,
    productType: product.productType,
    status: product.status,
    visibility: product.visibility,
    featured: product.featured,
    shortDescription: product.shortDescription,
    description: product.description,
    price: product.price,
    salePrice: product.salePrice,
    costPrice: product.costPrice,
    taxRate: product.taxRate,
    currency: product.currency,
    stockQuantity: product.stockQuantity,
    reservedStock: product.reservedStock,
    lowStockThreshold: product.lowStockThreshold,
    reorderLevel: product.reorderLevel,
    warehouse: product.warehouse,
    trackStock: product.trackStock,
    images: product.images,
    tags: product.tags,
    variants: product.variants,
  }
}

function blankForm(categoryId = '', brandId = ''): CatalogProductForm {
  return {
    name: '',
    sku: '',
    productCode: '',
    barcode: '',
    categoryId,
    brandId,
    productType: 'Physical',
    status: 'Draft',
    visibility: 'Public',
    featured: false,
    shortDescription: '',
    description: '',
    price: 0,
    salePrice: 0,
    costPrice: 0,
    taxRate: 18,
    currency: 'INR',
    stockQuantity: 0,
    reservedStock: 0,
    lowStockThreshold: 10,
    reorderLevel: 15,
    warehouse: 'Main Fulfillment Center',
    trackStock: true,
    images: [],
    tags: [],
    variants: [],
  }
}

function variantsToDraft(variants: CatalogProductVariant[]): VariantDraft {
  const get = (name: CatalogProductVariant['name']) => variants.find((variant) => variant.name === name)
  return {
    size: { enabled: Boolean(get('Size')), options: get('Size')?.values.join(', ') ?? 'S, M, L, XL' },
    color: { enabled: Boolean(get('Color')), options: get('Color')?.values.join(', ') ?? 'Black, White, Blue' },
    material: { enabled: Boolean(get('Material')), options: get('Material')?.values.join(', ') ?? 'Cotton, Polyester' },
  }
}

function draftToVariants(draft: VariantDraft): CatalogProductVariant[] {
  const items: CatalogProductVariant[] = []
  if (draft.size.enabled && parseTags(draft.size.options).length) items.push({ name: 'Size', values: parseTags(draft.size.options) })
  if (draft.color.enabled && parseTags(draft.color.options).length) items.push({ name: 'Color', values: parseTags(draft.color.options) })
  if (draft.material.enabled && parseTags(draft.material.options).length) items.push({ name: 'Material', values: parseTags(draft.material.options) })
  return items
}

export default function AddProductPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const productId = searchParams.get('productId') ?? undefined
  const products = useProductCatalogStore((state) => state.products)
  const categories = useProductCatalogStore((state) => state.categories)
  const brands = useProductCatalogStore((state) => state.brands)
  const saveProduct = useProductCatalogStore((state) => state.saveProduct)

  const editingProduct = useMemo(() => products.find((product) => product.id === productId), [products, productId])
  const [form, setForm] = useState<CatalogProductForm>(() => editingProduct ? productToForm(editingProduct) : blankForm(categories[0]?.id, brands[0]?.id))
  const [variantDraft, setVariantDraft] = useState<VariantDraft>(() => variantsToDraft(editingProduct?.variants ?? []))
  const inventoryEnabled = form.productType === 'Physical'

  const updateField = <K extends keyof CatalogProductForm>(field: K, value: CatalogProductForm[K]) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  useEffect(() => {
    setForm((current) => {
      if (current.productType === 'Physical') {
        return { ...current, trackStock: true }
      }
      return { ...current, trackStock: false, stockQuantity: 0, reservedStock: 0 }
    })
  }, [form.productType])

  const handleUpload = (files: FileList | null) => {
    if (!files?.length) return
    const nextImages = Array.from(files).map((file) => URL.createObjectURL(file))
    setForm((current) => ({ ...current, images: [...current.images, ...nextImages] }))
  }

  const handleSubmit = (status: 'Draft' | 'Active') => {
    const id = saveProduct(
      {
        ...form,
        trackStock: form.productType === 'Physical',
        stockQuantity: form.productType === 'Service' ? 0 : form.stockQuantity,
        reservedStock: form.productType === 'Service' ? 0 : form.reservedStock,
        status,
        tags: parseTags(form.tags.join(', ')),
        variants: draftToVariants(variantDraft),
      },
      editingProduct?.id
    )
    navigate(`/products/${id}`)
  }

  return (
    <div className="grid gap-5">
      <PageHeader
        eyebrow={editingProduct ? 'Catalog Editor' : 'Catalog Creator'}
        title={editingProduct ? 'Edit Product' : 'Add Product'}
        subtitle="Create a sellable product record with pricing, inventory, imagery, and variant options."
        actions={
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-ghost" onClick={() => navigate('/products')}>
              <ArrowLeft className="h-4 w-4" />
              Back to List
            </button>
            <button type="button" className="btn-primary" onClick={() => handleSubmit('Draft')}>
              <Save className="h-4 w-4" />
              Save Draft
            </button>
          </div>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-5">
          <section className="card p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-theme-secondary">Product Information</div>
                <h3 className="mt-1 text-[18px] font-bold text-theme-primary">Core details and identity</h3>
              </div>
              <CatalogStatusBadge status={form.status} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 md:col-span-2">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Product Name</span>
                <input className="input" value={form.name} onChange={(event) => updateField('name', event.target.value)} placeholder="Aero Wireless Headphones" />
              </label>
              <label className="grid gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">SKU</span>
                <input className="input" value={form.sku} onChange={(event) => updateField('sku', event.target.value)} placeholder="AERO-HP-01" />
              </label>
              <label className="grid gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Product Code</span>
                <input className="input" value={form.productCode} onChange={(event) => updateField('productCode', event.target.value)} placeholder="PRD-1001" />
              </label>
              <label className="grid gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Barcode</span>
                <input className="input" value={form.barcode} onChange={(event) => updateField('barcode', event.target.value)} placeholder="8901001100018" />
              </label>
              <label className="grid gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Category</span>
                <select className="input" value={form.categoryId} onChange={(event) => updateField('categoryId', event.target.value)}>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Brand</span>
                <select className="input" value={form.brandId} onChange={(event) => updateField('brandId', event.target.value)}>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>{brand.name}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Product Type</span>
                <select className="input" value={form.productType} onChange={(event) => updateField('productType', event.target.value as CatalogProductForm['productType'])}>
                  <option value="Physical">Physical</option>
                  <option value="Digital">Digital</option>
                  <option value="Bundle">Bundle</option>
                  <option value="Service">Service</option>
                </select>
              </label>
              <label className="grid gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Visibility</span>
                <select className="input" value={form.visibility} onChange={(event) => updateField('visibility', event.target.value as CatalogProductForm['visibility'])}>
                  <option value="Public">Public</option>
                  <option value="Hidden">Hidden</option>
                </select>
              </label>
              <label className="grid gap-2 md:col-span-2">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Short Description</span>
                <input className="input" value={form.shortDescription} onChange={(event) => updateField('shortDescription', event.target.value)} placeholder="One-line summary for list and quick view." />
              </label>
              <label className="grid gap-2 md:col-span-2">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Description</span>
                <textarea className="input min-h-28 resize-y" value={form.description} onChange={(event) => updateField('description', event.target.value)} placeholder="Detailed product description." />
              </label>
              <label className="grid gap-2 md:col-span-2">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Tags</span>
                <input
                  className="input"
                  value={form.tags.join(', ')}
                  onChange={(event) => updateField('tags', parseTags(event.target.value))}
                  placeholder="audio, featured, wireless"
                />
              </label>
            </div>
          </section>

          <section className="card p-5">
            <div className="mb-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-theme-secondary">Pricing</div>
              <h3 className="mt-1 text-[18px] font-bold text-theme-primary">Base price and discount controls</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Price</span>
                <input className="input" type="number" value={form.price} onChange={(event) => updateField('price', Number(event.target.value))} />
              </label>
              <label className="grid gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Sale Price</span>
                <input className="input" type="number" value={form.salePrice} onChange={(event) => updateField('salePrice', Number(event.target.value))} />
              </label>
              <label className="grid gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Cost Price</span>
                <input className="input" type="number" value={form.costPrice} onChange={(event) => updateField('costPrice', Number(event.target.value))} />
              </label>
              <label className="grid gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Tax Rate %</span>
                <input className="input" type="number" value={form.taxRate} onChange={(event) => updateField('taxRate', Number(event.target.value))} />
              </label>
              <label className="grid gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Currency</span>
                <select className="input" value={form.currency} onChange={(event) => updateField('currency', event.target.value as CatalogProductForm['currency'])}>
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                </select>
              </label>
              <label className="grid gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Featured</span>
                <select className="input" value={String(form.featured)} onChange={(event) => updateField('featured', event.target.value === 'true')}>
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </label>
            </div>
          </section>

          <section className="card p-5">
            <div className="mb-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-theme-secondary">Inventory</div>
              <h3 className="mt-1 text-[18px] font-bold text-theme-primary">Stock and replenishment</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Track Stock</span>
                <select
                  className="input"
                  value={String(inventoryEnabled ? true : false)}
                  onChange={(event) => updateField('trackStock', event.target.value === 'true')}
                  disabled={!inventoryEnabled}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                {!inventoryEnabled && (
                  <div className="text-xs text-theme-secondary">Service products do not use inventory tracking.</div>
                )}
              </label>
              <label className="grid gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Warehouse</span>
                <input className="input" value={form.warehouse} onChange={(event) => updateField('warehouse', event.target.value)} disabled={!inventoryEnabled} />
              </label>
              <label className="grid gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Stock Quantity</span>
                <input className="input" type="number" value={form.stockQuantity} onChange={(event) => updateField('stockQuantity', Number(event.target.value))} disabled={!inventoryEnabled} />
              </label>
              <label className="grid gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Reserved Stock</span>
                <input className="input" type="number" value={form.reservedStock} onChange={(event) => updateField('reservedStock', Number(event.target.value))} disabled={!inventoryEnabled} />
              </label>
              <label className="grid gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Low Stock Threshold</span>
                <input className="input" type="number" value={form.lowStockThreshold} onChange={(event) => updateField('lowStockThreshold', Number(event.target.value))} disabled={!inventoryEnabled} />
              </label>
              <label className="grid gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Reorder Level</span>
                <input className="input" type="number" value={form.reorderLevel} onChange={(event) => updateField('reorderLevel', Number(event.target.value))} disabled={!inventoryEnabled} />
              </label>
            </div>
          </section>

          <section className="card p-5">
            <div className="mb-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-theme-secondary">Variants</div>
              <h3 className="mt-1 text-[18px] font-bold text-theme-primary">Size, color, and material options</h3>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              {[
                ['size', 'Size', 'S, M, L, XL'],
                ['color', 'Color', 'Black, White, Blue'],
                ['material', 'Material', 'Cotton, Polyester, Leather'],
              ].map(([key, title, placeholder]) => {
                const variantKey = key as keyof VariantDraft
                return (
                  <div key={key} className="rounded-2xl border border-theme bg-theme-surface p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="text-sm font-bold text-theme-primary">{title}</div>
                        <div className="text-xs text-theme-secondary">Comma-separated options</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={variantDraft[variantKey].enabled}
                        onChange={(event) =>
                          setVariantDraft((current) => ({
                            ...current,
                            [variantKey]: { ...current[variantKey], enabled: event.target.checked },
                          }))
                        }
                        className="h-4 w-4 accent-brand-blue"
                      />
                    </div>
                    <textarea
                      className="input mt-3 min-h-24 resize-y"
                      value={variantDraft[variantKey].options}
                      onChange={(event) =>
                        setVariantDraft((current) => ({
                          ...current,
                          [variantKey]: { ...current[variantKey], options: event.target.value },
                        }))
                      }
                      placeholder={placeholder}
                    />
                  </div>
                )
              })}
            </div>
          </section>
        </div>

        <div className="grid gap-5">
          <section className="card p-5">
            <div className="mb-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-theme-secondary">Images</div>
              <h3 className="mt-1 text-[18px] font-bold text-theme-primary">Upload product visuals</h3>
            </div>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/60 px-4 py-8 text-center transition hover:border-brand-blue/40">
              <ImagePlus className="h-8 w-8 text-brand-blue" />
              <div className="mt-3 text-sm font-semibold text-theme-primary">Drop images here or click to browse</div>
              <div className="mt-1 text-xs text-theme-secondary">PNG, JPG, WEBP up to your browser limits</div>
              <input type="file" multiple accept="image/*" className="hidden" onChange={(event) => handleUpload(event.target.files)} />
            </label>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {form.images.length > 0 ? (
                form.images.map((image, index) => (
                  <div key={`${image}-${index}`} className="overflow-hidden rounded-2xl border border-theme">
                    <img src={image} alt={`Upload ${index + 1}`} className="h-28 w-full object-cover" />
                  </div>
                ))
              ) : (
                <CatalogEmptyState
                  icon={Upload}
                  title="No images yet"
                  description="Add one or more images to make the product look complete in the catalog."
                />
              )}
            </div>
          </section>

          <section className="card p-5">
            <div className="mb-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-theme-secondary">Save Actions</div>
              <h3 className="mt-1 text-[18px] font-bold text-theme-primary">Publish controls</h3>
            </div>
            <div className="grid gap-3">
              <button type="button" className="btn-primary w-full justify-center" onClick={() => handleSubmit('Active')}>
                <Sparkles className="h-4 w-4" />
                Save and Publish
              </button>
              <button type="button" className="btn-ghost w-full justify-center" onClick={() => handleSubmit('Draft')}>
                <Save className="h-4 w-4" />
                Save Draft
              </button>
              <button type="button" className="btn-ghost w-full justify-center" onClick={() => navigate('/products')}>
                Cancel
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
