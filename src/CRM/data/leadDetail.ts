import type { IndustryKey } from './industries'
import type { LeadInteraction, LeadRow } from './leads'

// ── LeadStage is now a plain string ─────────────────────────────────
// It used to be a fixed 5-value union ('New' | 'Contacted' | 'Booked' |
// 'Visited' | 'Closed/Won') that only matched healthcare's old status
// names. Real backend statuses differ per industry (e.g. real estate
// has "Site Visit"/"Negotiation"/"Token Paid"/"Lost", SaaS has
// "Trial"/"Activated"/"Won"/"Lost", etc.) so this is now just `string`
// and the Profile tab / Pipeline Tracker render schema.statuses directly.
export type LeadStage = string

export type TimelineActivityType =
  | 'whatsapp'
  | 'sms'
  | 'email'
  | 'call'
  | 'note'
  | 'status'
  | 'appointment'
  | 'payment'
  | 'followup'
  | 'document'
  | 'system'

export interface LeadTimelineItem {
  id: string
  type: TimelineActivityType
  title: string
  description: string
  createdAt: string
  actor: string
  unread?: boolean
}

export interface LeadFollowUpItem {
  id: string
  type: 'Call' | 'WhatsApp' | 'Email'
  assignedStaff: string
  scheduledAt: string
  status: 'Pending' | 'Completed'
  notes: string
}

export interface LeadDocumentItem {
  id: string
  fileName: string
  fileType: 'pdf' | 'image' | 'excel'
  uploadedAt: string
  uploadedBy: string
  sizeLabel: string
}

export interface LeadProfileForm {
  fullName: string
  phone: string
  email: string
  gender: string
  dob: string
  city: string
  specialty: string
  preferredDoctor: string
  preferredDate: string
  preferredTime: string
  concernNotes: string
  leadSource: string
  campaignName: string
  assignedStaff: string
  status: LeadStage
}

export interface LeadDetailSeed {
  profile: LeadProfileForm
  score: number
  estimatedValue: number
  createdDate: string
  lastActivity: string
  stage: LeadStage
  timeline: LeadTimelineItem[]
  pendingFollowUps: LeadFollowUpItem[]
  completedFollowUps: LeadFollowUpItem[]
  documents: LeadDocumentItem[]
}

// toStage() has been removed. It used to force every real backend status
// (e.g. "Won", "Site Visit", "Negotiation", "Admitted", "Token Paid") into
// one of only 5 healthcare-shaped buckets, and silently defaulted anything
// it didn't recognize — including "Lost", "Spam", "Duplicate", "Cancelled",
// "Dropped", "Returned" — back to "New". That's why Lost/dead-end statuses
// never displayed correctly. The real backend status string is now used
// as-is everywhere.

function getName(row: LeadRow) {
  return String(row.name ?? row.student ?? row.guest ?? row.contact ?? row.company ?? row.parent ?? 'Lead')
}

function getConcern(row: LeadRow) {
  return String(row.condition ?? row.project ?? row.product ?? row.course ?? row.service ?? row.property ?? 'General Consultation')
}

function getDoctor(row: LeadRow) {
  return String(row.doctor ?? 'Dr. Mehta')
}

function getValue(row: LeadRow) {
  return Number(row.value ?? row.budget ?? row.cart ?? row.mrr ?? row.fee ?? 18000)
}

function getCity(row: LeadRow) {
  return String(row.city ?? row.location ?? 'Mumbai')
}

function getDate(row: LeadRow) {
  return String(row.appointment ?? row.visit ?? row.checkin ?? row.counsel ?? row.discoveryCall ?? '2026-05-28')
}

function getCampaignName(industryKey: IndustryKey, source: string) {
  const labels: Record<IndustryKey, string> = {
    healthcare: 'Summer Wellness Campaign',
    realestate: 'Premium Buyers Drive',
    ecommerce: 'High Intent Retargeting',
    saas: 'Enterprise Demo Sprint',
    education: 'Admissions Conversion Push',
    manufacturing: 'B2B Procurement Campaign',
    hospitality: 'Luxury Stay Retargeting',
    agency: 'Inbound Consulting Funnel',
  }

  return `${labels[industryKey]} • ${source}`
}

export function getLeadIdFromRow(row: LeadRow, industryKey: string, rowIndex: number) {
  const rawLeadId = row.__leadId
  return typeof rawLeadId === 'string' && rawLeadId.trim() ? rawLeadId : `${industryKey}-lead-${rowIndex + 1}`
}

