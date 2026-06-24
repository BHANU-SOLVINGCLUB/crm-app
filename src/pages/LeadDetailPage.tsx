import { useEffect, useMemo, useRef, useState, type ChangeEvent, type DragEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CreditCard,
  Download,
  Eye,
  FileImage,
  FileSpreadsheet,
  FileText,
  Filter,
  Mail,
  MessageCircleMore,
  NotebookPen,
  Phone,
  Pill,
  Plus,
  Search,
  Trash2,
  UploadCloud,
  UserCheck,
  UserRoundPen,
} from 'lucide-react'

import { Avatar } from '../components/ui/avatar'
import { Badge } from '../components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Progress } from '../components/ui/progress'
import { ScrollArea } from '../components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import {
  getLeadDetailSeed,
  getLeadIdFromRow,
  type LeadDocumentItem,
  type LeadFollowUpItem,
  type LeadProfileForm,
  type LeadTimelineItem,
  type TimelineActivityType,
} from '../CRM/data/leadDetail'
import { leadsByIndustry, type LeadColumn } from '../CRM/data/leads'
import { formatINR } from '../CRM/lib/format'
import { useCurrentIndustry, useIndustryStore } from '../CRM/store/industryStore'
import './LeadDetailPage.css'
import { fetchLeadById, fetchLeadSchema, updateLeadApi, fetchOrgUsers, assignLead, fetchActivities, createActivity, type OrgUser } from '../api/leads'
import { usePlatformStore } from '../store/usePlatformStore'
import type { LeadRow } from '../CRM/data/leads'

// ── status tone cycling — works for ANY backend status string, any industry ──
// (mirrors the same statusTone approach already used in LeadCapture.tsx)
function statusTone(status: string, statuses: string[]): 'blue' | 'amber' | 'violet' | 'emerald' | 'rose' {
  const toneNames: Array<'blue' | 'amber' | 'violet' | 'emerald' | 'rose'> = ['blue', 'amber', 'violet', 'emerald', 'rose']
  const idx = Math.max(0, statuses.indexOf(status))
  return toneNames[idx % toneNames.length]
}

const activityTypeOptions: Array<{ value: 'all' | TimelineActivityType; label: string }> = [
  { value: 'all', label: 'All activity' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'call', label: 'Calls' },
  { value: 'status', label: 'Status' },
  { value: 'followup', label: 'Follow-ups' },
  { value: 'appointment', label: 'Appointments' },
  { value: 'payment', label: 'Payments' },
  { value: 'document', label: 'Documents' },
  { value: 'note', label: 'Notes' },
]

// staffOptions removed — Assigned Staff now uses real org users fetched
// from the backend (see orgUsers state in LeadDetailWorkspace) instead of
// this hardcoded, industry-agnostic list that incorrectly showed
// healthcare names like "Dr. Mehta" for every industry.

// "Book Appointment" used to assume every industry has doctors (it didn't —
// Real Estate showed a Dr. Mehta/Dr. Sharma list, which made no sense).
// This gives each industry its own meaningful label for the same action.
const APPOINTMENT_LABEL_BY_INDUSTRY: Record<keyof typeof leadsByIndustry, string> = {
  healthcare:    'Book Appointment',
  realestate:    'Schedule Site Visit',
  saas:          'Schedule Demo',
  ecommerce:     'Schedule Callback',
  education:     'Schedule Counselling',
  manufacturing: 'Schedule Site Inspection',
  hospitality:   'Confirm Booking Call',
  agency:        'Schedule Discovery Call',
}

let leadDetailCounter = 0

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function formatDateLabel(value: string | undefined | null) {
  if (!value) return 'N/A'
  const date = new Date(value)
  if (isNaN(date.getTime())) return 'Invalid Date'
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatTimeLabel(value: string | undefined | null) {
  if (!value) return 'N/A'
  const date = new Date(value)
  if (isNaN(date.getTime())) return 'Invalid Date'
  return date.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })
}

function nextLeadDetailId(prefix: string) {
  leadDetailCounter += 1
  return `${prefix}-${leadDetailCounter}`
}

// ── used only by the two semantic Quick Action buttons (Book Appointment / Convert) ──
// finds the closest real schema status for a general intent, since each industry
// names its statuses differently (e.g. "Booked" vs "Site Visit" vs "Demo Scheduled")
function findStatusForIntent(intent: 'booked' | 'won', statuses: string[]): string {
  const exact = statuses.find((s) => s.toLowerCase() === intent)
  if (exact) return exact

  const keywordsByIntent: Record<typeof intent, string[]> = {
    booked: ['booked', 'confirmed', 'proposal', 'site visit', 'admission offered', 'negotiation', 'scheduled', 'demo'],
    won: ['won', 'closed', 'signed', 'ordered', 'po received', 'admitted', 'shipped'],
  }
  const match = statuses.find((s) => keywordsByIntent[intent].some((k) => s.toLowerCase().includes(k)))
  return match ?? statuses[statuses.length - 1]
}



function getActivityMeta(type: TimelineActivityType) {
  switch (type) {
    case 'whatsapp':
      return { icon: <MessageCircleMore className="h-4 w-4" />, color: 'text-emerald-600', bg: 'bg-emerald-100' }
    case 'sms':
      return { icon: <MessageCircleMore className="h-4 w-4" />, color: 'text-sky-600', bg: 'bg-sky-100' }
    case 'email':
      return { icon: <Mail className="h-4 w-4" />, color: 'text-blue-600', bg: 'bg-blue-100' }
    case 'call':
      return { icon: <Phone className="h-4 w-4" />, color: 'text-violet-600', bg: 'bg-violet-100' }
    case 'note':
      return { icon: <NotebookPen className="h-4 w-4" />, color: 'text-amber-600', bg: 'bg-amber-100' }
    case 'status':
      return { icon: <UserRoundPen className="h-4 w-4" />, color: 'text-indigo-600', bg: 'bg-indigo-100' }
    case 'appointment':
      return { icon: <CalendarDays className="h-4 w-4" />, color: 'text-fuchsia-600', bg: 'bg-fuchsia-100' }
    case 'payment':
      return { icon: <CreditCard className="h-4 w-4" />, color: 'text-rose-600', bg: 'bg-rose-100' }
    case 'followup':
      return { icon: <Clock3 className="h-4 w-4" />, color: 'text-orange-600', bg: 'bg-orange-100' }
    case 'document':
      return { icon: <FileText className="h-4 w-4" />, color: 'text-theme-secondary', bg: 'bg-theme-surface' }
    default:
      return { icon: <Pill className="h-4 w-4" />, color: 'text-theme-secondary', bg: 'bg-theme-surface' }
  }
}

function getDocumentIcon(type: LeadDocumentItem['fileType']) {
  switch (type) {
    case 'image':
      return <FileImage className="h-5 w-5" />
    case 'excel':
      return <FileSpreadsheet className="h-5 w-5" />
    default:
      return <FileText className="h-5 w-5" />
  }
}

function buildTimelineItem(
  type: TimelineActivityType,
  title: string,
  description: string,
  actor: string
): LeadTimelineItem {
  return {
    id: nextLeadDetailId(type),
    type,
    title,
    description,
    createdAt: new Date().toISOString(),
    actor,
    unread: true,
  }
}

// ── identity-style keys that get pulled into the header / "Identity" card ──
const IDENTITY_KEYS = ['name', 'student', 'guest', 'company', 'contact', 'parent', 'phone', 'email']

