import { useMemo, useState } from 'react'
import { Plus, PencilLine, Trash2 } from 'lucide-react'
import PageHeader from '../../Components/PageHeader'
import CatalogEmptyState from '../components/CatalogEmptyState'
import CatalogStatusBadge from '../components/CatalogStatusBadge'
import { formatCatalogDate } from '../data'
import { useProductCatalogStore } from '../store'

type BrandDraft = {
  name: string
  description: string
  website: string
  logoColor: string
  status: 'Active' | 'Draft' | 'Archived'
}

const emptyDraft: BrandDraft = {
  name: '',
  description: '',
  website: '',
  logoColor: '#2563eb',
  status: 'Active',
}

export default function BrandsPage() {
  const brands = useProductCatalogStore((state) => state.brands)
  const products = useProductCatalogStore((state) => state.products)
  const addBrand = useProductCatalogStore((state) => state.addBrand)
  const updateBrand = useProductCatalogStore((state) => state.updateBrand)
  const deleteBrand = useProductCatalogStore((state) => state.deleteBrand)

  const [selectedId, setSelectedId] = useState<string | null>(brands[0]?.id ?? null)
  const [draft, setDraft] = useState<BrandDraft>(() => brands[0] ? {
    name: brands[0].name,
    description: brands[0].description,
    website: brands[0].website,
    logoColor: brands[0].logoColor,
    status: brands[0].status,
  } : emptyDraft)

  const counts = useMemo(() =>
    Object.fromEntries(
      brands.map((brand) => [brand.id, products.filter((product) => product.brandId === brand.id).length])
    ) as Record<string, number>,
  [brands, products])

  const save = () => {
    if (!draft.name.trim()) return
    if (selectedId) updateBrand(selectedId, draft)
    else addBrand(draft)
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="grid gap-5">
        <PageHeader
          eyebrow="Catalog Branding"
          title="Brands"
          subtitle="Keep brand names, logos, and product ownership organized for merchandising and reporting."
          actions={
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                setSelectedId(null)
                setDraft(emptyDraft)
              }}
            >
              <Plus className="h-4 w-4" />
              Add Brand
            </button>
          }
        />

        <div className="grid gap-3 md:grid-cols-2">
          {brands.map((brand) => {
            const isSelected = selectedId === brand.id
            return (
              <button
                key={brand.id}
                type="button"
                onClick={() => {
                  setSelectedId(brand.id)
                  setDraft({
                    name: brand.name,
                    description: brand.description,
                    website: brand.website,
                    logoColor: brand.logoColor,
                    status: brand.status,
                  })
                }}
                className={`card text-left transition hover:-translate-y-0.5 ${isSelected ? 'border-brand-blue/20 ring-2 ring-brand-blue/10' : ''}`}
              >
                <div className="flex items-start justify-between gap-3 p-5">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-black text-white" style={{ background: brand.logoColor }}>
                      {brand.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[18px] font-bold text-theme-primary">{brand.name}</div>
                      <p className="mt-2 text-sm leading-6 text-theme-secondary">{brand.description}</p>
                    </div>
                  </div>
                  <CatalogStatusBadge status={brand.status} />
                </div>
                <div className="flex items-center justify-between border-t border-theme px-5 py-3 text-sm text-theme-secondary">
                  <span>{counts[brand.id] ?? 0} products</span>
                  <span>{formatCatalogDate(brand.updatedAt)}</span>
                </div>
              </button>
            )
          })}
        </div>

        {brands.length === 0 && (
          <CatalogEmptyState
            icon={PencilLine}
            title="No brands yet"
            description="Create brands so the catalog can stay organized by product ownership and merchandising source."
          />
        )}
      </div>

      <section className="card p-5 h-fit">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-theme-secondary">List Brands</div>
            <h3 className="mt-1 text-[18px] font-bold text-theme-primary">{selectedId ? 'Edit Brand' : 'Add Brand'}</h3>
          </div>
          <button type="button" className="btn-ghost" onClick={() => setSelectedId(null)}>
            New
          </button>
        </div>

        <div className="grid gap-4">
          <label className="grid gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Brand Name</span>
            <input className="input" value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} />
          </label>
          <label className="grid gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Description</span>
            <textarea className="input min-h-28 resize-y" value={draft.description} onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} />
          </label>
          <label className="grid gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Website</span>
            <input className="input" value={draft.website} onChange={(event) => setDraft((current) => ({ ...current, website: event.target.value }))} />
          </label>
          <label className="grid gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Logo Color</span>
            <input className="input" type="color" value={draft.logoColor} onChange={(event) => setDraft((current) => ({ ...current, logoColor: event.target.value }))} />
          </label>
          <label className="grid gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Status</span>
            <select className="input" value={draft.status} onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value as BrandDraft['status'] }))}>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Archived">Archived</option>
            </select>
          </label>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button type="button" className="btn-primary" onClick={save}>
            <Plus className="h-4 w-4" />
            Save Brand
          </button>
          {selectedId && (
            <button
              type="button"
              className="btn-ghost"
              onClick={() => {
                deleteBrand(selectedId)
                setSelectedId(null)
                setDraft(emptyDraft)
              }}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          )}
        </div>
      </section>
    </div>
  )
}

