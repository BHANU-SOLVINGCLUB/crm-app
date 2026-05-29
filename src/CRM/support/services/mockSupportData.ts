import type {
  AgentSummary,
  ConversationThread,
  KnowledgeArticle,
  ResolutionTrendDatum,
  SlaPolicy,
  SupportSettingsArea,
  SupportChartDatum,
  SupportKpi,
  SupportSettingsSection,
  TicketRecord,
} from '../types'

export const supportKpis: SupportKpi[] = [
  { label: 'Open Tickets', value: '184', delta: 8.2, hint: 'active across all queues', accent: '#2563eb' },
  { label: 'Avg Resolution Time', value: '5.6h', delta: -6.4, hint: 'improving week over week', accent: '#10b981' },
  { label: 'Unassigned', value: '23', delta: -11.3, hint: 'awaiting routing', accent: '#f59e0b' },
  { label: 'Escalated', value: '9', delta: 2.8, hint: 'needs manager attention', accent: '#f43f5e' },
]

export const priorityBreakdown: SupportChartDatum[] = [
  { name: 'Critical', value: 12, color: '#ef4444' },
  { name: 'High', value: 34, color: '#f59e0b' },
  { name: 'Medium', value: 86, color: '#3b82f6' },
  { name: 'Low', value: 52, color: '#94a3b8' },
]

export const categoryBreakdown: SupportChartDatum[] = [
  { name: 'Technical', value: 74, color: '#2563eb' },
  { name: 'Billing', value: 46, color: '#8b5cf6' },
  { name: 'Account', value: 28, color: '#10b981' },
  { name: 'Integrations', value: 22, color: '#f59e0b' },
  { name: 'Security', value: 14, color: '#0f172a' },
]

export const resolutionTrend: ResolutionTrendDatum[] = [
  { day: 'Mon', opened: 31, resolved: 24, breached: 3 },
  { day: 'Tue', opened: 28, resolved: 29, breached: 2 },
  { day: 'Wed', opened: 35, resolved: 30, breached: 4 },
  { day: 'Thu', opened: 33, resolved: 31, breached: 2 },
  { day: 'Fri', opened: 37, resolved: 34, breached: 3 },
  { day: 'Sat', opened: 21, resolved: 20, breached: 1 },
]

