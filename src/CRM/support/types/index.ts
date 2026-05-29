export type SupportDateRange = '24h' | '7d' | '30d'

export type TicketStatus = 'Open' | 'In Progress' | 'Waiting Customer' | 'Resolved' | 'Closed' | 'Escalated'
export type TicketPriority = 'Critical' | 'High' | 'Medium' | 'Low'
export type EscalationType = 'Technical' | 'Billing' | 'VIP Customer' | 'SLA Breach'
export type SupportChannel = 'Email' | 'WhatsApp' | 'Live Chat' | 'SMS' | 'Phone Logs'

export interface SupportKpi {
  label: string
  value: string
  delta?: number
  hint: string
  accent: string
}

export interface SupportChartDatum {
  name: string
  value: number
  color?: string
}

export interface ResolutionTrendDatum {
  day: string
  opened: number
  resolved: number
  breached: number
}

export interface SupportTimelineEntry {
  id: string
  title: string
  description: string
  actor: string
  timestamp: string
  type: 'reply' | 'status' | 'priority' | 'assignment' | 'escalation' | 'note'
}

export interface ConversationEntry {
  id: string
  author: string
  role: 'Customer' | 'Agent' | 'System'
  message: string
  timestamp: string
  channel: SupportChannel
}

export interface TicketRecord {
  id: string
  subject: string
  customer: string
  customerPhone: string
  company: string
  category: 'Billing' | 'Technical' | 'Account' | 'Integrations' | 'Security'
  priority: TicketPriority
  status: TicketStatus
  assignedAgent: string
  slaTimer: string
  createdDate: string
  updatedDate: string
  channel: SupportChannel
  escalationType?: EscalationType
  customerEmail: string
  plan: string
  summary: string
  internalNotes: string[]
  attachments: string[]
  resolution?: string
  conversation: ConversationEntry[]
  timeline: SupportTimelineEntry[]
}

export interface AgentSummary {
  id: string
  name: string
  team: string
  resolved: number
  avgResponse: string
  csat: number
  slaSuccess: number
}

export interface KnowledgeArticle {
  id: string
  title: string
  category: 'Billing' | 'Technical' | 'Account' | 'Integrations' | 'Security'
  updatedAt: string
  views: number
  excerpt: string
}

export interface SlaPolicy {
  id: string
  level: TicketPriority
  target: string
  compliance: number
  openBreaches: number
}

export interface ConversationThread {
  id: string
  customer: string
  channel: SupportChannel
  subject: string
  unread: number
  lastMessage: string
  updatedAt: string
}

export interface SupportSettingsSection {
  id: string
  title: string
  description: string
  items: Array<{ label: string; value: string }>
}

export interface SupportSettingsArea {
  id: string
  title: string
  description: string
  path: string
  owner: string
  priority: 'High' | 'Medium' | 'Future'
  summary: string
}
