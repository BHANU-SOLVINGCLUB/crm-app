import { useMemo, useState } from 'react'
import PageHeader from '../../../components/common/PageHeader'
import CatalogEmptyState from '../components/CatalogEmptyState'
import CatalogStatusBadge from '../components/CatalogStatusBadge'
import { formatCatalogDate } from '../data'
import { useProductCatalogStore } from '../store'
import { Palette, Shapes } from 'lucide-react'

type GroupKey = 'Size' | 'Color' | 'Material'

const GROUPS: GroupKey[] = ['Size', 'Color', 'Material']

const COLOR_PALETTE = [
  { name: 'Black', hex: '#111827' },
  { name: 'White', hex: '#f8fafc' },
  { name: 'Blue', hex: '#2563eb' },
  { name: 'Green', hex: '#16a34a' },
  { name: 'Red', hex: '#dc2626' },
  { name: 'Yellow', hex: '#eab308' },
  { name: 'Purple', hex: '#7c3aed' },
  { name: 'Pink', hex: '#db2777' },
  { name: 'Gray', hex: '#64748b' },
  { name: 'Silver', hex: '#cbd5e1' },
  { name: 'Gold', hex: '#ca8a04' },
  { name: 'Olive', hex: '#6b8e23' },
]

export default function VariantsPage() {
  const variants = useProductCatalogStore((state) => state.variants)
  const updateVariantGroup = useProductCatalogStore((state) => state.updateVariantGroup)
  const [drafts, setDrafts] = useState(() =>
    Object.fromEntries(
      GROUPS.map((group) => {
        const found = variants.find((item) => item.name === group)
        return [
          group,
          {
            enabled: found?.enabled ?? true,
            options: found?.options.join(', ') ?? '',
          },
        ]
      })
    ) as Record<GroupKey, { enabled: boolean; options: string }>
  )

  const variantMap = useMemo(
    () =>
      Object.fromEntries(variants.map((variant) => [variant.name, variant])) as Record<GroupKey, (typeof variants)[number] | undefined>,
    [variants]
  )

  const colorOptions = drafts.Color.options
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

  const toggleColor = (colorName: string) => {
    setDrafts((current) => {
      const currentColors = current.Color.options
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
      const nextColors = currentColors.includes(colorName)
        ? currentColors.filter((item) => item !== colorName)
        : [...currentColors, colorName]
      return {
        ...current,
        Color: {
          ...current.Color,
          options: nextColors.join(', '),
        },
      }
    })
  }

  return (
    <div className="grid gap-5">
      <PageHeader
        eyebrow="Option Catalog"
        title="Variants"
        subtitle="Manage the standard option groups used by product forms and product details."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {GROUPS.map((group) => {
          const variant = variantMap[group]
          return (
            <section key={group} className="card p-5">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-theme-secondary">{group}</div>
                  <h3 className="mt-1 text-[18px] font-bold text-theme-primary">Manage {group.toLowerCase()} options</h3>
                </div>
                <CatalogStatusBadge status={variant?.enabled ? 'Active' : 'Draft'} label={variant?.enabled ? 'Enabled' : 'Disabled'} />
              </div>

              <label className="grid gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Options</span>
                {group === 'Color' ? (
                  <div className="grid gap-3">
                    <div className="rounded-2xl border border-theme bg-theme-surface p-4">
                      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-theme-primary">
                        <Palette className="h-4 w-4 text-brand-blue" />
                        Pick colors for this variant
                      </div>
                      <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
                        {COLOR_PALETTE.map((color) => {
                          const selected = colorOptions.includes(color.name)
                          return (
                            <button
                              key={color.name}
                              type="button"
                              onClick={() => toggleColor(color.name)}
                              className={`group flex flex-col items-center gap-2 rounded-2xl border p-3 text-center transition ${
                                selected
                                  ? 'border-brand-blue bg-blue-50 shadow-sm'
                                  : 'border-theme bg-white hover:border-brand-blue/30 hover:bg-theme-surface'
                              }`}
                            >
                              <span
                                className="h-8 w-8 rounded-full border border-white shadow-sm"
                                style={{ backgroundColor: color.hex, boxShadow: selected ? `0 0 0 3px rgba(37,99,235,0.12)` : undefined }}
                              />
                              <span className="text-[11px] font-semibold text-theme-primary">{color.name}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                    <label className="grid gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-widest text-theme-secondary">Custom colors</span>
                      <input
                        className="input"
                        value={drafts[group].options}
                        onChange={(event) =>
                          setDrafts((current) => ({
                            ...current,
                            [group]: { ...current[group], options: event.target.value },
                          }))
                        }
                        placeholder="Black, White, Blue"
                      />
                    </label>
                  </div>
                ) : (
                  <textarea
                    className="input min-h-32 resize-y"
                    value={drafts[group].options}
                    onChange={(event) =>
                      setDrafts((current) => ({
                        ...current,
                        [group]: { ...current[group], options: event.target.value },
                      }))
                    }
                    placeholder="S, M, L, XL"
                  />
                )}
              </label>

              <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-theme bg-theme-surface px-4 py-3">
                <span className="text-sm font-semibold text-theme-primary">Enable group</span>
                <input
                  type="checkbox"
                  checked={drafts[group].enabled}
                  onChange={(event) =>
                    setDrafts((current) => ({
                      ...current,
                      [group]: { ...current[group], enabled: event.target.checked },
                    }))
                  }
                  className="h-4 w-4 accent-brand-blue"
                />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() =>
                    updateVariantGroup(variant?.id ?? group.toLowerCase(), {
                      name: group,
                      enabled: drafts[group].enabled,
                      options: drafts[group].options
                        .split(',')
                        .map((item) => item.trim())
                        .filter(Boolean),
                    })
                  }
                >
                  Save Changes
                </button>
              </div>

              <div className="mt-4 text-sm text-theme-secondary">{variant?.description ?? 'Standard option group for catalog products.'}</div>
              <div className="mt-4 flex flex-wrap gap-2">
                {(drafts[group].options
                  .split(',')
                  .map((item) => item.trim())
                  .filter(Boolean)
                  .slice(0, 6) || []).map((option) => (
                  <span key={option} className="chip">
                    {option}
                  </span>
                ))}
              </div>
              <div className="mt-4 text-xs text-theme-muted">
                Last updated: {variant ? formatCatalogDate(variant.updatedAt) : 'New'}
              </div>
            </section>
          )
        })}
      </div>

      {variants.length === 0 && (
        <CatalogEmptyState
          icon={Shapes}
          title="No variants configured"
          description="Set up size, color, and material groups so product creation stays consistent."
        />
      )}
    </div>
  )
}