export const tickets: TicketRecord[] = [
  {
    id: 'SUP-4102',
    subject: 'SSO login failing for finance team',
    customer: 'Aditi Menon',
    customerPhone: '+91 98765 41020',
    company: 'Northstar Logistics',
    category: 'Technical',
    priority: 'Critical',
    status: 'Escalated',
    assignedAgent: 'Rohan Shah',
    slaTimer: '00:42 left',
    createdDate: '2026-05-28T08:40:00',
    updatedDate: '2026-05-28T11:12:00',
    channel: 'Email',
    escalationType: 'Technical',
    customerEmail: 'aditi@northstarlogistics.com',
    plan: 'Enterprise',
    summary: 'Multiple finance users cannot authenticate through SSO after IdP certificate rotation.',
    internalNotes: [
      'Security engineering engaged for certificate validation.',
      'Customer account manager notified due to payroll processing risk.',
    ],
    attachments: ['sso-error-log.txt', 'idp-screenshot.png'],
    resolution: 'Pending identity provider certificate validation and emergency fallback enablement.',
    conversation: [
      { id: 'C-1', author: 'Aditi Menon', role: 'Customer', message: 'All finance users are blocked from signing in since 8:30 AM.', timestamp: '2026-05-28T08:41:00', channel: 'Email' },
      { id: 'C-2', author: 'Rohan Shah', role: 'Agent', message: 'We have reproduced the issue and escalated to the identity team.', timestamp: '2026-05-28T09:02:00', channel: 'Email' },
    ],
    timeline: [
      { id: 'T-1', title: 'Ticket created', description: 'Email converted into support ticket.', actor: 'System', timestamp: '2026-05-28T08:41:00', type: 'status' },
      { id: 'T-2', title: 'Assigned to Rohan Shah', description: 'Enterprise authentication queue picked the ticket.', actor: 'System', timestamp: '2026-05-28T08:45:00', type: 'assignment' },
      { id: 'T-3', title: 'Escalated', description: 'Marked as technical escalation because SLA risk is under 1 hour.', actor: 'Rohan Shah', timestamp: '2026-05-28T09:05:00', type: 'escalation' },
    ],
  },
  {
    id: 'SUP-4097',
    subject: 'Invoice payment reflected twice in billing portal',
    customer: 'Varun Rao',
    customerPhone: '+91 98765 40970',
    company: 'Veridian Health',
    category: 'Billing',
    priority: 'High',
    status: 'In Progress',
    assignedAgent: 'Maya Joseph',
    slaTimer: '02:11 left',
    createdDate: '2026-05-27T16:30:00',
    updatedDate: '2026-05-28T10:42:00',
    channel: 'Live Chat',
    escalationType: 'Billing',
    customerEmail: 'varun@veridianhealth.com',
    plan: 'Enterprise',
    summary: 'Customer sees duplicate debit entry against one successful invoice payment.',
    internalNotes: ['Payments team reconciling Stripe event replay.'],
    attachments: ['payment-ledger-export.csv'],
    resolution: 'Likely duplicate webhook display bug; awaiting confirmation from billing backend logs.',
    conversation: [
      { id: 'C-3', author: 'Varun Rao', role: 'Customer', message: 'The portal shows a duplicate debit but our bank shows only one charge.', timestamp: '2026-05-27T16:31:00', channel: 'Live Chat' },
      { id: 'C-4', author: 'Maya Joseph', role: 'Agent', message: 'We are reconciling the transaction and will confirm within the hour.', timestamp: '2026-05-27T16:45:00', channel: 'Live Chat' },
    ],
    timeline: [
      { id: 'T-4', title: 'Priority set to high', description: 'Billing discrepancy affecting enterprise customer trust.', actor: 'Maya Joseph', timestamp: '2026-05-27T16:38:00', type: 'priority' },
    ],
  },
  {
    id: 'SUP-4091',
    subject: 'Need help configuring WhatsApp integration',
    customer: 'Karan Sethi',
    customerPhone: '+91 98765 40910',
    company: 'Aster Retail Group',
    category: 'Integrations',
    priority: 'Medium',
    status: 'Open',
    assignedAgent: 'Unassigned',
    slaTimer: '06:34 left',
    createdDate: '2026-05-28T07:15:00',
    updatedDate: '2026-05-28T07:15:00',
    channel: 'WhatsApp',
    customerEmail: 'karan@asterretail.com',
    plan: 'Growth',
    summary: 'Customer needs guided setup for connecting WhatsApp business number to CRM inbox.',
    internalNotes: [],
    attachments: [],
    conversation: [
      { id: 'C-5', author: 'Karan Sethi', role: 'Customer', message: 'Can someone help us complete the WhatsApp setup today?', timestamp: '2026-05-28T07:15:00', channel: 'WhatsApp' },
    ],
    timeline: [
      { id: 'T-5', title: 'Waiting for assignment', description: 'No integration specialist picked up the ticket yet.', actor: 'System', timestamp: '2026-05-28T07:16:00', type: 'assignment' },
    ],
  },
  {
    id: 'SUP-4088',
    subject: 'Password reset emails not arriving',
    customer: 'Ritika Das',
    customerPhone: '+91 98765 40880',
    company: 'Mercury Foods',
    category: 'Account',
    priority: 'Medium',
    status: 'Waiting Customer',
    assignedAgent: 'Neha Kapoor',
    slaTimer: 'Paused',
    createdDate: '2026-05-27T12:50:00',
    updatedDate: '2026-05-28T09:30:00',
    channel: 'Email',
    customerEmail: 'ritika@mercuryfoods.com',
    plan: 'Professional',
    summary: 'Reset emails are likely blocked by customer email security filtering.',
    internalNotes: ['Sent SPF and allowlist steps to customer IT team.'],
    attachments: ['mail-headers.eml'],
    resolution: 'Awaiting customer confirmation after allowlist update.',
    conversation: [
      { id: 'C-6', author: 'Neha Kapoor', role: 'Agent', message: 'Please allowlist our sender domain and test again.', timestamp: '2026-05-28T09:30:00', channel: 'Email' },
    ],
    timeline: [
      { id: 'T-6', title: 'Waiting on customer', description: 'Troubleshooting steps sent.', actor: 'Neha Kapoor', timestamp: '2026-05-28T09:30:00', type: 'status' },
    ],
  },
  {
    id: 'SUP-4081',
    subject: 'Need audit export for compliance review',
    customer: 'Sonia Khurana',
    customerPhone: '+91 98765 40810',
    company: 'BluePeak Energy',
    category: 'Security',
    priority: 'High',
    status: 'Resolved',
    assignedAgent: 'Arun Mathew',
    slaTimer: 'Met',
    createdDate: '2026-05-26T14:10:00',
    updatedDate: '2026-05-27T18:05:00',
    channel: 'Phone Logs',
    escalationType: 'VIP Customer',
    customerEmail: 'sonia@bluepeakenergy.com',
    plan: 'Enterprise',
    summary: 'Customer requested expedited audit log export for internal compliance review.',
    internalNotes: ['Handled through secure file delivery.'],
    attachments: ['audit-export.zip'],
    resolution: 'Provided export and confirmed access with security owner.',
    conversation: [
      { id: 'C-7', author: 'Arun Mathew', role: 'Agent', message: 'The export has been shared through the secure transfer link.', timestamp: '2026-05-27T17:42:00', channel: 'Phone Logs' },
    ],
    timeline: [
      { id: 'T-7', title: 'Resolved', description: 'Customer confirmed successful file access.', actor: 'Arun Mathew', timestamp: '2026-05-27T18:05:00', type: 'status' },
    ],
  },
]

