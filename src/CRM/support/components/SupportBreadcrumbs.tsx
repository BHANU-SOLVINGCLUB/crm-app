import { ChevronRight } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const labelMap: Record<string, string> = {
  support: 'Support',
  tickets: 'Tickets',
  'my-tickets': 'My Tickets',
  unassigned: 'Unassigned',
  escalations: 'Escalations',
  sla: 'SLA',
  'knowledge-base': 'Knowledge Base',
  conversations: 'Conversations',
  analytics: 'Analytics',
  settings: 'Settings',
  general: 'General Settings',
  teams: 'Teams',
  agents: 'Agent Management',
  roles: 'Roles & Permissions',
  notifications: 'Notifications',
  'sla-settings': 'SLA Settings',
  automation: 'Automation Rules',
}

export default function SupportBreadcrumbs() {
  const location = useLocation()
  const segments = location.pathname.split('/').filter(Boolean)
  const crumbs = segments.map((segment, index) => ({
    label: labelMap[segment] ?? segment.toUpperCase(),
    href: `/${segments.slice(0, index + 1).join('/')}`,
  }))

  return (
    <div className="flex flex-wrap items-center gap-1 text-[12px] font-semibold uppercase tracking-[0.14em] text-theme-muted">
      {crumbs.map((crumb, index) => (
        <div key={crumb.href} className="flex items-center gap-1">
          {index === crumbs.length - 1 ? <span className="text-theme-secondary">{crumb.label}</span> : <Link to={crumb.href} className="hover:text-theme-primary">{crumb.label}</Link>}
          {index < crumbs.length - 1 && <ChevronRight className="h-3.5 w-3.5" />}
        </div>
      ))}
    </div>
  )
}