export default function LeadDetailPage() {
  const navigate             = useNavigate()
  const { leadId = '' }      = useParams()
  const currentStoreIndustry = useCurrentIndustry()
  const authUser             = usePlatformStore((s) => s.authUser)

  const isNumericId = /^\d+$/.test(leadId)

  const urlIndustryKey = !isNumericId && leadId
    ? (leadId.split('-')[0] as keyof typeof leadsByIndustry)
    : null
  const isValidUrlIndustry =
    urlIndustryKey && Object.keys(leadsByIndustry).includes(urlIndustryKey)

  const industryKey = isValidUrlIndustry
    ? urlIndustryKey
    : currentStoreIndustry.key

  const getLeads       = useIndustryStore((state) => state.getLeads)
  const leadsOverrides = useIndustryStore((state) => state.leadsOverrides)
  const localRows = useMemo(
    () => getLeads(industryKey),
    [getLeads, leadsOverrides, industryKey]
  )

  const localSchema = leadsByIndustry[industryKey].schema

  const localRowIndex = !isNumericId
    ? localRows.findIndex((row, index) =>
        getLeadIdFromRow(row, industryKey, index) === leadId
      )
    : -1
  const localLeadRow = localRowIndex >= 0 ? localRows[localRowIndex] : null

  const [apiLeadRow, setApiLeadRow] = useState<LeadRow | null>(null)
  const [apiLoading, setApiLoading] = useState(isNumericId)
  const [apiError,   setApiError]   = useState<string | null>(null)
  const [apiSchema,  setApiSchema]  = useState<{ columns: LeadColumn[]; sources: string[]; statuses: string[] } | null>(null)

  const orgId = typeof authUser?.organization === 'number' ? authUser.organization : undefined

  useEffect(() => {
    if (!isNumericId) return
    if (!orgId) return

    setApiLoading(true)
    // fetch the lead first, then fetch its REAL backend schema using the
    // lead's actual industry — the local static schema in leadsByIndustry
    // is only a frontend fallback/seed reference and can drift out of sync
    // with what's actually configured in the database (e.g. real estate's
    // "BHK"/key="bhk" column vs the static fallback's "Configuration"/
    // key="config" — same field, two different keys, which silently
    // breaks reads/writes for that field if the wrong schema is trusted)
    fetchLeadById(orgId, Number(leadId))
      .then(async (lead) => {
        const row: LeadRow = {
          ...lead.data,
          status:   lead.status,
          source:   lead.source,
          __leadId: String(lead.id),
          __apiId:  lead.id,
          __assignedToId: lead.assigned_to ?? '',
        }
        setApiLeadRow(row)

        try {
          const realSchema = await fetchLeadSchema(orgId, lead.industry)
          setApiSchema({
            columns:  realSchema.columns as LeadColumn[],
            sources:  realSchema.sources,
            statuses: realSchema.statuses,
          })
        } catch {
          // fall back to the static schema only if the real one can't be fetched
          setApiSchema(leadsByIndustry[lead.industry as keyof typeof leadsByIndustry]?.schema ?? null)
        }

        setApiLoading(false)
      })
      .catch(() => {
        setApiError('Failed to load lead from backend.')
        setApiLoading(false)
      })
  }, [isNumericId, leadId, orgId])

  const leadRow  = isNumericId ? apiLeadRow  : localLeadRow
  const rowIndex = isNumericId ? 0           : localRowIndex
  const schema   = isNumericId ? (apiSchema ?? localSchema) : localSchema

  const getLeadInteractions = useIndustryStore((state) => state.getLeadInteractions)
  const leadInteractions    = useIndustryStore((state) => state.leadInteractions)
  const savedInteractions   = useMemo(
    () => (leadId ? getLeadInteractions(industryKey, leadId) : []),
    [getLeadInteractions, leadInteractions, industryKey, leadId]
  )

  const seed = useMemo(
    () => (leadRow ? getLeadDetailSeed(leadRow, industryKey, savedInteractions) : null),
    [industryKey, leadRow, savedInteractions]
  )

  if (apiLoading) {
    return (
      <div className="p-6 lg:p-8 text-center" style={{ color: 'var(--text-secondary)' }}>
        Loading lead…
      </div>
    )
  }

  if (apiError) {
    return (
      <div className="p-6 lg:p-8">
        <Card className="mx-auto max-w-2xl">
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <div>
              <h2 className="text-xl font-semibold">Error loading lead</h2>
              <p className="mt-2 text-sm">{apiError}</p>
            </div>
            <button type="button" className="btn-primary" onClick={() => navigate('/leads')}>
              <ArrowLeft className="h-4 w-4" />
              Back to Lead Capture
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!leadRow || !seed) {
    return (
      <div className="p-6 lg:p-8">
        <Card className="mx-auto max-w-2xl">
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <div className="rounded-2xl bg-theme-surface p-4 text-theme-secondary">
              <UserCheck className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme-primary">Lead not found</h2>
              <p className="mt-2 text-sm text-theme-secondary">
                This lead may have been removed or belongs to another industry view.
              </p>
            </div>
            <button type="button" className="btn-primary" onClick={() => navigate('/leads')}>
              <ArrowLeft className="h-4 w-4" />
              Back to Lead Capture
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <LeadDetailWorkspace
      key={`${industryKey}-${leadId}`}
      industryKey={industryKey}
      leadId={leadId}
      rowIndex={rowIndex}
      schema={schema}
      seed={seed}
      leadRow={leadRow}
      isApiLead={isNumericId}
      orgId={orgId}
      apiLeadId={isNumericId ? Number(leadId) : null}
    />
  )
}

function LeadDetailWorkspace({
  industryKey,
  leadId,
  rowIndex,
  schema,
  seed,
  leadRow,
  isApiLead,
  orgId,
  apiLeadId,
}: {
  industryKey: keyof typeof leadsByIndustry
  leadId: string
  rowIndex: number
  schema: { columns: LeadColumn[]; sources: string[]; statuses: string[] }
  seed: ReturnType<typeof getLeadDetailSeed>
  leadRow: LeadRow
  isApiLead: boolean
  orgId: number | undefined
  apiLeadId: number | null
}) {
  const navigate = useNavigate()
  const updateLead = useIndustryStore((state) => state.updateLead)
  const addLeadInteraction = useIndustryStore((state) => state.addLeadInteraction)
  const [activeTab, setActiveTab] = useState('profile')
  const [profile, setProfile] = useState<LeadProfileForm>(seed.profile)

  // ── raw schema-driven field values (industry-agnostic) ──────────────
  // This holds the actual data.* values exactly as the backend stores them,
  // keyed by schema column key (e.g. "project", "bhk", "budget" for real estate).
  const [fieldValues, setFieldValues] = useState<Record<string, string | number>>(() => {
    const initial: Record<string, string | number> = {}
    schema.columns.forEach((col) => {
      const val = leadRow[col.key]
      if (val !== undefined) initial[col.key] = val as string | number
    })
    return initial
  })
  const [savingField, setSavingField] = useState<string | null>(null)

  // ── real org users for the Assigned Staff dropdown ──────────────────
  // Replaces the old hardcoded staffOptions list (which incorrectly showed
  // healthcare names like "Dr. Mehta" for every industry). Fetched once
  // per org via GET /api/orgs/{org_id}/users/.
  const [orgUsers, setOrgUsers] = useState<OrgUser[]>([])
  const [assignedToId, setAssignedToId] = useState<number | null>(() => {
    const raw = leadRow.__assignedToId
    return typeof raw === 'number' ? raw : null
  })
  const [savingAssignment, setSavingAssignment] = useState(false)

  useEffect(() => {
    if (!isApiLead || !orgId) return
    fetchOrgUsers(orgId)
      .then(setOrgUsers)
      .catch(() => setOrgUsers([]))
  }, [isApiLead, orgId])

  const assignedToName = (() => {
    const user = orgUsers.find((u) => u.id === assignedToId)
    return user ? (user.username || user.email) : 'Unassigned'
  })()

  const saveAssignment = async (userId: number | null) => {
    setAssignedToId(userId) // optimistic
    setProfile((current) => (current ? { ...current, assignedStaff: userId
      ? (orgUsers.find((u) => u.id === userId)?.username ?? 'Unassigned')
      : 'Unassigned' } : current))

    if (!isApiLead || !orgId || !apiLeadId) return // localStorage leads: cosmetic only
    setSavingAssignment(true)
    try {
      await assignLead(orgId, apiLeadId, userId)
    } catch {
      pushToast('Failed to save assignment. Check backend connection.')
    } finally {
      setSavingAssignment(false)
    }
  }

  // ── Edit / Save gate for Contact Information + Lead Details ──────────
  // Fields used to save on every individual change (per-keystroke PATCH).
  // Now they're read-only until "Edit" is clicked; changes are held in
  // draftFieldValues and only committed to the backend, all at once,
  // when "Save" is clicked. Status and Assigned Staff are intentionally
  // NOT part of this gate — they're actions with their own immediate
  // side effects (timeline logging, a separate assign endpoint), not
  // descriptive fields, so they keep saving immediately as before.
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [draftFieldValues, setDraftFieldValues] = useState<Record<string, string | number>>({})
  const [savingProfile, setSavingProfile] = useState(false)

  const startEditingProfile = () => {
    setDraftFieldValues(fieldValues)
    setIsEditingProfile(true)
  }

  const cancelEditingProfile = () => {
    setDraftFieldValues({})
    setIsEditingProfile(false)
  }

  const saveProfileEdits = async () => {
    // only send fields that actually changed
    const changedEntries = Object.entries(draftFieldValues).filter(
      ([key, value]) => fieldValues[key] !== value
    )
    if (changedEntries.length === 0) {
      setIsEditingProfile(false)
      return
    }

    setFieldValues((current) => ({ ...current, ...draftFieldValues }))
    changedEntries.forEach(([key, value]) => {
      if (typeof value === 'string') syncHeaderFromFieldKey(key, value)
    })

    if (isApiLead && orgId && apiLeadId) {
      setSavingProfile(true)
      try {
        // 'source' is a real top-level Lead field on the backend; every
        // other key (BHK, budget, name, phone, etc.) lives inside the
        // 'data' JSON blob — these need separate PATCH payload shapes,
        // same distinction the old per-field saveField() used to make.
        const dataChanges: Record<string, string | number> = {}
        let sourceChange: string | undefined
        changedEntries.forEach(([key, value]) => {
          if (key === 'source') {
            sourceChange = String(value)
          } else {
            dataChanges[key] = value
          }
        })

        const payload: { source?: string; data?: Record<string, string | number> } = {}
        if (sourceChange !== undefined) payload.source = sourceChange
        if (Object.keys(dataChanges).length > 0) payload.data = dataChanges

        await updateLeadApi(orgId, apiLeadId, payload)
        pushToast('Lead details saved.')
      } catch {
        pushToast('Failed to save changes. Check backend connection.')
      } finally {
        setSavingProfile(false)
      }
    } else {
      changedEntries.forEach(([key, value]) => updateLead(industryKey, rowIndex, key, value))
    }

    setIsEditingProfile(false)
  }


  // Without this, fieldValues/profile only ever reflect whatever was fetched
  // the FIRST time this lead was opened. If the same lead is edited elsewhere
  // (e.g. from the Lead Capture list) and you return to this same detail page
  // without a full remount, stale values would otherwise stick around and
  // silently overwrite the fresher data on the next save.
  useEffect(() => {
    const next: Record<string, string | number> = {}
    schema.columns.forEach((col) => {
      const val = leadRow[col.key]
      if (val !== undefined) next[col.key] = val as string | number
    })
    setFieldValues(next)
    setProfile(seed.profile)
    setIsEditingProfile(false)
    setDraftFieldValues({})
    const rawAssigned = leadRow.__assignedToId
    setAssignedToId(typeof rawAssigned === 'number' ? rawAssigned : null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leadRow])

  const [timeline, setTimeline] = useState<LeadTimelineItem[]>(() => [...seed.timeline].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)))
  const [timelineLoaded, setTimelineLoaded] = useState(false)

  // ── load REAL persisted activities for API leads ─────────────────────
  // seed.timeline (above) is decorative sample data from leadDetail.ts —
  // fine for localStorage demo leads, but wrong for real leads, which
  // should show their actual history from the backend's Activity table.
  // This replaces the fake seed entries with real ones on load.
  useEffect(() => {
    if (!isApiLead || !orgId || !apiLeadId) {
      setTimelineLoaded(true)
      return
    }
    fetchActivities(orgId, apiLeadId)
      .then((activities) => {
        // ── Reconstruct timeline ──────────────────────────────────────
        // Exclude followup activities from the timeline display — those
        // are shown in the Follow-ups tab, not here. Non-followup ones
        // display as normal timeline entries.
        const realTimeline: LeadTimelineItem[] = activities
          .filter((a) => a.type !== 'followup')
          .map((a) => ({
            id:          `activity-${a.id}`,
            type:        a.type as TimelineActivityType,
            title:       a.title || a.type,
            description: a.notes,
            createdAt:   a.created_at,
            actor:       a.performed_by_name ?? 'System',
          }))
        setTimeline(realTimeline.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)))

        // ── Reconstruct follow-ups ────────────────────────────────────
        // Follow-up activities encode their full state as JSON in notes.
        // Group by followupId, keep the latest activity per ID (most
        // recent POST wins — that's how "mark as completed" works without
        // a PATCH endpoint on Activity).
        const followupActivities = activities.filter((a) => a.type === 'followup')
        const latestByFollowupId = new Map<string, typeof followupActivities[0]>()
        followupActivities
          .sort((a, b) => +new Date(a.created_at) - +new Date(b.created_at)) // oldest first
          .forEach((a) => {
            try {
              const parsed = JSON.parse(a.notes) as { followupId?: string }
              if (parsed.followupId) latestByFollowupId.set(parsed.followupId, a)
            } catch {
              // not JSON-encoded — skip (old plain-text follow-up entries)
            }
          })

        const pending: LeadFollowUpItem[] = []
        const completed: LeadFollowUpItem[] = []

        latestByFollowupId.forEach((activity) => {
          try {
            const data = JSON.parse(activity.notes) as {
              followupId: string
              followupStatus: 'Pending' | 'Completed'
              followupType: 'Call' | 'WhatsApp' | 'Email'
              assignedStaff: string
              scheduledAt: string
              userNotes: string
            }
            const item: LeadFollowUpItem = {
              id:           data.followupId,
              type:         data.followupType,
              assignedStaff: data.assignedStaff,
              scheduledAt:  data.scheduledAt,
              status:       data.followupStatus,
              notes:        data.userNotes,
            }
            if (data.followupStatus === 'Completed') {
              completed.push(item)
            } else {
              pending.push(item)
            }
          } catch {
            // skip malformed entries
          }
        })

        // sort both lists by scheduledAt descending
        const byDate = (a: LeadFollowUpItem, b: LeadFollowUpItem) =>
          +new Date(b.scheduledAt) - +new Date(a.scheduledAt)
        setPendingFollowUps(pending.sort(byDate))
        setCompletedFollowUps(completed.sort(byDate))

        setTimelineLoaded(true)
      })
      .catch(() => setTimelineLoaded(true))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApiLead, orgId, apiLeadId])

  const [pendingFollowUps, setPendingFollowUps] = useState<LeadFollowUpItem[]>(seed.pendingFollowUps)
  const [completedFollowUps, setCompletedFollowUps] = useState<LeadFollowUpItem[]>(seed.completedFollowUps)
  const [documents, setDocuments] = useState<LeadDocumentItem[]>(seed.documents)
  const [score] = useState(seed.score)

  // ── Estimated Value is only meaningful if this industry's schema
  // actually has a money field ─────────────────────────────────────────
  // Previously this always showed a number (defaulting to a hardcoded
  // ₹18,000) even for industries with no currency field at all, like
  // Healthcare — meaning every healthcare lead showed the exact same
  // fake "Expected revenue" regardless of what the lead actually was.
  // This now checks the REAL schema for a known value-field key (the
  // same list the backend's LeadStatsView already uses for pipeline
  // value) and only renders the card if one genuinely exists.
  const VALUE_FIELD_KEYS = ['value', 'budget', 'mrr', 'est_value', 'order_value', 'cart', 'revenue']
  const valueFieldKey = schema.columns.find((col) => VALUE_FIELD_KEYS.includes(col.key))?.key ?? null
  const estimatedValue = valueFieldKey ? Number(leadRow[valueFieldKey] ?? 0) || 0 : null
  const [createdDate] = useState(seed.createdDate)
  const [lastActivity, setLastActivity] = useState(seed.lastActivity)
  const [noteDraft, setNoteDraft] = useState('')
  const [timelineSearch, setTimelineSearch] = useState('')
  const [timelineFilter, setTimelineFilter] = useState<'all' | TimelineActivityType>('all')
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [followUpDialogOpen, setFollowUpDialogOpen] = useState(false)
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [followUpDraft, setFollowUpDraft] = useState({
    type: 'Call' as LeadFollowUpItem['type'],
    assignedStaff: 'Nisha Verma',
    scheduledAt: '2026-05-23T10:30',
    notes: 'Check readiness and reconfirm preference.',
  })
  const [appointmentDraft, setAppointmentDraft] = useState({
    assignedTo: '',
    scheduledAt: '2026-05-24T11:30',
  })

  // ── real Log a Call / Send WhatsApp logging ──────────────────────────
  // These used to write the exact same canned sentence to the timeline
  // every time, with no way to record what was actually said or what
  // happened. They now open a small form first, same pattern as
  // Schedule Site Visit / Add Follow-up.
  const [callDialogOpen, setCallDialogOpen] = useState(false)
  const [callDraft, setCallDraft] = useState({
    outcome: 'Connected' as 'Connected' | 'No Answer' | 'Call Back Later' | 'Not Interested',
    notes: '',
  })
  const [whatsappDialogOpen, setWhatsappDialogOpen] = useState(false)
  const [whatsappDraft, setWhatsappDraft] = useState({
    message: '',
  })
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!toastMessage) return
    const timeout = window.setTimeout(() => setToastMessage(null), 2800)
    return () => window.clearTimeout(timeout)
  }, [toastMessage])

  const unreadCount = timeline.filter((item) => item.unread).length

  // ── pipeline tracker stage math ──────────────────────────────────────
  // visibleStatuses MUST match the same filter used when rendering the
  // tracker below, or stageIndex points at the wrong position once dead-end
  // statuses (Lost, Spam, etc.) are excluded from the visible list — that
  // mismatch was causing the tracker to highlight the wrong stage entirely
  // (e.g. status = "Lost" but the tracker showed "Won" as current).
  const deadEndStatuses = ['lost', 'spam', 'duplicate', 'cancelled', 'dropped', 'returned']
  const isDeadEndStatus = deadEndStatuses.includes(profile.status.toLowerCase())
  const visibleStatuses = schema.statuses.filter((s) => !deadEndStatuses.includes(s.toLowerCase()))
  const stageIndex = isDeadEndStatus ? -1 : visibleStatuses.indexOf(profile.status)

  const filteredTimeline = timeline.filter((item) => {
    if (timelineFilter !== 'all' && item.type !== timelineFilter) return false
    const query = timelineSearch.trim().toLowerCase()
    if (!query) return true
    return [item.title, item.description, item.actor].some((value) => value.toLowerCase().includes(query))
  })

  const activityCounters = timeline.reduce<Record<string, number>>((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1
    return acc
  }, {})

  const pushToast = (message: string) => {
    setToastMessage(message)
  }

  // ── THE CORE FIX ──────────────────────────────────────────────────
  // Single function that handles saving any schema-driven field.
  // Updates local state instantly, then persists correctly depending
  // on whether this lead came from the backend or localStorage.
  const saveField = async (key: string, value: string | number) => {
    // instant UI feedback
    setFieldValues((current) => ({ ...current, [key]: value }))

    if (isApiLead && orgId && apiLeadId) {
      setSavingField(key)
      try {
        if (key === 'status' || key === 'source') {
          await updateLeadApi(orgId, apiLeadId, { [key]: value })
        } else {
          await updateLeadApi(orgId, apiLeadId, { data: { [key]: value } })
        }
      } catch {
        pushToast(`Failed to save ${key}. Check backend connection.`)
      } finally {
        setSavingField(null)
      }
    } else {
      // localStorage fallback — same as before
      updateLead(industryKey, rowIndex, key, value)
    }
  }

  // keep the legacy "profile" fields (fullName/phone/email used in the
  // header avatar block) in sync whenever the matching schema field changes
  const syncHeaderFromFieldKey = (key: string, value: string) => {
    if (IDENTITY_KEYS.includes(key)) {
      // map common identity keys to the header's fullName/phone/email
      if (key === 'name' || key === 'student' || key === 'guest' || key === 'company' || key === 'contact' || key === 'parent') {
        setProfile((current) => (current ? { ...current, fullName: value } : current))
      }
      if (key === 'phone') setProfile((current) => (current ? { ...current, phone: value } : current))
      if (key === 'email') setProfile((current) => (current ? { ...current, email: value } : current))
    }
  }

  const handleFieldChange = (key: string, value: string | number) => {
    // writes to the in-progress draft only — nothing is sent to the
    // backend until Save is clicked (see saveProfileEdits above)
    setDraftFieldValues((current) => ({ ...current, [key]: value }))
  }

  const appendTimeline = (item: LeadTimelineItem) => {
    setTimeline((current) => [item, ...current])
    setLastActivity(item.createdAt)
  }

  const registerInteraction = (
    type: TimelineActivityType,
    title: string,
    description: string,
    actor: string,
    options?: { interactionType?: string; interactionChannel?: string; interactionOutcome?: string }
  ) => {
    const timelineItem = buildTimelineItem(type, title, description, actor)
    appendTimeline(timelineItem)

    addLeadInteraction(industryKey, leadId, {
      id: nextLeadDetailId(leadId),
      leadId,
      leadLabel: profile.fullName,
      interactionType: options?.interactionType ?? title,
      interactionChannel: options?.interactionChannel ?? type,
      interactionAt: timelineItem.createdAt,
      interactionOutcome: options?.interactionOutcome ?? title,
      followUpAt: '',
      followUpMode: '',
      remarks: description,
      autoStatusUpdate: false,
      followUpRequired: false,
      createdAt: timelineItem.createdAt,
    })

    // persist to the real backend for API-sourced leads — without this,
    // every timeline entry (calls, WhatsApp, notes, status changes,
    // appointments) only lived in local React state and vanished on
    // refresh, even though leads/models.py already has a real Activity
    // model and POST endpoint built for exactly this.
    if (isApiLead && orgId && apiLeadId) {
      createActivity(orgId, apiLeadId, { type, title, notes: description }).catch(() => {
        pushToast('Saved locally, but failed to sync this activity to the backend.')
      })
    }
  }

  const updateStatus = (nextStatus: string) => {
    if (nextStatus === profile.status) return
    const previous = profile.status
    setProfile((current) => (current ? { ...current, status: nextStatus } : current))

    void saveField('status', nextStatus)

    registerInteraction(
      'status',
      'Status changed',
      `Status changed from ${previous} to ${nextStatus}.`,
      profile.assignedStaff,
      { interactionType: 'Status Change', interactionChannel: 'CRM', interactionOutcome: nextStatus }
    )
    pushToast(`Lead moved to ${nextStatus}`)
  }

  const handleQuickAction = (action: 'whatsapp' | 'payment' | 'call' | 'convert') => {
    if (action === 'whatsapp') {
      setWhatsappDraft({ message: '' })
      setWhatsappDialogOpen(true)
      return
    }
    if (action === 'payment') {
      registerInteraction(
        'payment', 'Payment link sent',
        'Secure payment link sent.',
        'Finance Desk',
        { interactionType: 'Payment Link', interactionChannel: 'SMS', interactionOutcome: 'Sent' }
      )
      pushToast('Payment link sent successfully')
      return
    }
    if (action === 'call') {
      setCallDraft({ outcome: 'Connected', notes: '' })
      setCallDialogOpen(true)
      return
    }
    updateStatus(findStatusForIntent('won', schema.statuses))
    registerInteraction(
      'system', 'Lead converted',
      'Lead has been marked as converted.',
      profile.assignedStaff,
      { interactionType: 'Conversion', interactionChannel: 'CRM', interactionOutcome: 'Converted' }
    )
    pushToast('Lead converted')
  }

  const logCall = () => {
    const notesText = callDraft.notes.trim()
    registerInteraction(
      'call', `Call logged — ${callDraft.outcome}`,
      notesText || 'No additional notes recorded.',
      profile.assignedStaff,
      { interactionType: 'Outbound Call', interactionChannel: 'Phone', interactionOutcome: callDraft.outcome }
    )
    setCallDialogOpen(false)
    pushToast('Call logged')
  }

  const sendWhatsapp = () => {
    const messageText = whatsappDraft.message.trim()
    if (!messageText) {
      pushToast('Enter a message before logging this WhatsApp send.')
      return
    }
    registerInteraction(
      'whatsapp', 'WhatsApp sent',
      messageText,
      profile.assignedStaff,
      { interactionType: 'Outbound WhatsApp', interactionChannel: 'WhatsApp', interactionOutcome: 'Sent' }
    )
    setWhatsappDialogOpen(false)
    pushToast('WhatsApp message logged')
  }

  const saveNote = () => {
    if (!noteDraft.trim()) return
    registerInteraction('note', 'Note added', noteDraft.trim(), profile.assignedStaff, {
      interactionType: 'Note',
      interactionChannel: 'CRM',
      interactionOutcome: 'Saved',
    })
    setNoteDraft('')
    pushToast('Note added to timeline')
  }

  const addFollowUp = () => {
    const followUpId = nextLeadDetailId('followup')
    const followUp: LeadFollowUpItem = {
      id: followUpId,
      type: followUpDraft.type,
      assignedStaff: followUpDraft.assignedStaff,
      scheduledAt: new Date(followUpDraft.scheduledAt).toISOString(),
      status: 'Pending',
      notes: followUpDraft.notes,
    }
    setPendingFollowUps((current) => [followUp, ...current])

    // persist to backend — encode full follow-up data as JSON in notes
    // so it can be reconstructed on next page load from the Activity table
    const encodedNotes = JSON.stringify({
      followupId:     followUpId,
      followupStatus: 'Pending',
      followupType:   followUp.type,
      assignedStaff:  followUp.assignedStaff,
      scheduledAt:    followUp.scheduledAt,
      userNotes:      followUp.notes,
    })
    if (isApiLead && orgId && apiLeadId) {
      createActivity(orgId, apiLeadId, {
        type: 'followup',
        title: `${followUp.type} follow-up scheduled`,
        notes: encodedNotes,
      }).catch(() => pushToast('Follow-up saved locally but failed to sync to backend.'))
    }

    // also log a human-readable timeline entry (separate, non-JSON activity)
    registerInteraction(
      'followup', 'Follow-up scheduled',
      `${followUp.type} follow-up scheduled for ${formatDateLabel(followUp.scheduledAt)} at ${formatTimeLabel(followUp.scheduledAt)}.`,
      followUp.assignedStaff,
      { interactionType: 'Follow-up', interactionChannel: followUp.type, interactionOutcome: 'Scheduled' }
    )
    setFollowUpDialogOpen(false)
    pushToast('Follow-up added successfully')
  }

  const completeFollowUp = (followUpId: string) => {
    const followUp = pendingFollowUps.find((item) => item.id === followUpId)
    if (!followUp) return
    setPendingFollowUps((current) => current.filter((item) => item.id !== followUpId))
    setCompletedFollowUps((current) => [{ ...followUp, status: 'Completed' }, ...current])

    // persist completion — same followupId so we can resolve the latest
    // status on reload (most recent activity for this ID wins)
    const encodedNotes = JSON.stringify({
      followupId:     followUpId,
      followupStatus: 'Completed',
      followupType:   followUp.type,
      assignedStaff:  followUp.assignedStaff,
      scheduledAt:    followUp.scheduledAt,
      userNotes:      followUp.notes,
    })
    if (isApiLead && orgId && apiLeadId) {
      createActivity(orgId, apiLeadId, {
        type: 'followup',
        title: `${followUp.type} follow-up completed`,
        notes: encodedNotes,
      }).catch(() => pushToast('Completion saved locally but failed to sync to backend.'))
    }

    registerInteraction(
      'followup', 'Follow-up completed',
      `${followUp.type} follow-up completed by ${followUp.assignedStaff}.`,
      followUp.assignedStaff,
      { interactionType: 'Follow-up', interactionChannel: followUp.type, interactionOutcome: 'Completed' }
    )
    pushToast('Follow-up marked as completed')
  }

  const appointmentLabel = APPOINTMENT_LABEL_BY_INDUSTRY[industryKey] ?? 'Schedule Activity'

  const bookAppointment = () => {
    updateStatus(findStatusForIntent('booked', schema.statuses))
    const withWhom = appointmentDraft.assignedTo ? ` with ${appointmentDraft.assignedTo}` : ''
    registerInteraction(
      'appointment', `${appointmentLabel} confirmed`,
      `${appointmentLabel}${withWhom} for ${formatDateLabel(appointmentDraft.scheduledAt)} at ${formatTimeLabel(appointmentDraft.scheduledAt)}.`,
      profile.assignedStaff,
      { interactionType: appointmentLabel, interactionChannel: 'CRM', interactionOutcome: 'Booked' }
    )
    setAppointmentDialogOpen(false)
    pushToast(`${appointmentLabel} confirmed successfully`)
  }

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return
    const newDocuments = Array.from(files).map<LeadDocumentItem>((file, index) => ({
      id: nextLeadDetailId(`doc-upload-${index}`),
      fileName: file.name,
      fileType: file.type.includes('image') ? 'image' : file.name.endsWith('.xlsx') || file.name.endsWith('.xls') ? 'excel' : 'pdf',
      uploadedAt: new Date().toISOString(),
      uploadedBy: profile.assignedStaff,
      sizeLabel: `${Math.max(1, Math.round(file.size / 1024))} KB`,
    }))
    setDocuments((current) => [...newDocuments, ...current])
    newDocuments.forEach((document) => {
      registerInteraction(
        'document', 'Document uploaded',
        `${document.fileName} uploaded to lead records.`,
        document.uploadedBy,
        { interactionType: 'Document Upload', interactionChannel: 'CRM', interactionOutcome: 'Uploaded' }
      )
    })
    pushToast(`${newDocuments.length} document${newDocuments.length > 1 ? 's' : ''} uploaded`)
  }

  const onUploadInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files)
    event.target.value = ''
  }

  const onDropDocuments = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragActive(false)
    handleFiles(event.dataTransfer.files)
  }

  const runDocumentAction = (action: 'view' | 'download' | 'delete', document: LeadDocumentItem) => {
    if (action === 'delete') {
      setDocuments((current) => current.filter((item) => item.id !== document.id))
      registerInteraction(
        'document', 'Document deleted',
        `${document.fileName} removed from lead records.`,
        profile.assignedStaff,
        { interactionType: 'Document Delete', interactionChannel: 'CRM', interactionOutcome: 'Deleted' }
      )
      pushToast('Document deleted')
      return
    }
    registerInteraction(
      'document',
      action === 'view' ? 'Document viewed' : 'Document downloaded',
      `${document.fileName} ${action === 'view' ? 'opened' : 'downloaded'} by ${profile.assignedStaff}.`,
      profile.assignedStaff,
      { interactionType: 'Document Access', interactionChannel: 'CRM', interactionOutcome: action === 'view' ? 'Viewed' : 'Downloaded' }
    )
    pushToast(action === 'view' ? 'Document view opened' : 'Document download started')
  }

  // ── split schema columns into Identity vs Details ──────────────────
  const identityColumns = schema.columns.filter((col) => IDENTITY_KEYS.includes(col.key))
  const detailColumns   = schema.columns.filter(
    (col) => !IDENTITY_KEYS.includes(col.key) && col.key !== 'status' && col.key !== 'source'
  )

  return (
    <div className="lead-detail-shell px-4 py-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-theme-secondary">
              <Link to="/leads" className="transition hover:text-theme-primary">Lead Capture</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="font-medium text-theme-primary">{profile.fullName}</span>
            </div>
            <button type="button" className="inline-flex items-center gap-2 text-sm font-medium text-theme-secondary transition hover:text-theme-primary" onClick={() => navigate('/leads')}>
              <ArrowLeft className="h-4 w-4" />
              Back to Lead Capture
            </button>
          </div>
          {!isEditingProfile ? (
            <button type="button" className="btn-ghost" onClick={startEditingProfile}>
              <UserRoundPen className="h-4 w-4" />
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button type="button" className="btn-ghost" onClick={cancelEditingProfile} disabled={savingProfile}>
                Cancel
              </button>
              <button type="button" className="btn-primary" onClick={() => void saveProfileEdits()} disabled={savingProfile}>
                {savingProfile ? 'Saving…' : 'Save'}
              </button>
            </div>
          )}
        </div>

        <Card className="crm-glass-header overflow-visible">
          <CardContent className="grid gap-6 p-6 lg:p-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.8fr)]">
            <div className="space-y-6">
              <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex items-start gap-5">
                  <Avatar className="h-16 w-16 border-4 border-white shadow-sm text-lg">{getInitials(profile.fullName)}</Avatar>
                  <div className="space-y-2.5">
                    <div className="flex flex-wrap items-center gap-3">
                      <h1 className="text-3xl font-extrabold tracking-tight text-theme-primary drop-shadow-sm">{profile.fullName}</h1>
                      <Badge tone={statusTone(profile.status, schema.statuses)}>{profile.status}</Badge>
                      {unreadCount > 0 && <Badge tone="rose">{unreadCount} unread</Badge>}
                      {isApiLead && <Badge tone="emerald">☁ Synced</Badge>}
                    </div>
                    <div className="flex flex-wrap gap-5 text-sm font-medium text-theme-secondary">
                      <span className="inline-flex items-center gap-2 bg-white/60 px-2.5 py-1 rounded-md backdrop-blur-sm"><Phone className="h-4 w-4 text-theme-muted" />{profile.phone}</span>
                      <span className="inline-flex items-center gap-2 bg-white/60 px-2.5 py-1 rounded-md backdrop-blur-sm"><Mail className="h-4 w-4 text-theme-muted" />{profile.email}</span>
                    </div>
                  </div>
                </div>

                <div className={`grid gap-4 ${estimatedValue !== null ? 'sm:grid-cols-2' : 'sm:grid-cols-1'}`}>
                  <Card className="border border-white/60 bg-white/70 backdrop-blur-md shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:bg-white/90">
                    <CardContent className="space-y-3 p-5">
                      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-theme-secondary">
                        <span>Lead Score</span>
                        <span className="bg-theme-surface text-theme-primary px-2 py-0.5 rounded-full">{score}/100</span>
                      </div>
                      <Progress value={score} className="h-2" />
                      <p className="text-[13px] text-theme-secondary font-medium">High-intent profile with strong conversion probability.</p>
                    </CardContent>
                  </Card>
                  {estimatedValue !== null && (
                    <Card className="border border-indigo-900/10 bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-900/20">
                      <CardContent className="space-y-2.5 p-5">
                        <div className="text-[11px] font-bold uppercase tracking-widest text-indigo-200/80">Estimated Value</div>
                        <div className="text-3xl font-extrabold tracking-tight drop-shadow-md">{formatINR(estimatedValue)}</div>
                        <p className="text-[13px] text-indigo-100/70 font-medium">Expected revenue from this lead.</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <MetricCard label="Created" value={formatDateLabel(createdDate)} />
              <MetricCard label="Last Activity" value={`${formatDateLabel(lastActivity)} • ${formatTimeLabel(lastActivity)}`} />
              <MetricCard label="Assigned To" value={assignedToName} />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="followups">Follow-ups</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <div className="mb-4 text-sm text-theme-secondary">
                  {isEditingProfile
                    ? 'Editing — changes are not saved until you click Save (top right).'
                    : 'Contact Information and Lead Details are read-only. Click Edit (top right) to make changes.'}
                </div>
                <div className="grid gap-5 lg:grid-cols-2">
                  {/* ── Identity card — dynamic from schema ── */}
                  <SectionCard
                    title="Contact Information"
                    description="Core identity fields that sync with the lead record."
                  >
                    {identityColumns.map((col) => (
                      <EditableField key={col.key} label={col.label}>
                        <SchemaFieldInput
                          col={col}
                          value={(isEditingProfile ? draftFieldValues[col.key] : fieldValues[col.key]) ?? ''}
                          onChange={(v) => handleFieldChange(col.key, v)}
                          disabled={!isEditingProfile}
                        />
                      </EditableField>
                    ))}
                  </SectionCard>

                  {/* ── Detail card — dynamic from schema, industry-specific ── */}
                  <SectionCard
                    title="Lead Details"
                    description={`Fields specific to this industry's lead schema.`}
                  >
                    {detailColumns.map((col) => (
                      <EditableField
                        key={col.key}
                        label={col.label}
                        fullWidth={col.type === 'text' && col.key.toLowerCase().includes('note')}
                      >
                        <SchemaFieldInput
                          col={col}
                          value={(isEditingProfile ? draftFieldValues[col.key] : fieldValues[col.key]) ?? ''}
                          onChange={(v) => handleFieldChange(col.key, v)}
                          disabled={!isEditingProfile}
                        />
                      </EditableField>
                    ))}
                  </SectionCard>

                  {/* ── Lead Information card — status/source/assignment — these stay
                       as immediate actions, NOT gated behind Edit/Save, since they're
                       actions with their own side effects (timeline logging, a separate
                       assign endpoint), not descriptive data about the lead. ── */}
                  <SectionCard title="Lead Information" description="Source, assignment, and conversion-driving fields.">
                    <EditableField label="Lead Source" saving={savingField === 'source'}>
                      <select
                        className="crm-field-input"
                        value={String(fieldValues.source ?? profile.leadSource)}
                        onChange={(event) => void saveField('source', event.target.value)}
                      >
                        {schema.sources.map((source) => <option key={source} value={source}>{source}</option>)}
                      </select>
                    </EditableField>
                    <EditableField label="Assigned Staff" saving={savingAssignment}>
                      <select
                        className="crm-field-input"
                        value={assignedToId ?? ''}
                        onChange={(event) => {
                          const val = event.target.value
                          void saveAssignment(val === '' ? null : Number(val))
                        }}
                      >
                        <option value="">Unassigned</option>
                        {orgUsers.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.username || user.email} ({user.role})
                          </option>
                        ))}
                      </select>
                    </EditableField>
                    <EditableField label="Status" saving={savingField === 'status'}>
                      <select className="crm-field-input" value={profile.status} onChange={(event) => updateStatus(event.target.value)}>
                        {schema.statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                      </select>
                    </EditableField>
                  </SectionCard>
                </div>
              </TabsContent>

              <TabsContent value="timeline">
                <Card className="crm-glass-card">
                  <CardHeader>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <CardTitle>Activity Timeline</CardTitle>
                        <CardDescription>
                          {isApiLead && !timelineLoaded
                            ? 'Loading activity history…'
                            : 'Every interaction across calls, messages, payments, appointments, and notes lands here automatically.'}
                        </CardDescription>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <CounterBadge label="All" value={timeline.length} />
                        <CounterBadge label="WhatsApp" value={activityCounters.whatsapp || 0} />
                        <CounterBadge label="Calls" value={activityCounters.call || 0} />
                        <CounterBadge label="Unread" value={unreadCount} tone="rose" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
                      <div className="rounded-2xl border border-slate-200 bg-theme-surface p-4">
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-theme-secondary">Add internal note</label>
                        <textarea
                          className="crm-field-input min-h-24 resize-y bg-white"
                          placeholder="Capture objection handling, notes, readiness, or anything the next staff member should know."
                          value={noteDraft}
                          onChange={(event) => setNoteDraft(event.target.value)}
                        />
                        <div className="mt-3 flex justify-end">
                          <button type="button" className="btn-primary" onClick={saveNote}>
                            <NotebookPen className="h-4 w-4" />
                            Save Note
                          </button>
                        </div>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                        <div className="relative">
                          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-theme-muted" />
                          <input
                            className="crm-field-input pl-9"
                            placeholder="Search activity"
                            value={timelineSearch}
                            onChange={(event) => setTimelineSearch(event.target.value)}
                          />
                        </div>
                        <div className="relative">
                          <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-theme-muted" />
                          <select className="crm-field-input pl-9" value={timelineFilter} onChange={(event) => setTimelineFilter(event.target.value as 'all' | TimelineActivityType)}>
                            {activityTypeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    <ScrollArea className="max-h-[900px] pr-2">
                      <div className="timeline-flow">
                        {filteredTimeline.map((item) => {
                          const meta = getActivityMeta(item.type)
                          return (
                            <div key={item.id} className="timeline-row">
                              <div className={`timeline-icon ${meta.bg} ${meta.color}`}>{meta.icon}</div>
                              <Card className="timeline-card">
                                <CardContent className="space-y-3 p-4">
                                  <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <h4 className="text-sm font-semibold text-theme-primary">{item.title}</h4>
                                        {item.unread && <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />}
                                      </div>
                                      <p className="mt-1 text-sm leading-6 text-theme-secondary">{item.description}</p>
                                    </div>
                                    <Badge tone="slate">{item.actor}</Badge>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-theme-muted">
                                    <span>{formatDateLabel(item.createdAt)}</span>
                                    <span>{formatTimeLabel(item.createdAt)}</span>
                                    <span>{item.type}</span>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          )
                        })}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="followups">
                <div className="grid gap-6 lg:grid-cols-2">
                  <Card className="crm-glass-card">
                    <CardHeader className="flex-row items-center justify-between space-y-0">
                      <div>
                        <CardTitle>Pending Follow-ups</CardTitle>
                        <CardDescription>Tasks queued for the next touchpoint.</CardDescription>
                      </div>
                      <button type="button" className="btn-primary" onClick={() => setFollowUpDialogOpen(true)}>
                        <Plus className="h-4 w-4" />
                        Add Follow-up
                      </button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {pendingFollowUps.map((item) => (
                        <FollowUpCard key={item.id} item={item} actionLabel="Mark as Completed" onAction={() => completeFollowUp(item.id)} />
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="crm-glass-card">
                    <CardHeader>
                      <CardTitle>Completed Follow-ups</CardTitle>
                      <CardDescription>History of executed follow-up tasks.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {completedFollowUps.map((item) => (
                        <FollowUpCard key={item.id} item={item} />
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="documents">
                <Card className="crm-glass-card">
                  <CardHeader className="flex-row items-center justify-between space-y-0">
                    <div>
                      <CardTitle>Documents</CardTitle>
                      <CardDescription>Reports, contracts, payment estimates, and uploaded evidence.</CardDescription>
                    </div>
                    <button type="button" className="btn-ghost" onClick={() => fileInputRef.current?.click()}>
                      <UploadCloud className="h-4 w-4" />
                      Upload
                    </button>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <input ref={fileInputRef} type="file" multiple className="hidden" onChange={onUploadInputChange} />
                    <div
                      className={`crm-upload-zone ${dragActive ? 'crm-upload-zone-active' : ''}`}
                      onDragEnter={(event) => { event.preventDefault(); setDragActive(true) }}
                      onDragLeave={(event) => { event.preventDefault(); setDragActive(false) }}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={onDropDocuments}
                    >
                      <UploadCloud className="h-8 w-8 text-blue-600" />
                      <div>
                        <div className="text-base font-semibold text-theme-primary">Drag & drop files here</div>
                        <p className="mt-1 text-sm text-theme-secondary">Supports PDF, images, and Excel files.</p>
                      </div>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                      {documents.map((document) => (
                        <Card key={document.id} className="border border-slate-200 shadow-sm">
                          <CardContent className="space-y-4 p-4">
                            <div className="flex items-start gap-3">
                              <div className="rounded-2xl bg-theme-surface p-3 text-theme-secondary">{getDocumentIcon(document.fileType)}</div>
                              <div className="min-w-0 flex-1">
                                <div className="truncate text-sm font-semibold text-theme-primary">{document.fileName}</div>
                                <div className="mt-1 text-sm text-theme-secondary">{document.sizeLabel}</div>
                                <div className="mt-2 text-xs uppercase tracking-[0.16em] text-theme-muted">
                                  {formatDateLabel(document.uploadedAt)} • {document.uploadedBy}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <ActionPill label="View" icon={<Eye className="h-4 w-4" />} onClick={() => runDocumentAction('view', document)} />
                              <ActionPill label="Download" icon={<Download className="h-4 w-4" />} onClick={() => runDocumentAction('download', document)} />
                              <ActionPill label="Delete" icon={<Trash2 className="h-4 w-4" />} destructive onClick={() => runDocumentAction('delete', document)} />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <aside className="space-y-5 xl:sticky xl:top-6 xl:self-start">
            <Card>
              <CardHeader>
                <CardTitle>Pipeline Stage Tracker</CardTitle>
                <CardDescription>Current lead progression inside the CRM journey.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isDeadEndStatus && (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                    This lead is marked &quot;{profile.status}&quot; and is no longer progressing through the funnel.
                  </div>
                )}
                {/* dead-end statuses (Lost, Cancelled etc.) are excluded from the
                    linear progress tracker — they're terminal branches, not forward
                    progression steps. visibleStatuses/stageIndex above already
                    account for this so the two stay in sync. */}
                {visibleStatuses.map((stage, index, visibleStages) => (
                  <div key={stage} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`crm-stage-dot ${index <= stageIndex ? 'crm-stage-dot-active' : ''}`}>{index + 1}</div>
                      {index < visibleStages.length - 1 && <div className={`crm-stage-line ${index < stageIndex ? 'crm-stage-line-active' : ''}`} />}
                    </div>
                    <div className="pt-1">
                      <div className={`text-sm font-semibold ${index <= stageIndex ? 'text-theme-primary' : 'text-theme-muted'}`}>{stage}</div>
                      <div className="mt-1 text-xs text-theme-secondary">{index === stageIndex ? 'Current stage' : 'Pending stage'}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Every action triggers a toast and logs itself into the timeline.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3">
                <QuickActionButton label="Send WhatsApp" icon={<MessageCircleMore className="h-4 w-4" />} onClick={() => handleQuickAction('whatsapp')} />
                <QuickActionButton
                  label={appointmentLabel}
                  icon={<CalendarDays className="h-4 w-4" />}
                  onClick={() => {
                    // default to whoever already owns this lead — re-assigning
                    // the lead itself is a separate, deliberate action elsewhere;
                    // this only lets you override who handles this ONE visit
                    setAppointmentDraft((current) => ({
                      ...current,
                      assignedTo: assignedToId !== null ? assignedToName : '',
                    }))
                    setAppointmentDialogOpen(true)
                  }}
                />
                <QuickActionButton label="Send Payment Link" icon={<CreditCard className="h-4 w-4" />} onClick={() => handleQuickAction('payment')} />
                <QuickActionButton label="Log a Call" icon={<Phone className="h-4 w-4" />} onClick={() => handleQuickAction('call')} />
                <QuickActionButton label="Convert" icon={<UserCheck className="h-4 w-4" />} onClick={() => handleQuickAction('convert')} />
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>

      <Modal
        open={followUpDialogOpen}
        title="Add Follow-up"
        description="Schedule the next lead touchpoint."
        onClose={() => setFollowUpDialogOpen(false)}
        footer={(
          <>
            <button type="button" className="btn-ghost" onClick={() => setFollowUpDialogOpen(false)}>Cancel</button>
            <button type="button" className="btn-primary" onClick={addFollowUp}>Save Follow-up</button>
          </>
        )}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <EditableField label="Follow-up Type">
            <select className="crm-field-input" value={followUpDraft.type} onChange={(event) => setFollowUpDraft((current) => ({ ...current, type: event.target.value as LeadFollowUpItem['type'] }))}>
              {(['Call', 'WhatsApp', 'Email'] as LeadFollowUpItem['type'][]).map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </EditableField>
          <EditableField label="Assigned Staff">
            <select className="crm-field-input" value={followUpDraft.assignedStaff} onChange={(event) => setFollowUpDraft((current) => ({ ...current, assignedStaff: event.target.value }))}>
              {orgUsers.length === 0
                ? <option value={followUpDraft.assignedStaff}>{followUpDraft.assignedStaff}</option>
                : orgUsers.map((user) => (
                    <option key={user.id} value={user.username || user.email}>
                      {user.username || user.email}
                    </option>
                  ))}
            </select>
          </EditableField>
          <EditableField label="Date & Time" fullWidth>
            <input className="crm-field-input" type="datetime-local" value={followUpDraft.scheduledAt} onChange={(event) => setFollowUpDraft((current) => ({ ...current, scheduledAt: event.target.value }))} />
          </EditableField>
          <EditableField label="Notes" fullWidth>
            <textarea className="crm-field-input min-h-28 resize-y" value={followUpDraft.notes} onChange={(event) => setFollowUpDraft((current) => ({ ...current, notes: event.target.value }))} />
          </EditableField>
        </div>
      </Modal>

      <Modal
        open={appointmentDialogOpen}
        title={appointmentLabel}
        description="Defaults to the lead's assigned staff — change only if someone else is handling this specific visit."
        onClose={() => setAppointmentDialogOpen(false)}
        footer={(
          <>
            <button type="button" className="btn-ghost" onClick={() => setAppointmentDialogOpen(false)}>Cancel</button>
            <button type="button" className="btn-primary" onClick={bookAppointment}>Confirm</button>
          </>
        )}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <EditableField label="Conducted By">
            <select
              className="crm-field-input"
              value={appointmentDraft.assignedTo}
              onChange={(event) => setAppointmentDraft((current) => ({ ...current, assignedTo: event.target.value }))}
            >
              <option value="">Unassigned</option>
              {orgUsers.length === 0 && profile.assignedStaff && (
                <option value={profile.assignedStaff}>{profile.assignedStaff}</option>
              )}
              {orgUsers.map((user) => (
                <option key={user.id} value={user.username || user.email}>
                  {user.username || user.email}
                </option>
              ))}
            </select>
          </EditableField>
          <EditableField label="Date & Time">
            <input className="crm-field-input" type="datetime-local" value={appointmentDraft.scheduledAt} onChange={(event) => setAppointmentDraft((current) => ({ ...current, scheduledAt: event.target.value }))} />
          </EditableField>
        </div>
      </Modal>

      <Modal
        open={callDialogOpen}
        title="Log a Call"
        description="Record what was actually discussed — this is what shows up in the timeline, not a generic note."
        onClose={() => setCallDialogOpen(false)}
        footer={(
          <>
            <button type="button" className="btn-ghost" onClick={() => setCallDialogOpen(false)}>Cancel</button>
            <button type="button" className="btn-primary" onClick={logCall}>Save Call</button>
          </>
        )}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <EditableField label="Outcome">
            <select
              className="crm-field-input"
              value={callDraft.outcome}
              onChange={(event) => setCallDraft((current) => ({ ...current, outcome: event.target.value as typeof current.outcome }))}
            >
              {(['Connected', 'No Answer', 'Call Back Later', 'Not Interested'] as const).map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </EditableField>
          <EditableField label="Notes" fullWidth>
            <textarea
              className="crm-field-input min-h-28 resize-y"
              placeholder="What was discussed? Any next steps?"
              value={callDraft.notes}
              onChange={(event) => setCallDraft((current) => ({ ...current, notes: event.target.value }))}
            />
          </EditableField>
        </div>
      </Modal>

      <Modal
        open={whatsappDialogOpen}
        title="Send WhatsApp"
        description="Record the message you sent — this is logged exactly as typed, not a placeholder."
        onClose={() => setWhatsappDialogOpen(false)}
        footer={(
          <>
            <button type="button" className="btn-ghost" onClick={() => setWhatsappDialogOpen(false)}>Cancel</button>
            <button type="button" className="btn-primary" onClick={sendWhatsapp}>Log Message</button>
          </>
        )}
      >
        <div className="grid gap-4">
          <EditableField label="Message" fullWidth>
            <textarea
              className="crm-field-input min-h-28 resize-y"
              placeholder="Type the message you sent to this lead..."
              value={whatsappDraft.message}
              onChange={(event) => setWhatsappDraft({ message: event.target.value })}
            />
          </EditableField>
        </div>
      </Modal>

      {toastMessage && <Toast message={toastMessage} />}
    </div>
  )
}

// ── NEW: renders the correct input type for any schema column ──────────
function SchemaFieldInput({
  col,
  value,
  onChange,
  disabled,
}: {
  col: LeadColumn
  value: string | number
  onChange: (v: string | number) => void
  disabled?: boolean
}) {
  if (col.type === 'select' && col.options) {
    return (
      <select className="crm-field-input" value={String(value)} onChange={(e) => onChange(e.target.value)} disabled={disabled}>
        {col.options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    )
  }
  if (col.type === 'currency' || col.type === 'number') {
    return (
      <input
        className="crm-field-input"
        type="number"
        value={String(value ?? '')}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
      />
    )
  }
  if (col.type === 'date') {
    return (
      <input
        className="crm-field-input"
        type="date"
        value={String(value ?? '')}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    )
  }
  return (
    <input
      className="crm-field-input"
      type={col.type === 'email' ? 'email' : col.type === 'phone' ? 'tel' : 'text'}
      value={String(value ?? '')}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
  )
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">{children}</CardContent>
    </Card>
  )
}

function EditableField({
  label,
  children,
  fullWidth,
  saving,
}: {
  label: string
  children: ReactNode
  fullWidth?: boolean
  saving?: boolean
}) {
  return (
    <label className={fullWidth ? 'sm:col-span-2' : undefined}>
      <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-theme-secondary">
        {label}
        {saving && <span style={{ fontSize: '10px', color: '#3b82f6' }}>saving…</span>}
      </span>
      {children}
    </label>
  )
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-theme-secondary">{label}</div>
      <div className="mt-2 text-sm font-semibold text-theme-primary">{value}</div>
    </div>
  )
}

function CounterBadge({
  label,
  value,
  tone = 'blue',
}: {
  label: string
  value: number
  tone?: 'blue' | 'rose'
}) {
  return (
    <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${tone === 'rose' ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-blue-200 bg-blue-50 text-blue-700'}`}>
      <span>{label}</span>
      <span className="rounded-full bg-white/80 px-2 py-0.5 text-[11px]">{value}</span>
    </div>
  )
}

function FollowUpCard({
  item,
  actionLabel,
  onAction,
}: {
  item: LeadFollowUpItem
  actionLabel?: string
  onAction?: () => void
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-theme-surface p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={item.status === 'Completed' ? 'emerald' : 'amber'}>{item.status}</Badge>
            <Badge tone="slate">{item.type}</Badge>
          </div>
          <div className="text-sm font-semibold text-theme-primary">{item.assignedStaff}</div>
          <div className="text-sm text-theme-secondary">{item.notes}</div>
          <div className="text-xs uppercase tracking-[0.18em] text-theme-muted">
            {formatDateLabel(item.scheduledAt)} • {formatTimeLabel(item.scheduledAt)}
          </div>
        </div>
        {actionLabel && onAction && (
          <button type="button" className="btn-ghost" onClick={onAction}>
            <CheckCircle2 className="h-4 w-4" />
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  )
}

function ActionPill({
  label,
  icon,
  onClick,
  destructive,
}: {
  label: string
  icon: ReactNode
  onClick: () => void
  destructive?: boolean
}) {
  return (
    <button
      type="button"
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition ${destructive ? 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100' : 'border-slate-200 bg-white text-theme-primary hover:border-slate-300 hover:bg-theme-surface'}`}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  )
}

function QuickActionButton({
  label,
  icon,
  onClick,
}: {
  label: string
  icon: ReactNode
  onClick: () => void
}) {
  return (
    <button type="button" className="crm-quick-action-btn" onClick={onClick}>
      <span className="icon-wrapper">{icon}</span>
      <span>{label}</span>
    </button>
  )
}

function Modal({
  open,
  title,
  description,
  children,
  footer,
  onClose,
}: {
  open: boolean
  title: string
  description: string
  children: ReactNode
  footer: ReactNode
  onClose: () => void
}) {
  useEffect(() => {
    if (!open) return
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onEscape)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onEscape)
    }
  }, [onClose, open])

  if (!open) return null

  return createPortal(
    <div className="crm-modal-shell">
      <div className="crm-modal-backdrop" onClick={onClose} />
      <div className="crm-modal-card">
        <div className="border-b border-slate-200 px-6 py-5">
          <h3 className="text-lg font-semibold text-theme-primary">{title}</h3>
          <p className="mt-1 text-sm text-theme-secondary">{description}</p>
        </div>
        <div className="px-6 py-5">{children}</div>
        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">{footer}</div>
      </div>
    </div>,
    document.body
  )
}

function Toast({ message }: { message: string }) {
  return createPortal(
    <div className="crm-toast">
      <CheckCircle2 className="h-5 w-5" />
      <span>{message}</span>
    </div>,
    document.body
  )
}