export const articles: KnowledgeArticle[] = [
  { id: 'KB-101', title: 'How to update billing contacts and invoice recipients', category: 'Billing', updatedAt: '2026-05-26', views: 842, excerpt: 'Step-by-step guide to managing invoice recipients, PO details, and finance contacts.' },
  { id: 'KB-102', title: 'Troubleshooting SSO login issues', category: 'Technical', updatedAt: '2026-05-24', views: 1290, excerpt: 'Common identity provider errors, metadata refresh steps, and fallback authentication methods.' },
  { id: 'KB-103', title: 'Configuring API and webhook integrations', category: 'Integrations', updatedAt: '2026-05-22', views: 764, excerpt: 'Set up webhooks, verify signatures, and monitor delivery logs in the CRM.' },
  { id: 'KB-104', title: 'Security checklist for enterprise admins', category: 'Security', updatedAt: '2026-05-21', views: 605, excerpt: 'Role permissions, audit visibility, MFA policies, and secure export handling.' },
]

export const agentSummaries: AgentSummary[] = [
  { id: 'A-1', name: 'Rohan Shah', team: 'Technical Support', resolved: 48, avgResponse: '22m', csat: 4.8, slaSuccess: 96 },
  { id: 'A-2', name: 'Maya Joseph', team: 'Billing Support', resolved: 44, avgResponse: '29m', csat: 4.7, slaSuccess: 94 },
  { id: 'A-3', name: 'Neha Kapoor', team: 'Account Support', resolved: 39, avgResponse: '31m', csat: 4.6, slaSuccess: 92 },
]

export const slaPolicies: SlaPolicy[] = [
  { id: 'S-1', level: 'Critical', target: '1 hour', compliance: 92, openBreaches: 2 },
  { id: 'S-2', level: 'High', target: '4 hours', compliance: 95, openBreaches: 3 },
  { id: 'S-3', level: 'Medium', target: '24 hours', compliance: 97, openBreaches: 4 },
  { id: 'S-4', level: 'Low', target: '48 hours', compliance: 99, openBreaches: 1 },
]

