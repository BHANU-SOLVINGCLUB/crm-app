import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type Dispatch, type SetStateAction } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import clsx from 'clsx'
import {
  ArrowLeft,
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  FileImage,
  FileText,
  Mail,
  MessageSquare,
  Paperclip,
  Phone,
  Plus,
  Send,
  Target,
  TriangleAlert,
  UploadCloud,
  UserRound,
} from 'lucide-react'

import PageHeader from '../components/common/PageHeader'
import SectionHeader from '../components/common/SectionHeader'
import { fmt, pColor } from '../CRM/data/pipeline'
import { fetchDealActivities, createDealActivity, fetchDeals, updateDealApi, uiDealToApi } from '../api/sales'
import type { ApiDealActivity } from '../api/sales'
import { fetchOrgUsers } from '../api/leads'
import type { OrgUser } from '../api/leads'
import { usePlatformStore } from '../store/usePlatformStore'
import { useIndustryStore } from '../CRM/store/industryStore'
import './DealDetailPage.css'

type DealStageId =
  | 'lead' | 'contacted' | 'qualified' | 'proposal'
  | 'negotiation' | 'closed_won' | 'closed_lost'

type Priority = 'high' | 'medium' | 'low'
type TimelineType = 'created' | 'stage' | 'note' | 'task' | 'email' | 'call' | 'meeting'
type TaskStatus = 'Pending' | 'Completed' | 'Overdue'
type QuickActionType = 'email' | 'call' | 'meeting' | 'note'

type DealRecord = {
  id: number
  dealName: string
  companyName: string
  contactPerson: string
  contactEmail: string
  dealValue: number
  stage: DealStageId
  priority: Priority
  probability: number
  closeDate: string
  owner: string
  assignedTo: number | null
  sector: string
}

type TimelineItem = {
  id: string
  type: TimelineType
  title: string
  description: string
  actor: string
  createdAt: string
  activityId?: number
}

type TaskItem = {
  id: string
  title: string
  dueDate: string
  reminder: string
  status: TaskStatus
  owner: string
}

type NoteItem = {
  id: string
  text: string
  author: string
  createdAt: string
}

type AttachmentItem = {
  id: string
  fileName: string
  uploadedAt: string
  uploadedBy: string
  type: 'pdf' | 'docx' | 'image'
  downloadUrl?: string
}

type ComposerDraft = {
  type: QuickActionType
  title: string
  description: string
}

const STAGES: Array<{ id: DealStageId; label: string; probability: number; tone: string }> = [
  { id: 'lead',        label: 'New Lead',     probability: 15,  tone: '#64748b' },
  { id: 'contacted',   label: 'Contacted',    probability: 30,  tone: '#2563eb' },
  { id: 'qualified',   label: 'Qualified',    probability: 50,  tone: '#0f766e' },
  { id: 'proposal',    label: 'Proposal',     probability: 70,  tone: '#d97706' },
  { id: 'negotiation', label: 'Negotiation',  probability: 85,  tone: '#ea580c' },
  { id: 'closed_won',  label: 'Closed Won',   probability: 100, tone: '#16a34a' },
  { id: 'closed_lost', label: 'Closed Lost',  probability: 0,   tone: '#dc2626' },
]

let localCounter = 0
function nextId(prefix: string) {
  localCounter += 1
  return `${prefix}-${localCounter}`
}

function normalizeStage(stage: string): DealStageId {
  if (stage === 'closed') return 'closed_won'
  if (stage === 'lost')   return 'closed_lost'
  return (stage as DealStageId) ?? 'lead'
}

// DealStageId uses 'closed_won'/'closed_lost' internally, but the
// backend Deal.stage field only has 'closed'/'lost'
function normalizeBackStage(stage: DealStageId): string {
  if (stage === 'closed_won')  return 'closed'
  if (stage === 'closed_lost') return 'lost'
  return stage
}

function mapActivityTypeToTimeline(type: string): TimelineType {
  if (type === 'email')        return 'email'
  if (type === 'call')         return 'call'
  if (type === 'meeting')      return 'meeting'
  if (type === 'note')         return 'note'
  if (type === 'stage_change') return 'stage'
  return 'note'
}

