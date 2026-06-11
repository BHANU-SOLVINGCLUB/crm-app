import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

export default function CatalogEmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="card flex min-h-[280px] flex-col items-center justify-center px-6 py-10 text-center">
      <div className="icon-tile bg-blue-50 text-brand-blue">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-[18px] font-bold text-theme-primary">{title}</h3>
      <p className="mt-2 max-w-xl text-sm leading-6 text-theme-secondary">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
