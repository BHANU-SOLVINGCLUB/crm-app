import type { LucideIcon } from 'lucide-react'
import {
  BellRing,
  BookOpen,
  ChartColumnBig,
  Clock3,
  LayoutDashboard,
  MessageSquareText,
  Ticket,
  UserCheck,
  UsersRound,
  Wrench,
} from 'lucide-react'

export interface SupportRouteItem {
  path: string
  label: string
  icon: LucideIcon
}

export const supportRoutes: SupportRouteItem[] = [
  { path: '/support', label: 'Overview', icon: LayoutDashboard },
  { path: '/support/tickets', label: 'All Tickets', icon: Ticket },
  { path: '/support/my-tickets', label: 'My Tickets', icon: UserCheck },
  { path: '/support/unassigned', label: 'Unassigned', icon: UsersRound },
  { path: '/support/escalations', label: 'Escalations', icon: BellRing },
  { path: '/support/sla', label: 'SLA', icon: Clock3 },
  { path: '/support/knowledge-base', label: 'Knowledge Base', icon: BookOpen },
  { path: '/support/conversations', label: 'Conversations', icon: MessageSquareText },
  { path: '/support/analytics', label: 'Analytics', icon: ChartColumnBig },
  { path: '/support/settings', label: 'Settings', icon: Wrench },
]