function formatDateLabel(value: string | undefined | null) {
  if (!value) return 'N/A'
  const d = new Date(value)
  if (isNaN(d.getTime())) return 'Invalid Date'
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatDateTimeLabel(value: string | undefined | null) {
  if (!value) return 'N/A'
  const d = new Date(value)
  if (isNaN(d.getTime())) return 'Invalid Date'
  return d.toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' })
}

function daysUntil(date: string | undefined | null) {
  if (!date) return 0
  const target = new Date(date)
  if (isNaN(target.getTime())) return 0
  return Math.ceil((target.getTime() - Date.now()) / 864e5)
}

function getTimelineIcon(type: TimelineType) {
  switch (type) {
    case 'email':   return <Mail className="h-4 w-4" />
    case 'call':    return <Phone className="h-4 w-4" />
    case 'meeting': return <CalendarDays className="h-4 w-4" />
    case 'note':    return <MessageSquare className="h-4 w-4" />
    case 'task':    return <CheckCircle2 className="h-4 w-4" />
    case 'stage':   return <Target className="h-4 w-4" />
    default:        return <Paperclip className="h-4 w-4" />
  }
}

function getAttachmentIcon(type: AttachmentItem['type']) {
  return type === 'image' ? <FileImage className="h-5 w-5" /> : <FileText className="h-5 w-5" />
}

function deriveStatus(task: Pick<TaskItem, 'status' | 'dueDate'>): TaskStatus {
  if (task.status === 'Completed') return 'Completed'
  return daysUntil(task.dueDate) < 0 ? 'Overdue' : 'Pending'
}

function getDefaultComposer(type: QuickActionType): Pick<ComposerDraft, 'title' | 'description'> {
  if (type === 'email')   return { title: 'Email Sent',        description: 'Shared revised pricing proposal and onboarding details.' }
  if (type === 'call')    return { title: 'Call Logged',       description: 'Reviewed buyer objections, timeline, and procurement next steps.' }
  if (type === 'meeting') return { title: 'Meeting Scheduled', description: 'Booked a follow-up meeting with decision makers for commercial review.' }
  return                         { title: 'Note Added',        description: 'Captured fresh customer context for the next rep handoff.' }
}

// ── Entry point ───────────────────────────────────────────────────────
// Previously this page trusted INITIAL_DEALS (a hardcoded sample array)
// as a fallback when location.state was missing, which crashed once
// that array was emptied. It also trusted location.state.deal.id blindly,
// which could be `undefined` if the backend's create-deal response was
// ever missing the new deal's real id (a bug also fixed separately in
// DealCreateSerializer). This version always verifies against a real
// backend fetch, so a missing/incorrect id no longer breaks navigation.
export default function DealDetailPage() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { dealId = '' } = useParams()
  const authUser    = usePlatformStore((s) => s.authUser)
  const orgId       = authUser?.organization ?? null
  const industryKey = useIndustryStore((s) => s.current)

  const dealFromState = location.state?.deal as Partial<DealRecord> | undefined
  const parsedId = Number(dealId)

  const [deal,    setDeal]    = useState<DealRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)
  const [orgUsers, setOrgUsers] = useState<OrgUser[]>([])

  useEffect(() => {
    if (!parsedId || Number.isNaN(parsedId)) { setLoading(false); return }
    if (!orgId) { setLoading(false); return }

    // seed instantly from navigation state if present, for fast first paint
    if (dealFromState) {
      setDeal({
        id:            parsedId,
        dealName:      dealFromState.dealName      ?? `Deal #${parsedId}`,
        companyName:   dealFromState.companyName   ?? '',
        contactPerson: dealFromState.contactPerson ?? '',
        contactEmail:  dealFromState.contactEmail  ?? '',
        dealValue:     dealFromState.dealValue     ?? 0,
        stage:         dealFromState.stage         ?? 'lead',
        priority:      dealFromState.priority      ?? 'medium',
        probability:   dealFromState.probability   ?? 30,
        closeDate:     dealFromState.closeDate     ?? '',
        owner:         dealFromState.owner         ?? '',
        assignedTo:    null,
        sector:        '',
      })
      setLoading(false)
    }

    // ALWAYS verify against the real backend — this is what actually
    // fixes both the crash (no more reliance on a hardcoded array) and
    // the "Deal not found right after creating" issue (a stale/missing
    // id from navigation state gets corrected here against real data)
    fetchDeals(orgId, { industry: industryKey })
      .then((deals) => {
        const found = deals.find((d) => d.id === parsedId)
        if (!found) {
          if (!dealFromState) setError('Deal not found')
          setLoading(false)
          return
        }
        setDeal({
          id:            found.id,
          dealName:      dealFromState?.dealName ?? `${found.company} Expansion`,
          companyName:   found.company,
          contactPerson: found.contact,
          contactEmail:  found.email,
          dealValue:     Number(found.value),
          stage:         normalizeStage(found.stage),
          priority:      found.priority,
          probability:   found.prob,
          closeDate:     found.close_date ?? '',
          owner:         '',
          assignedTo:    found.assigned_to,
          sector:        found.sector,
        })
        setLoading(false)
      })
      .catch(() => {
        if (!dealFromState) setError('Could not load deal from backend.')
        setLoading(false)
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsedId, orgId])

  useEffect(() => {
    if (!orgId) return
    fetchOrgUsers(orgId).then(setOrgUsers).catch(() => setOrgUsers([]))
  }, [orgId])

  if (!parsedId || Number.isNaN(parsedId)) {
    return (
      <div className="p-6 lg:p-8">
        <div className="card mx-auto max-w-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-theme-primary">Deal not found</h2>
          <p className="mt-3 text-sm text-theme-secondary">This deal link is invalid or no longer available.</p>
          <button type="button" className="btn-primary mt-6" onClick={() => navigate('/sales')}>
            <ArrowLeft className="h-4 w-4" /> Back to Sales Pipeline
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="card mx-auto max-w-xl p-8 text-center text-theme-secondary">Loading deal…</div>
      </div>
    )
  }

  if (error || !deal) {
    return (
      <div className="p-6 lg:p-8">
        <div className="card mx-auto max-w-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-theme-primary">Deal not found</h2>
          <p className="mt-3 text-sm text-theme-secondary">{error ?? 'This deal may have been deleted.'}</p>
          <button type="button" className="btn-primary mt-6" onClick={() => navigate('/sales')}>
            <ArrowLeft className="h-4 w-4" /> Back to Sales Pipeline
          </button>
        </div>
      </div>
    )
  }

  return <DealDetailWorkspace deal={deal} setDeal={setDeal} orgId={orgId} orgUsers={orgUsers} industryKey={industryKey} />
}

// ── Workspace ─────────────────────────────────────────────────────────
function DealDetailWorkspace({
  deal, setDeal, orgId, orgUsers, industryKey,
}: {
  deal: DealRecord
  setDeal: Dispatch<SetStateAction<DealRecord | null>>
  orgId: number | null
  orgUsers: OrgUser[]
  industryKey: string
}) {
  const ownerName = useCallback((assignedTo: number | null) => {
    if (!assignedTo) return 'Unassigned'
    const user = orgUsers.find((u) => u.id === assignedTo)
    return user ? (user.username || user.email) : 'Unassigned'
  }, [orgUsers])

  const [timeline,        setTimeline]        = useState<TimelineItem[]>([])
  const [loadingTimeline, setLoadingTimeline] = useState(true)

  useEffect(() => {
    if (!orgId) return
    fetchDealActivities(orgId, deal.id)
      .then((activities) => {
        const items: TimelineItem[] = activities.map((a) => ({
          id:          `activity-${a.id}`,
          type:        mapActivityTypeToTimeline(a.type),
          title:       a.notes.split('\n')[0] || a.type,
          description: a.notes,
          actor:       a.performed_by_name ?? 'System',
          createdAt:   a.created_at,
          activityId:  a.id,
        }))
        setTimeline(items)
        setLoadingTimeline(false)
      })
      .catch(() => setLoadingTimeline(false))
  }, [orgId, deal.id])

  // Tasks remain local-only — DealActivity has no dueDate/reminder/status
  // fields, so a dedicated Task backend model would be needed to persist
  // these properly. Deferred, same as Documents on the Lead Detail page.
  const [tasks, setTasks] = useState<TaskItem[]>([])
  const [notes, setNotes] = useState<NoteItem[]>([])
  const [attachments, setAttachments] = useState<AttachmentItem[]>([])
  const [taskDraft, setTaskDraft] = useState({ title: '', dueDate: '', reminder: '' })
  const [noteDraft, setNoteDraft] = useState('')
  const [editingNoteId,   setEditingNoteId]   = useState<string | null>(null)
  const [editingNoteText, setEditingNoteText] = useState('')
  const [showEditDeal, setShowEditDeal] = useState(false)
  const [savingDeal,   setSavingDeal]   = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [composer, setComposer] = useState<ComposerDraft | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2200)
  }

  const tasksWithDerivedStatus = useMemo(
    () => tasks.map((task) => ({ ...task, status: deriveStatus(task) })),
    [tasks]
  )

  const reminders = useMemo(() => {
    const overdueTasks  = tasksWithDerivedStatus.filter((t) => t.status === 'Overdue').length
    const closeDateDays = daysUntil(deal.closeDate)
    const closeDateNear = closeDateDays >= 0 && closeDateDays <= 7 ? 1 : 0
    const lastActivityDays = timeline.length
      ? Math.floor((Date.now() - new Date(timeline[0].createdAt).getTime()) / 864e5)
      : 0
    const inactivity = lastActivityDays >= 5 ? 1 : 0
    return [
      { label: 'Follow-up overdue',      count: overdueTasks,   tone: 'danger'  as const },
      { label: 'Close date near',        count: closeDateNear,  tone: 'warning' as const },
      { label: 'No activity for 5 days', count: inactivity,     tone: 'slate'   as const },
    ]
  }, [deal.closeDate, tasksWithDerivedStatus, timeline])

  const stageIndex = STAGES.findIndex((s) => s.id === deal.stage)

  const persistActivity = async (type: string, notes: string): Promise<ApiDealActivity | null> => {
    if (!orgId) return null
    try { return await createDealActivity(orgId, deal.id, { type, notes }) }
    catch { return null }
  }

  const addTimelineEntry = async (type: TimelineType, title: string, description: string) => {
    const localItem: TimelineItem = {
      id: nextId('timeline'), type, title, description,
      actor: ownerName(deal.assignedTo), createdAt: new Date().toISOString(),
    }
    setTimeline((current) => [localItem, ...current])
    showToast(title)

    const activityType =
      type === 'email' ? 'email' : type === 'call' ? 'call' : type === 'meeting' ? 'meeting' : 'note'
    const saved = await persistActivity(activityType, `${title}\n${description}`)
    if (saved) {
      setTimeline((current) => current.map((item) =>
        item.id === localItem.id ? { ...item, activityId: saved.id, actor: saved.performed_by_name ?? item.actor } : item
      ))
    }
  }

  const updateStage = async (nextStage: DealStageId) => {
    if (nextStage === deal.stage) return
    const stageMeta = STAGES.find((s) => s.id === nextStage)
    const prevLabel = STAGES.find((s) => s.id === deal.stage)?.label ?? deal.stage
    if (!stageMeta) return

    setDeal((current) => current ? { ...current, stage: nextStage, probability: stageMeta.probability } : current)
    void addTimelineEntry('stage', 'Stage changed', `Moved from ${prevLabel} to ${stageMeta.label}.`)

    if (orgId) {
      try {
        await updateDealApi(orgId, deal.id, uiDealToApi({
          id: deal.id, company: deal.companyName, contact: deal.contactPerson, email: deal.contactEmail,
          value: deal.dealValue, stage: normalizeBackStage(nextStage), prob: stageMeta.probability,
          priority: deal.priority, closeDate: deal.closeDate, sector: deal.sector,
          lastAct: 'Stage updated', lastActDays: 0, assignedTo: deal.assignedTo, industry: industryKey,
        }))
      } catch {
        showToast('Stage updated locally but failed to sync')
      }
    }
  }

  const [editDraft, setEditDraft] = useState({ ...deal })
  const openEditDeal = () => { setEditDraft({ ...deal }); setShowEditDeal(true) }

  const saveEditDeal = async () => {
    setDeal((current) => current ? { ...current, ...editDraft } : current)
    setShowEditDeal(false)

    if (orgId) {
      setSavingDeal(true)
      try {
        await updateDealApi(orgId, deal.id, uiDealToApi({
          id: deal.id, company: editDraft.companyName, contact: editDraft.contactPerson, email: editDraft.contactEmail,
          value: editDraft.dealValue, stage: normalizeBackStage(editDraft.stage), prob: editDraft.probability,
          priority: editDraft.priority, closeDate: editDraft.closeDate, sector: editDraft.sector,
          lastAct: deal.dealName, lastActDays: 0, assignedTo: editDraft.assignedTo, industry: industryKey,
        }))
        showToast('Deal saved')
      } catch {
        showToast('Saved locally but failed to sync')
      } finally {
        setSavingDeal(false)
      }
    }
  }

  const createTask = () => {
    if (!taskDraft.title.trim()) return
    const nextTask: TaskItem = {
      id: nextId('task'), title: taskDraft.title.trim(), dueDate: taskDraft.dueDate,
      reminder: taskDraft.reminder, status: 'Pending', owner: ownerName(deal.assignedTo),
    }
    setTasks((current) => [nextTask, ...current])
    setTaskDraft((current) => ({ ...current, title: '' }))
    void addTimelineEntry('task', 'Task created', `${nextTask.title} due ${formatDateLabel(nextTask.dueDate)}.`)
  }

  const toggleTaskStatus = (taskId: string) => {
    const currentTask = tasks.find((t) => t.id === taskId)
    if (!currentTask) return
    const nextStatus = deriveStatus(currentTask) === 'Completed' ? 'Pending' : 'Completed'
    setTasks((current) => current.map((t) => t.id === taskId ? { ...t, status: nextStatus } : t))
    if (nextStatus === 'Completed') void addTimelineEntry('task', 'Task completed', `${currentTask.title} was marked as completed.`)
  }

  const addNote = () => {
    if (!noteDraft.trim()) return
    const nextNote: NoteItem = { id: nextId('note'), text: noteDraft.trim(), author: ownerName(deal.assignedTo), createdAt: new Date().toISOString() }
    setNotes((current) => [nextNote, ...current])
    setNoteDraft('')
    void addTimelineEntry('note', 'Note added', nextNote.text)
  }

  const saveEditedNote = () => {
    if (!editingNoteId || !editingNoteText.trim()) return
    setNotes((current) => current.map((n) =>
      n.id === editingNoteId ? { ...n, text: editingNoteText.trim(), createdAt: new Date().toISOString(), author: ownerName(deal.assignedTo) } : n
    ))
    void addTimelineEntry('note', 'Note updated', editingNoteText.trim())
    setEditingNoteId(null)
    setEditingNoteText('')
  }

  const uploadFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return
    const nextFiles = Array.from(files)
      .filter((f) => f.type.includes('pdf') || f.type.includes('image') || f.name.toLowerCase().endsWith('.docx'))
      .map<AttachmentItem>((f) => ({
        id: nextId('attachment'), fileName: f.name, uploadedAt: new Date().toISOString(),
        uploadedBy: ownerName(deal.assignedTo),
        type: f.type.includes('image') ? 'image' : f.name.toLowerCase().endsWith('.docx') ? 'docx' : 'pdf',
        downloadUrl: URL.createObjectURL(f),
      }))
    if (nextFiles.length === 0) return
    setAttachments((current) => [...nextFiles, ...current])
    void addTimelineEntry('meeting', 'Attachment uploaded', `${nextFiles.length} file(s) added.`)
  }

  const handleUploadChange = (event: ChangeEvent<HTMLInputElement>) => { uploadFiles(event.target.files); event.target.value = '' }

  const openComposer = (type: QuickActionType) => setComposer({ type, ...getDefaultComposer(type) })

  const submitComposer = () => {
    if (!composer || !composer.title.trim() || !composer.description.trim()) return
    if (composer.type === 'email') {
      window.location.href = `mailto:${deal.contactEmail}?subject=${encodeURIComponent(composer.title)}&body=${encodeURIComponent(composer.description)}`
    }
    if (composer.type === 'note') {
      const nextNote: NoteItem = { id: nextId('note'), text: composer.description.trim(), author: ownerName(deal.assignedTo), createdAt: new Date().toISOString() }
      setNotes((current) => [nextNote, ...current])
    }
    void addTimelineEntry(composer.type as TimelineType, composer.title.trim(), composer.description.trim())
    setComposer(null)
  }

  return (
    <div className="deal-detail-shell">
      <div className="deal-detail-page">
        <div className="mb-4">
          <Link to="/sales" className="deal-detail-backlink">
            <ArrowLeft className="h-4 w-4" /> Back to Pipeline
          </Link>
        </div>

        <PageHeader
          eyebrow="Deal Workspace"
          title={deal.dealName}
          subtitle={deal.companyName}
          actions={
            <>
              <select className="deal-detail-stage-select" value={deal.stage} onChange={(event) => void updateStage(event.target.value as DealStageId)}>
                {STAGES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
              <button type="button" className="btn-ghost" onClick={openEditDeal}>Edit Deal</button>
            </>
          }
        />

        <section className="card deal-overview-card">
          <SectionHeader title="Deal Overview" subtitle="Key commercial context for this opportunity." right={<ReminderBadges items={reminders} />} />
          <div className="deal-overview-grid">
            <OverviewField label="Company Name"   value={deal.companyName} />
            <OverviewField label="Contact Person" value={deal.contactPerson} />
            <OverviewField label="Deal Owner"     value={ownerName(deal.assignedTo)} />
            <OverviewField label="Deal Value"     value={fmt(deal.dealValue)} />
            <OverviewField label="Priority"       value={deal.priority} tone={pColor(deal.priority)} />
            <OverviewField label="Win Probability" value={`${deal.probability}%`} tone={STAGES[stageIndex]?.tone} />
            <OverviewField label="Expected Close" value={formatDateLabel(deal.closeDate)} />
          </div>

          {showEditDeal && (
            <div className="deal-inline-editor">
              <div className="deal-form-grid">
                <label><span>Company Name</span>
                  <input className="input" value={editDraft.companyName} onChange={(e) => setEditDraft((p) => ({ ...p, companyName: e.target.value }))} />
                </label>
                <label><span>Contact Person</span>
                  <input className="input" value={editDraft.contactPerson} onChange={(e) => setEditDraft((p) => ({ ...p, contactPerson: e.target.value }))} />
                </label>
                <label><span>Contact Email</span>
                  <input className="input" value={editDraft.contactEmail} onChange={(e) => setEditDraft((p) => ({ ...p, contactEmail: e.target.value }))} />
                </label>
                <label><span>Deal Owner (Assigned Staff)</span>
                  <select className="input" value={editDraft.assignedTo ?? ''} onChange={(e) => setEditDraft((p) => ({ ...p, assignedTo: e.target.value ? Number(e.target.value) : null }))}>
                    <option value="">Unassigned</option>
                    {orgUsers.map((u) => <option key={u.id} value={u.id}>{u.username || u.email}</option>)}
                  </select>
                </label>
                <label><span>Close Date</span>
                  <input className="input" type="date" value={editDraft.closeDate} onChange={(e) => setEditDraft((p) => ({ ...p, closeDate: e.target.value }))} />
                </label>
                <label><span>Deal Value</span>
                  <input className="input" type="number" value={editDraft.dealValue} onChange={(e) => setEditDraft((p) => ({ ...p, dealValue: Number(e.target.value) }))} />
                </label>
                <label><span>Priority</span>
                  <select className="input" value={editDraft.priority} onChange={(e) => setEditDraft((p) => ({ ...p, priority: e.target.value as Priority }))}>
                    <option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
                  </select>
                </label>
              </div>
              <div className="flex gap-3 mt-4 justify-end">
                <button type="button" className="btn-ghost" onClick={() => setShowEditDeal(false)}>Cancel</button>
                <button type="button" className="btn-primary" disabled={savingDeal} onClick={() => void saveEditDeal()}>
                  {savingDeal ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="card deal-section-card">
          <SectionHeader title="Stage Progress" subtitle="A simple pipeline tracker for this deal." />
          <div className="deal-stage-tracker">
            {STAGES.map((stage, index) => {
              const complete  = index < stageIndex
              const active    = index === stageIndex
              const reachable = index <= stageIndex
              return (
                <div key={stage.id} className={clsx('deal-stage-node', active && 'is-active', complete && 'is-complete')}>
                  <div className="deal-stage-line" aria-hidden={index === STAGES.length - 1}>
                    {index !== STAGES.length - 1 && <div className={clsx('deal-stage-line-fill', reachable && 'is-filled')} />}
                  </div>
                  <div className="deal-stage-dot" style={active || complete ? { borderColor: stage.tone, background: stage.tone } : undefined} />
                  <div className="deal-stage-label">{stage.label}</div>
                </div>
              )
            })}
          </div>
        </section>

        <div className="deal-content-grid">
          <div className="deal-main-column">
            <section className="card deal-section-card">
              <SectionHeader
                title="Activity Timeline"
                subtitle={loadingTimeline ? 'Loading activities…' : 'Newest activity first. Persisted to backend.'}
                right={
                  <div className="deal-action-row">
                    <button type="button" className="btn-ghost" onClick={() => openComposer('email')}>Send Email</button>
                    <button type="button" className="btn-ghost" onClick={() => openComposer('call')}>Log Call</button>
                    <button type="button" className="btn-ghost" onClick={() => openComposer('meeting')}>Schedule Meeting</button>
                    <button type="button" className="btn-ghost" onClick={() => openComposer('note')}>Add Note</button>
                  </div>
                }
              />

              {composer && (
                <div className="deal-composer">
                  <div className="deal-composer-head">
                    <div>
                      <div className="deal-composer-title">
                        {composer.type === 'email' ? 'Email Composer' : composer.type === 'call' ? 'Call Log' : composer.type === 'meeting' ? 'Meeting Entry' : 'Quick Note'}
                      </div>
                      <p>{composer.type === 'email' ? `Recipient: ${deal.contactEmail}` : `Activity will be saved to ${deal.companyName}'s timeline.`}</p>
                    </div>
                    <button type="button" className="btn-ghost" onClick={() => setComposer(null)}>Close</button>
                  </div>
                  <div className="deal-composer-grid">
                    <input className="input" placeholder="Activity title" value={composer.title} onChange={(e) => setComposer((c) => c ? { ...c, title: e.target.value } : c)} />
                    <textarea className="input deal-note-input" placeholder="Activity description" value={composer.description} onChange={(e) => setComposer((c) => c ? { ...c, description: e.target.value } : c)} />
                  </div>
                  <div className="deal-composer-actions">
                    <button type="button" className="btn-primary" onClick={submitComposer}>
                      {composer.type === 'email' ? <Send className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      {composer.type === 'email' ? 'Send Email' : 'Save Activity'}
                    </button>
                  </div>
                </div>
              )}

              <div className="deal-timeline">
                {timeline.length === 0 && !loadingTimeline && (
                  <p className="text-sm text-theme-secondary py-4">No activities yet. Use the buttons above to log the first one.</p>
                )}
                {timeline.map((item) => (
                  <div key={item.id} className="deal-timeline-row fade-up">
                    <div className="deal-timeline-icon">{getTimelineIcon(item.type)}</div>
                    <div className="deal-timeline-card">
                      <div className="deal-timeline-head">
                        <div><h3>{item.title}</h3><p>{item.description}</p></div>
                        <span>{item.actor}</span>
                      </div>
                      <div className="deal-timeline-meta">{formatDateTimeLabel(item.createdAt)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="card deal-section-card">
              <SectionHeader title="Tasks & Follow-Ups" subtitle="Local to this session — a Task backend model is needed to persist these." />
              <div className="deal-task-create">
                <input className="input" placeholder="Create task" value={taskDraft.title} onChange={(e) => setTaskDraft((p) => ({ ...p, title: e.target.value }))} />
                <input className="input" type="date" value={taskDraft.dueDate} onChange={(e) => setTaskDraft((p) => ({ ...p, dueDate: e.target.value }))} />
                <input className="input" type="datetime-local" value={taskDraft.reminder} onChange={(e) => setTaskDraft((p) => ({ ...p, reminder: e.target.value }))} />
                <button type="button" className="btn-primary" onClick={createTask}><Plus className="h-4 w-4" /> Create Task</button>
              </div>
              <div className="deal-task-list">
                {tasksWithDerivedStatus.map((task) => (
                  <div key={task.id} className={clsx('deal-task-card', task.status === 'Overdue' && 'deal-task-overdue')}>
                    <div>
                      <div className="deal-task-title">{task.title}</div>
                      <div className="deal-task-meta"><Clock3 className="h-4 w-4" /> Due {formatDateLabel(task.dueDate)} | Reminder {formatDateTimeLabel(task.reminder)}</div>
                    </div>
                    <div className="deal-task-actions">
                      <span className={clsx('deal-status-pill', `deal-status-${task.status.toLowerCase()}`)}>{task.status}</span>
                      <button type="button" className="btn-ghost" onClick={() => toggleTaskStatus(task.id)}>{task.status === 'Completed' ? 'Reopen' : 'Complete'}</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="deal-side-column">
            <section className="card deal-section-card">
              <SectionHeader title="Notifications" subtitle="Compact alerts only." />
              <div className="deal-reminder-list">
                {reminders.map((item) => (
                  <div key={item.label} className="deal-reminder-item">
                    <div className="deal-reminder-label"><Bell className="h-4 w-4" />{item.label}</div>
                    <span className={clsx('deal-reminder-badge', `deal-reminder-${item.tone}`)}>{item.count}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="card deal-section-card">
              <SectionHeader title="Notes" subtitle="Context for the next touchpoint." />
              <div className="deal-note-create">
                <textarea className="input deal-note-input" placeholder="Add a quick note" value={noteDraft} onChange={(e) => setNoteDraft(e.target.value)} />
                <button type="button" className="btn-primary" onClick={addNote}>Add Note</button>
              </div>
              <div className="deal-notes-list">
                {notes.map((note) => {
                  const editing = editingNoteId === note.id
                  return (
                    <div key={note.id} className="deal-note-card">
                      <div className="deal-note-top">
                        <div className="deal-note-author"><UserRound className="h-4 w-4" />{note.author}</div>
                        <span>{formatDateTimeLabel(note.createdAt)}</span>
                      </div>
                      {editing ? (
                        <div className="deal-note-edit">
                          <textarea className="input deal-note-input" value={editingNoteText} onChange={(e) => setEditingNoteText(e.target.value)} />
                          <div className="deal-note-actions">
                            <button type="button" className="btn-ghost" onClick={() => setEditingNoteId(null)}>Cancel</button>
                            <button type="button" className="btn-primary" onClick={saveEditedNote}>Save</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p>{note.text}</p>
                          <button type="button" className="deal-link-button" onClick={() => { setEditingNoteId(note.id); setEditingNoteText(note.text) }}>Edit note</button>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>

            <section className="card deal-section-card">
              <SectionHeader
                title="Attachments"
                subtitle="Local to this session — no file backend yet."
                right={<button type="button" className="btn-ghost" onClick={() => fileInputRef.current?.click()}><UploadCloud className="h-4 w-4" /> Upload</button>}
              />
              <input ref={fileInputRef} type="file" accept=".pdf,.docx,image/*" multiple className="hidden" onChange={handleUploadChange} />
              <div className="deal-upload-zone" onClick={() => fileInputRef.current?.click()}>
                <UploadCloud className="h-6 w-6" />
                <div>
                  <div className="font-semibold text-theme-primary">Drop files or click to upload</div>
                  <p className="text-sm text-theme-secondary">PDF, DOCX, and image files only.</p>
                </div>
              </div>
              <div className="deal-attachment-list">
                {attachments.map((item) => (
                  <div key={item.id} className="deal-attachment-card">
                    <div className="deal-attachment-icon">{getAttachmentIcon(item.type)}</div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-semibold text-theme-primary">{item.fileName}</div>
                      <div className="text-sm text-theme-secondary">{formatDateTimeLabel(item.uploadedAt)}</div>
                    </div>
                    <a className="btn-ghost" href={item.downloadUrl ?? '#'} download={item.fileName} onClick={(e) => { if (!item.downloadUrl) { e.preventDefault(); showToast(`Download ready for ${item.fileName}`) } }}>
                      <Download className="h-4 w-4" /> Download
                    </a>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>

        {toast && <div className="deal-detail-toast">{toast}</div>}
      </div>
    </div>
  )
}

function OverviewField({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="deal-overview-field">
      <div className="deal-overview-label">{label}</div>
      <div className="deal-overview-value" style={tone ? { color: tone } : undefined}>{value}</div>
    </div>
  )
}

function ReminderBadges({ items }: { items: Array<{ label: string; count: number; tone: 'danger' | 'warning' | 'slate' }> }) {
  return (
    <div className="deal-reminder-badge-row">
      {items.map((item) => (
        <span key={item.label} className={clsx('deal-reminder-mini', `deal-reminder-${item.tone}`)}>
          {item.count > 0 ? <TriangleAlert className="h-3.5 w-3.5" /> : <Bell className="h-3.5 w-3.5" />}
          {item.count} {item.label}
        </span>
      ))}
    </div>
  )
}