export const conversationThreads: ConversationThread[] = [
  { id: 'TH-1', customer: 'Northstar Logistics', channel: 'Email', subject: 'SSO login failing for finance team', unread: 3, lastMessage: 'All finance users are blocked from signing in.', updatedAt: '2026-05-28T11:12:00' },
  { id: 'TH-2', customer: 'Aster Retail Group', channel: 'WhatsApp', subject: 'Need help configuring WhatsApp integration', unread: 1, lastMessage: 'Can someone help us complete the setup today?', updatedAt: '2026-05-28T07:15:00' },
  { id: 'TH-3', customer: 'Veridian Health', channel: 'Live Chat', subject: 'Invoice payment reflected twice in billing portal', unread: 0, lastMessage: 'We are reconciling the transaction and will confirm shortly.', updatedAt: '2026-05-28T10:42:00' },
]

export const supportSettings: SupportSettingsSection[] = [
  {
    id: 'numbering',
    title: 'Ticket numbering & queues',
    description: 'Control ticket prefixes, queue ownership, and routing visibility across support teams.',
    items: [
      { label: 'Ticket prefix', value: 'SUP-' },
      { label: 'Default queue', value: 'General triage' },
      { label: 'VIP routing', value: 'Enabled for enterprise accounts' },
    ],
  },
  {
    id: 'sla',
    title: 'SLA & escalation policies',
    description: 'First response targets, breach alerts, and escalation rules for critical issues.',
    items: [
      { label: 'Critical first response', value: '1 hour' },
      { label: 'Escalation trigger', value: '80% SLA consumed' },
      { label: 'Working hours', value: '24x7 for enterprise, 9x6 for growth' },
    ],
  },
  {
    id: 'notifications',
    title: 'Notifications & integrations',
    description: 'Configure support email, Slack alerts, and automation notifications for agents and managers.',
    items: [
      { label: 'Reply channel', value: 'support@krisantec.com' },
      { label: 'Slack alerts', value: '#support-escalations, #vip-watch' },
      { label: 'Automation digest', value: 'Daily at 8:00 AM' },
    ],
  },
]

export const supportSettingsAreas: SupportSettingsArea[] = [
  {
    id: 'general',
    title: 'General Settings',
    description: 'Keep ticket structure, numbering, and categories consistent across every support queue.',
    path: '/support/settings/general',
    owner: 'Support Operations',
    priority: 'High',
    summary: 'Ticket numbering, intake defaults, and category governance.',
  },
  {
    id: 'teams',
    title: 'Teams',
    description: 'Organize departments, queue ownership, and escalation coverage without cross-team ambiguity.',
    path: '/support/settings/teams',
    owner: 'Support Leadership',
    priority: 'High',
    summary: 'Team structure, queue ownership, and working hours.',
  },
  {
    id: 'agents',
    title: 'Agent Management',
    description: 'Control who is active, what queue they serve, and which specialists are available for routing.',
    path: '/support/settings/agents',
    owner: 'Workforce Manager',
    priority: 'High',
    summary: 'Agent roster, coverage, and skill alignment.',
  },
  {
    id: 'roles',
    title: 'Roles & Permissions',
    description: 'Reduce admin confusion with a small set of clearly separated support roles and capabilities.',
    path: '/support/settings/roles',
    owner: 'Platform Admin',
    priority: 'High',
    summary: 'Role design, permission boundaries, and admin guardrails.',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Configure only the support alerts that matter most so teams are informed without alert fatigue.',
    path: '/support/settings/notifications',
    owner: 'Support Operations',
    priority: 'Medium',
    summary: 'Assignment alerts, escalation alerts, and SLA warnings.',
  },
  {
    id: 'sla-settings',
    title: 'SLA Settings',
    description: 'Manage response targets, resolution targets, and escalation thresholds from one control surface.',
    path: '/support/settings/sla-settings',
    owner: 'Service Quality',
    priority: 'High',
    summary: 'Response targets, breach thresholds, and policy alignment.',
  },
  {
    id: 'automation',
    title: 'Automation Rules',
    description: 'Future-ready automation center for priority routing, SLA escalation, and queue notifications.',
    path: '/support/settings/automation',
    owner: 'Support Systems',
    priority: 'Future',
    summary: 'Workflow rule structure with placeholders for rollout.',
  },
]
