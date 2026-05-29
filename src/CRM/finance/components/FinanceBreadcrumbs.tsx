import { ChevronRight } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const labelMap: Record<string, string> = {
  finance: 'Finance',
  invoices: 'Invoices',
  payments: 'Payments',
  expenses: 'Expenses',
  collections: 'Collections',
  analytics: 'Analytics',
  reports: 'Reports',
  settings: 'Settings',
}

export default function FinanceBreadcrumbs() {
  const location = useLocation()
  const segments = location.pathname.split('/').filter(Boolean)
  const crumbs = segments.map((segment, index) => ({
    label: labelMap[segment] ?? segment.toUpperCase(),
    href: `/${segments.slice(0, index + 1).join('/')}`,
  }))

  return (
    <div className="flex flex-wrap items-center gap-1 text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-400">
      {crumbs.map((crumb, index) => (
        <div key={crumb.href} className="flex items-center gap-1">
          {index === crumbs.length - 1 ? (
            <span className="text-slate-500">{crumb.label}</span>
          ) : (
            <Link to={crumb.href} className="hover:text-slate-700">
              {crumb.label}
            </Link>
          )}
          {index < crumbs.length - 1 && <ChevronRight className="h-3.5 w-3.5" />}
        </div>
      ))}
    </div>
  )
}
