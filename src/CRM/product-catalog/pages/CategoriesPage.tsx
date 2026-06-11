import { useMemo, useState } from 'react'
import { Plus, PencilLine, Trash2 } from 'lucide-react'
import PageHeader from '../../Components/PageHeader'
import CatalogEmptyState from '../components/CatalogEmptyState'
import CatalogStatusBadge from '../components/CatalogStatusBadge'
import { formatCatalogDate } from '../data'
import { useProductCatalogStore } from '../store'

type CategoryDraft = {
  name: string
  description: string
  status: 'Active' | 'Draft' | 'Archived'
}

const emptyDraft: CategoryDraft = {
  name: '',
  description: '',
  status: 'Active',
}

export default function CategoriesPage() {
  const categories = useProductCatalogStore((state) => state.categories)
  const products = useProductCatalogStore((state) => state.products)
  const addCategory = useProductCatalogStore((state) => state.addCategory)
  const updateCategory = useProductCatalogStore((state) => state.updateCategory)
  const deleteCategory = useProductCatalogStore((state) => state.deleteCategory)

  const [selectedId, setSelectedId] = useState<string | null>(categories[0]?.id ?? null)
  const [draft, setDraft] = useState<CategoryDraft>(() => categories[0] ? {
    name: categories[0].name,
    description: categories[0].description,
    status: categories[0].status,
  } : emptyDraft)

  const counts = useMemo(() =>
    Object.fromEntries(
      categories.map((category) => [
        category.id,
        products.filter((product) => product.categoryId === category.id).length,
      ])
    ) as Record<string, number>,
  [categories, products])

  const save = () => {
    if (!draft.name.trim()) return
    if (selectedId) updateCategory(selectedId, draft)
    else addCategory(draft)
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="grid gap-5">
        <PageHeader
          eyebrow="Catalog Taxonomy"
          title="Categories"
          subtitle="Group products into clean business collections for browsing, reporting, and merchandising."
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
              Add Category
            </button>
          }
        />

        <div className="grid gap-3 md:grid-cols-2">
          {categories.map((category) => {
            const isSelected = selectedId === category.id
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => {
                  setSelectedId(category.id)
                  setDraft({
                    name: category.name,
                    description: category.description,
                    status: category.status,
                  })
                }}
                className={`card text-left transition hover:-translate-y-0.5 ${isSelected ? 'border-brand-blue/20 ring-2 ring-brand-blue/10' : ''}`}
              >
                <div className="flex items-start justify-between gap-3 p-5">
                  <div className="min-w-0">
                    <div className="text-[18px] font-bold text-theme-primary">{category.name}</div>
                    <p className="mt-2 text-sm leading-6 text-theme-secondary">{category.description}</p>
                  </div>
                  <CatalogStatusBadge status={category.status} />
                </div>
                <div className="flex items-center justify-between border-t border-theme px-5 py-3 text-sm text-theme-secondary">
                  <span>{counts[category.id] ?? 0} products</span>
                  <span>{formatCatalogDate(category.updatedAt)}</span>
                </div>
              </button>
            )
          })}
        </div>

        {categories.length === 0 && (
          <CatalogEmptyState
            icon={PencilLine}
            title="No categories yet"
            description="Create categories to organize the product catalog and make browsing easier."
          />
        )}
      </div>

      <section className="card p-5 h-fit">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-theme-secondary">List Categories</div>
            <h3 className="mt-1 text-[18px] font-bold text-theme-primary">{selectedId ? 'Edit Category' : 'Add Category'}</h3>
          </div>
          <button type="button" className="btn-ghost" onClick={() => setSelectedId(null)}>
            New
          </button>
        </div>

        <div className="grid gap-4">
          <label className="grid gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Category Name</span>
            <input className="input" value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} />
          </label>
          <label className="grid gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Description</span>
            <textarea className="input min-h-28 resize-y" value={draft.description} onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} />
          </label>
          <label className="grid gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Status</span>
            <select className="input" value={draft.status} onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value as CategoryDraft['status'] }))}>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Archived">Archived</option>
            </select>
          </label>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button type="button" className="btn-primary" onClick={save}>
            <Plus className="h-4 w-4" />
            Save Category
          </button>
          {selectedId && (
            <button
              type="button"
              className="btn-ghost"
              onClick={() => {
                deleteCategory(selectedId)
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

