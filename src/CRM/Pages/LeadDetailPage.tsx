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

import { Avatar } from '../../components/ui/avatar'
import { Badge } from '../../components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Progress } from '../../components/ui/progress'
import { ScrollArea } from '../../components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { getLeadDetailSeed, getLeadIdFromRow, type LeadDocumentItem, type LeadFollowUpItem, type LeadProfileForm, type LeadStage, type LeadTimelineItem, type TimelineActivityType } from '../data/leadDetail'
import { leadsByIndustry } from '../data/leads'
import { formatINR } from '../lib/format'
import { useCurrentIndustry, useIndustryStore } from '../store/industryStore'
import './LeadDetailPage.css'

const crmStages: LeadStage[] = ['New', 'Contacted', 'Booked', 'Visited', 'Closed/Won']

const stageTone: Record<LeadStage, 'blue' | 'amber' | 'violet' | 'emerald' | 'rose'> = {
  New: 'blue',
  Contacted: 'amber',
  Booked: 'violet',
  Visited: 'emerald',
  'Closed/Won': 'rose',
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

const genderOptions = ['Female', 'Male', 'Other']
const followUpTypeOptions: LeadFollowUpItem['type'][] = ['Call', 'WhatsApp', 'Email']
const staffOptions = ['Nisha Verma', 'Rahul Menon', 'Aditi Kapoor', 'Dr. Mehta']
let leadDetailCounter = 0

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function formatDateLabel(value: string) {
  return new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatTimeLabel(value: string) {
  return new Date(value).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })
}

function nextLeadDetailId(prefix: string) {
  leadDetailCounter += 1
  return `${prefix}-${leadDetailCounter}`
}