export function getLeadDetailSeed(
  row: LeadRow,
  industryKey: IndustryKey,
  leadInteractions: LeadInteraction[]
): LeadDetailSeed {
  const fullName = getName(row)
  const leadSource = String(row.source ?? row.channel ?? 'Website')
  const assignedStaff = 'Nisha Verma'
  // use the real backend status string directly — no more squashing into 5 buckets
  const status = String(row.status ?? 'New')
  const preferredDate = getDate(row)

  const interactionTimeline = leadInteractions.map<LeadTimelineItem>((interaction, index) => ({
    id: `${interaction.id}-${index}`,
    type:
      String(interaction.interactionChannel ?? '').toLowerCase() === 'whatsapp'
        ? 'whatsapp'
        : String(interaction.interactionChannel ?? '').toLowerCase() === 'sms'
          ? 'sms'
          : String(interaction.interactionChannel ?? '').toLowerCase() === 'email'
            ? 'email'
            : 'call',
    title: `${String(interaction.interactionType || 'Interaction')} logged`,
    description: `${String(interaction.interactionOutcome || 'Updated')} • ${String(interaction.remarks || '')}`,
    createdAt: interaction.createdAt || interaction.interactionAt || new Date().toISOString(),
    actor: assignedStaff,
    unread: index < 2,
  }))

  return {
    profile: {
      fullName,
      phone: String(row.phone ?? '+91 98201 12345'),
      email: String(row.email ?? 'lead@hospitalcrm.com'),
      gender: 'Female',
      dob: '1991-08-17',
      city: getCity(row),
      specialty: getConcern(row),
      preferredDoctor: getDoctor(row),
      preferredDate,
      preferredTime: '11:30',
      concernNotes:
        'Patient is looking for an early consultation slot, wants guidance on treatment options, and prefers digital payment.',
      leadSource,
      campaignName: getCampaignName(industryKey, leadSource),
      assignedStaff,
      status,
    },
    score: 74,
    estimatedValue: getValue(row) || 18000,
    createdDate: '2026-05-08T09:30:00.000Z',
    lastActivity: new Date().toISOString(),
    stage: status,
    timeline: [
      {
        id: 'seed-status',
        type: 'status',
        title: `Status moved to ${status}`,
        description: 'Lead progression updated after qualification review.',
        createdAt: '2026-05-21T14:20:00.000Z',
        actor: assignedStaff,
        unread: true,
      },
      {
        id: 'seed-whatsapp',
        type: 'whatsapp',
        title: 'WhatsApp sent',
        description: 'Shared consultation details, clinic address, and first-visit checklist.',
        createdAt: '2026-05-21T11:10:00.000Z',
        actor: 'Reception Desk',
      },
      {
        id: 'seed-appointment',
        type: 'appointment',
        title: 'Appointment booked',
        description: `Reserved ${preferredDate} at 11:30 with ${getDoctor(row)}.`,
        createdAt: '2026-05-20T16:45:00.000Z',
        actor: assignedStaff,
      },
      {
        id: 'seed-payment',
        type: 'payment',
        title: 'Payment link sent',
        description: 'Sent secure pre-consultation payment link over SMS.',
        createdAt: '2026-05-19T18:05:00.000Z',
        actor: 'Finance Desk',
      },
      {
        id: 'seed-lead',
        type: 'system',
        title: 'Lead captured',
        description: `Lead entered CRM via ${leadSource}.`,
        createdAt: '2026-05-18T10:15:00.000Z',
        actor: 'System',
      },
      ...interactionTimeline,
    ],
    pendingFollowUps: [
      {
        id: 'fu-1',
        type: 'Call',
        assignedStaff,
        scheduledAt: '2026-05-23T10:30:00.000Z',
        status: 'Pending',
        notes: 'Confirm availability and check lab reports.',
      },
      {
        id: 'fu-2',
        type: 'WhatsApp',
        assignedStaff: 'Rahul Menon',
        scheduledAt: '2026-05-24T17:00:00.000Z',
        status: 'Pending',
        notes: 'Send reminder with parking and consultation prep.',
      },
    ],
    completedFollowUps: [
      {
        id: 'fu-3',
        type: 'Email',
        assignedStaff: 'Rahul Menon',
        scheduledAt: '2026-05-20T09:00:00.000Z',
        status: 'Completed',
        notes: 'Insurance coverage summary shared.',
      },
    ],
    documents: [
      {
        id: 'doc-1',
        fileName: 'insurance-card.pdf',
        fileType: 'pdf',
        uploadedAt: '2026-05-20T12:15:00.000Z',
        uploadedBy: 'Front Desk',
        sizeLabel: '1.8 MB',
      },
      {
        id: 'doc-2',
        fileName: 'prescription-history.jpg',
        fileType: 'image',
        uploadedAt: '2026-05-19T16:40:00.000Z',
        uploadedBy: assignedStaff,
        sizeLabel: '860 KB',
      },
      {
        id: 'doc-3',
        fileName: 'financial-estimate.xlsx',
        fileType: 'excel',
        uploadedAt: '2026-05-18T10:50:00.000Z',
        uploadedBy: 'Finance Desk',
        sizeLabel: '240 KB',
      },
    ],
  }
}