function resolveStatusForSchema(nextStage: LeadStage, statuses: string[]) {
  const exact = statuses.find((status) => status.toLowerCase() === nextStage.toLowerCase())
  if (exact) return exact

  switch (nextStage) {
    case 'Contacted':
      return statuses.find((status) => ['contacted', 'follow-up', 'followup', 'discovery', 'quoted', 'counselled', 'trial'].includes(status.toLowerCase())) ?? statuses[0]
    case 'Booked':
      return statuses.find((status) => ['booked', 'confirmed', 'proposal', 'site visit', 'admission offered', 'negotiation'].includes(status.toLowerCase())) ?? statuses[0]
    case 'Visited':
      return statuses.find((status) => ['visited', 'checked-in', 'admitted', 'activated', 'shipped'].includes(status.toLowerCase())) ?? statuses[0]
    case 'Closed/Won':
      return statuses.find((status) => ['closed', 'won', 'signed', 'ordered', 'po received'].includes(status.toLowerCase())) ?? statuses[0]
    default:
      return statuses[0]
  }
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
      return { icon: <FileText className="h-4 w-4" />, color: 'text-slate-600', bg: 'bg-slate-100' }
    default:
      return { icon: <Pill className="h-4 w-4" />, color: 'text-slate-600', bg: 'bg-slate-100' }
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

export default function LeadDetailPage() {
  const navigate = useNavigate()
  const { leadId = '' } = useParams()
  // Extract industry from the leadId prefix (e.g. "realestate-lead-1" -> "realestate")
  const urlIndustryKey = leadId ? (leadId.split('-')[0] as keyof typeof leadsByIndustry) : null
  const isValidUrlIndustry = urlIndustryKey && Object.keys(leadsByIndustry).includes(urlIndustryKey)
  
  const currentStoreIndustry = useCurrentIndustry()
  const industryKey = isValidUrlIndustry ? urlIndustryKey : currentStoreIndustry.key
  
  // Select stable state slices rather than calling getLeads() inside the selector.
  // Calling a function inside a Zustand selector returns a new reference on every call,
  // which makes Object.is always return false → infinite re-render loop.
  const getLeads = useIndustryStore((state) => state.getLeads)
  const leadsOverrides = useIndustryStore((state) => state.leadsOverrides)
  const rows = useMemo(() => getLeads(industryKey), [getLeads, leadsOverrides, industryKey])

  const schema = leadsByIndustry[industryKey].schema
  const rowIndex = rows.findIndex((row, index) => getLeadIdFromRow(row, industryKey, index) === leadId)
  const leadRow = rowIndex >= 0 ? rows[rowIndex] : null

  const getLeadInteractions = useIndustryStore((state) => state.getLeadInteractions)
  // Include leadInteractions in deps so savedInteractions refreshes when the store slice changes.
  const leadInteractions = useIndustryStore((state) => state.leadInteractions)
  const savedInteractions = useMemo(
    () => (leadId ? getLeadInteractions(industryKey, leadId) : []),
    [getLeadInteractions, leadInteractions, industryKey, leadId]
  )
  const seed = useMemo(
    () => (leadRow ? getLeadDetailSeed(leadRow, industryKey, savedInteractions) : null),
    [industryKey, leadRow, savedInteractions]
  )

  if (!leadRow || !seed) {
    return (
      <div className="p-6 lg:p-8">
        <Card className="mx-auto max-w-2xl">
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <div className="rounded-2xl bg-slate-100 p-4 text-slate-500">
              <UserCheck className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Lead not found</h2>
              <p className="mt-2 text-sm text-slate-500">
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
    />
  )
}

function LeadDetailWorkspace({
  industryKey,
  leadId,
  rowIndex,
  schema,
  seed,
}: {
  industryKey: keyof typeof leadsByIndustry
  leadId: string
  rowIndex: number
  schema: (typeof leadsByIndustry)[keyof typeof leadsByIndustry]['schema']
  seed: ReturnType<typeof getLeadDetailSeed>
}) {
  const navigate = useNavigate()
  const updateLead = useIndustryStore((state) => state.updateLead)
  const addLeadInteraction = useIndustryStore((state) => state.addLeadInteraction)
  const [activeTab, setActiveTab] = useState('profile')
  const [profile, setProfile] = useState<LeadProfileForm>(seed.profile)
  const [timeline, setTimeline] = useState<LeadTimelineItem[]>(() => [...seed.timeline].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)))
  const [pendingFollowUps, setPendingFollowUps] = useState<LeadFollowUpItem[]>(seed.pendingFollowUps)
  const [completedFollowUps, setCompletedFollowUps] = useState<LeadFollowUpItem[]>(seed.completedFollowUps)
  const [documents, setDocuments] = useState<LeadDocumentItem[]>(seed.documents)
  const [score] = useState(seed.score)
  const [estimatedValue] = useState(seed.estimatedValue)
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
    notes: 'Check patient readiness and reconfirm appointment preference.',
  })
  const [appointmentDraft, setAppointmentDraft] = useState({
    doctor: 'Dr. Mehta',
    scheduledAt: '2026-05-24T11:30',
  })
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!toastMessage) return
    const timeout = window.setTimeout(() => setToastMessage(null), 2800)
    return () => window.clearTimeout(timeout)
  }, [toastMessage])

  const unreadCount = timeline.filter((item) => item.unread).length
  const stageIndex = crmStages.indexOf(profile.status)

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

  const syncProfileField = (field: keyof LeadProfileForm, value: string) => {
    setProfile((current) => (current ? { ...current, [field]: value } : current))

    if (rowIndex < 0) return
    const mappedField: Partial<Record<keyof LeadProfileForm, string>> = {
      fullName: 'name',
      phone: 'phone',
      email: 'email',
      specialty: 'condition',
      preferredDoctor: 'doctor',
      preferredDate: 'appointment',
      leadSource: 'source',
    }
    const rowField = mappedField[field]
    if (rowField) {
      updateLead(industryKey, rowIndex, rowField, value)
    }
  }

  const pushToast = (message: string) => {
    setToastMessage(message)
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
  }

  const updateStatus = (nextStatus: LeadStage) => {
    if (nextStatus === profile.status) return
    const previous = profile.status
    syncProfileField('status', nextStatus)
    updateLead(industryKey, rowIndex, 'status', resolveStatusForSchema(nextStatus, schema.statuses))
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
      registerInteraction(
        'whatsapp',
        'WhatsApp sent',
        'Shared treatment overview and consultation availability via WhatsApp.',
        profile.assignedStaff,
        { interactionType: 'Outbound WhatsApp', interactionChannel: 'WhatsApp', interactionOutcome: 'Sent' }
      )
      pushToast('WhatsApp sent successfully')
      return
    }

    if (action === 'payment') {
      registerInteraction(
        'payment',
        'Payment link sent',
        'Secure payment link sent for consultation advance.',
        'Finance Desk',
        { interactionType: 'Payment Link', interactionChannel: 'SMS', interactionOutcome: 'Sent' }
      )
      pushToast('Payment link sent successfully')
      return
    }

    if (action === 'call') {
      registerInteraction(
        'call',
        'Call logged',
        'Call completed with patient. Discussed consultation timings and readiness.',
        profile.assignedStaff,
        { interactionType: 'Outbound Call', interactionChannel: 'Phone', interactionOutcome: 'Connected' }
      )
      pushToast('Call logged successfully')
      return
    }

    updateStatus('Closed/Won')
    registerInteraction(
      'system',
      'Lead converted to patient',
      'Lead has been marked as converted and moved into patient workflow.',
      profile.assignedStaff,
      { interactionType: 'Conversion', interactionChannel: 'CRM', interactionOutcome: 'Converted' }
    )
    pushToast('Lead converted to patient')
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
    const followUp: LeadFollowUpItem = {
      id: nextLeadDetailId('followup'),
      type: followUpDraft.type,
      assignedStaff: followUpDraft.assignedStaff,
      scheduledAt: new Date(followUpDraft.scheduledAt).toISOString(),
      status: 'Pending',
      notes: followUpDraft.notes,
    }
    setPendingFollowUps((current) => [followUp, ...current])
    registerInteraction(
      'followup',
      'Follow-up scheduled',
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
    registerInteraction(
      'followup',
      'Follow-up completed',
      `${followUp.type} follow-up completed by ${followUp.assignedStaff}.`,
      followUp.assignedStaff,
      { interactionType: 'Follow-up', interactionChannel: followUp.type, interactionOutcome: 'Completed' }
    )
    pushToast('Follow-up marked as completed')
  }

  const bookAppointment = () => {
    syncProfileField('preferredDoctor', appointmentDraft.doctor)
    syncProfileField('preferredDate', appointmentDraft.scheduledAt.slice(0, 10))
    syncProfileField('preferredTime', appointmentDraft.scheduledAt.slice(11, 16))
    updateStatus('Booked')
    registerInteraction(
      'appointment',
      'Appointment booked',
      `Booked with ${appointmentDraft.doctor} for ${formatDateLabel(appointmentDraft.scheduledAt)} at ${formatTimeLabel(appointmentDraft.scheduledAt)}.`,
      profile.assignedStaff,
      { interactionType: 'Appointment Booking', interactionChannel: 'CRM', interactionOutcome: 'Booked' }
    )
    setAppointmentDialogOpen(false)
    pushToast('Appointment booked successfully')
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
        'document',
        'Document uploaded',
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
        'document',
        'Document deleted',
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

  return (
    <div className="lead-detail-shell px-4 py-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Link to="/leads" className="transition hover:text-slate-900">Lead Capture</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="font-medium text-slate-900">{profile.fullName}</span>
            </div>
            <button type="button" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900" onClick={() => navigate('/leads')}>
              <ArrowLeft className="h-4 w-4" />
              Back to Lead Capture
            </button>
          </div>
          <button type="button" className="btn-ghost">
            <UserRoundPen className="h-4 w-4" />
            Edit
          </button>
        </div>

        <Card className="crm-glass-header overflow-visible">
          <CardContent className="grid gap-6 p-6 lg:p-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.8fr)]">
            <div className="space-y-6">
              <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex items-start gap-5">
                  <Avatar className="h-16 w-16 border-4 border-white shadow-sm text-lg">{getInitials(profile.fullName)}</Avatar>
                  <div className="space-y-2.5">
                    <div className="flex flex-wrap items-center gap-3">
                      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 drop-shadow-sm">{profile.fullName}</h1>
                      <Badge tone={stageTone[profile.status]}>{profile.status}</Badge>
                      {unreadCount > 0 && <Badge tone="rose">{unreadCount} unread</Badge>}
                    </div>
                    <div className="flex flex-wrap gap-5 text-sm font-medium text-slate-600">
                      <span className="inline-flex items-center gap-2 bg-white/60 px-2.5 py-1 rounded-md backdrop-blur-sm"><Phone className="h-4 w-4 text-slate-400" />{profile.phone}</span>
                      <span className="inline-flex items-center gap-2 bg-white/60 px-2.5 py-1 rounded-md backdrop-blur-sm"><Mail className="h-4 w-4 text-slate-400" />{profile.email}</span>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Card className="border border-white/60 bg-white/70 backdrop-blur-md shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:bg-white/90">
                    <CardContent className="space-y-3 p-5">
                      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-slate-500">
                        <span>Lead Score</span>
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">{score}/100</span>
                      </div>
                      <Progress value={score} className="h-2" />
                      <p className="text-[13px] text-slate-500 font-medium">High-intent profile with strong appointment probability.</p>
                    </CardContent>
                  </Card>
                  <Card className="border border-indigo-900/10 bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-900/20">
                    <CardContent className="space-y-2.5 p-5">
                      <div className="text-[11px] font-bold uppercase tracking-widest text-indigo-200/80">Estimated Value</div>
                      <div className="text-3xl font-extrabold tracking-tight drop-shadow-md">{formatINR(estimatedValue)}</div>
                      <p className="text-[13px] text-indigo-100/70 font-medium">Expected consultation and treatment revenue.</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <MetricCard label="Created" value={formatDateLabel(createdDate)} />
              <MetricCard label="Last Activity" value={`${formatDateLabel(lastActivity)} • ${formatTimeLabel(lastActivity)}`} />
              <MetricCard label="Campaign" value={profile.campaignName} />
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
                <div className="grid gap-5 lg:grid-cols-2">
                  <SectionCard title="Patient Information" description="Editable patient basics that sync with the lead record.">
                    <EditableField label="Full Name">
                      <input className="crm-field-input" value={profile.fullName} onChange={(event) => syncProfileField('fullName', event.target.value)} />
                    </EditableField>
                    <EditableField label="Phone">
                      <input className="crm-field-input" value={profile.phone} onChange={(event) => syncProfileField('phone', event.target.value)} />
                    </EditableField>
                    <EditableField label="Email">
                      <input className="crm-field-input" value={profile.email} onChange={(event) => syncProfileField('email', event.target.value)} />
                    </EditableField>
                    <EditableField label="Gender">
                      <select className="crm-field-input" value={profile.gender} onChange={(event) => syncProfileField('gender', event.target.value)}>
                        {genderOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                      </select>
                    </EditableField>
                    <EditableField label="DOB">
                      <input className="crm-field-input" type="date" value={profile.dob} onChange={(event) => syncProfileField('dob', event.target.value)} />
                    </EditableField>
                    <EditableField label="City">
                      <input className="crm-field-input" value={profile.city} onChange={(event) => syncProfileField('city', event.target.value)} />
                    </EditableField>
                  </SectionCard>

                  <SectionCard title="Medical Concern" description="Consultation preference and concern details for the team.">
                    <EditableField label="Specialty">
                      <input className="crm-field-input" value={profile.specialty} onChange={(event) => syncProfileField('specialty', event.target.value)} />
                    </EditableField>
                    <EditableField label="Preferred Doctor">
                      <select className="crm-field-input" value={profile.preferredDoctor} onChange={(event) => syncProfileField('preferredDoctor', event.target.value)}>
                        {['Dr. Mehta', 'Dr. Sharma', 'Dr. Iyer', 'Dr. Khan', 'Any Available'].map((doctor) => <option key={doctor} value={doctor}>{doctor}</option>)}
                      </select>
                    </EditableField>
                    <EditableField label="Preferred Date">
                      <input className="crm-field-input" type="date" value={profile.preferredDate} onChange={(event) => syncProfileField('preferredDate', event.target.value)} />
                    </EditableField>
                    <EditableField label="Preferred Time">
                      <input className="crm-field-input" type="time" value={profile.preferredTime} onChange={(event) => syncProfileField('preferredTime', event.target.value)} />
                    </EditableField>
                    <EditableField label="Concern Notes" fullWidth>
                      <textarea className="crm-field-input min-h-28 resize-y" value={profile.concernNotes} onChange={(event) => syncProfileField('concernNotes', event.target.value)} />
                    </EditableField>
                  </SectionCard>

                  <SectionCard title="Lead Information" description="Source, assignment, and conversion-driving fields.">
                    <EditableField label="Lead Source">
                      <select className="crm-field-input" value={profile.leadSource} onChange={(event) => syncProfileField('leadSource', event.target.value)}>
                        {schema.sources.map((source) => <option key={source} value={source}>{source}</option>)}
                      </select>
                    </EditableField>
                    <EditableField label="Campaign Name">
                      <input className="crm-field-input" value={profile.campaignName} onChange={(event) => syncProfileField('campaignName', event.target.value)} />
                    </EditableField>
                    <EditableField label="Assigned Staff">
                      <select className="crm-field-input" value={profile.assignedStaff} onChange={(event) => syncProfileField('assignedStaff', event.target.value)}>
                        {staffOptions.map((staff) => <option key={staff} value={staff}>{staff}</option>)}
                      </select>
                    </EditableField>
                    <EditableField label="Status">
                      <select className="crm-field-input" value={profile.status} onChange={(event) => updateStatus(event.target.value as LeadStage)}>
                        {crmStages.map((status) => <option key={status} value={status}>{status}</option>)}
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
                        <CardDescription>Every interaction across calls, messages, payments, appointments, and notes lands here automatically.</CardDescription>
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
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Add internal note</label>
                        <textarea
                          className="crm-field-input min-h-24 resize-y bg-white"
                          placeholder="Capture objection handling, insurance notes, visit readiness, or anything the next staff member should know."
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
                          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          <input
                            className="crm-field-input pl-9"
                            placeholder="Search activity"
                            value={timelineSearch}
                            onChange={(event) => setTimelineSearch(event.target.value)}
                          />
                        </div>
                        <div className="relative">
                          <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
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
                                        <h4 className="text-sm font-semibold text-slate-900">{item.title}</h4>
                                        {item.unread && <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />}
                                      </div>
                                      <p className="mt-1 text-sm leading-6 text-slate-600">{item.description}</p>
                                    </div>
                                    <Badge tone="slate">{item.actor}</Badge>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
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
                      <CardDescription>Insurance cards, reports, payment estimates, and uploaded evidence.</CardDescription>
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
                      onDragEnter={(event) => {
                        event.preventDefault()
                        setDragActive(true)
                      }}
                      onDragLeave={(event) => {
                        event.preventDefault()
                        setDragActive(false)
                      }}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={onDropDocuments}
                    >
                      <UploadCloud className="h-8 w-8 text-blue-600" />
                      <div>
                        <div className="text-base font-semibold text-slate-900">Drag & drop files here</div>
                        <p className="mt-1 text-sm text-slate-500">Supports PDF, images, and Excel files.</p>
                      </div>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                      {documents.map((document) => (
                        <Card key={document.id} className="border border-slate-200 shadow-sm">
                          <CardContent className="space-y-4 p-4">
                            <div className="flex items-start gap-3">
                              <div className="rounded-2xl bg-slate-100 p-3 text-slate-600">{getDocumentIcon(document.fileType)}</div>
                              <div className="min-w-0 flex-1">
                                <div className="truncate text-sm font-semibold text-slate-900">{document.fileName}</div>
                                <div className="mt-1 text-sm text-slate-500">{document.sizeLabel}</div>
                                <div className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-400">
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
                {crmStages.map((stage, index) => (
                  <div key={stage} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`crm-stage-dot ${index <= stageIndex ? 'crm-stage-dot-active' : ''}`}>{index + 1}</div>
                      {index < crmStages.length - 1 && <div className={`crm-stage-line ${index < stageIndex ? 'crm-stage-line-active' : ''}`} />}
                    </div>
                    <div className="pt-1">
                      <div className={`text-sm font-semibold ${index <= stageIndex ? 'text-slate-900' : 'text-slate-400'}`}>{stage}</div>
                      <div className="mt-1 text-xs text-slate-500">{index === stageIndex ? 'Current stage' : 'Pending stage'}</div>
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
                <QuickActionButton label="Book Appointment" icon={<CalendarDays className="h-4 w-4" />} onClick={() => setAppointmentDialogOpen(true)} />
                <QuickActionButton label="Send Payment Link" icon={<CreditCard className="h-4 w-4" />} onClick={() => handleQuickAction('payment')} />
                <QuickActionButton label="Log a Call" icon={<Phone className="h-4 w-4" />} onClick={() => handleQuickAction('call')} />
                <QuickActionButton label="Convert to Patient" icon={<UserCheck className="h-4 w-4" />} onClick={() => handleQuickAction('convert')} />
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
              {followUpTypeOptions.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </EditableField>
          <EditableField label="Assigned Staff">
            <select className="crm-field-input" value={followUpDraft.assignedStaff} onChange={(event) => setFollowUpDraft((current) => ({ ...current, assignedStaff: event.target.value }))}>
              {staffOptions.map((option) => <option key={option} value={option}>{option}</option>)}
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
        title="Book Appointment"
        description="Reserve the lead's preferred appointment slot."
        onClose={() => setAppointmentDialogOpen(false)}
        footer={(
          <>
            <button type="button" className="btn-ghost" onClick={() => setAppointmentDialogOpen(false)}>Cancel</button>
            <button type="button" className="btn-primary" onClick={bookAppointment}>Confirm Booking</button>
          </>
        )}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <EditableField label="Doctor">
            <select className="crm-field-input" value={appointmentDraft.doctor} onChange={(event) => setAppointmentDraft((current) => ({ ...current, doctor: event.target.value }))}>
              {['Dr. Mehta', 'Dr. Sharma', 'Dr. Iyer', 'Dr. Khan', 'Any Available'].map((doctor) => <option key={doctor} value={doctor}>{doctor}</option>)}
            </select>
          </EditableField>
          <EditableField label="Date & Time">
            <input className="crm-field-input" type="datetime-local" value={appointmentDraft.scheduledAt} onChange={(event) => setAppointmentDraft((current) => ({ ...current, scheduledAt: event.target.value }))} />
          </EditableField>
        </div>
      </Modal>

      {toastMessage && <Toast message={toastMessage} />}
    </div>
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
}: {
  label: string
  children: ReactNode
  fullWidth?: boolean
}) {
  return (
    <label className={fullWidth ? 'sm:col-span-2' : undefined}>
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</span>
      {children}
    </label>
  )
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</div>
      <div className="mt-2 text-sm font-semibold text-slate-900">{value}</div>
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
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={item.status === 'Completed' ? 'emerald' : 'amber'}>{item.status}</Badge>
            <Badge tone="slate">{item.type}</Badge>
          </div>
          <div className="text-sm font-semibold text-slate-900">{item.assignedStaff}</div>
          <div className="text-sm text-slate-500">{item.notes}</div>
          <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
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
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition ${destructive ? 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'}`}
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
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
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
