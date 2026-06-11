import { useMemo, useRef, useState, type ChangeEvent } from 'react'
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
import { INITIAL_DEALS, fmt, pColor } from '../data/pipeline'
import './DealDetailPage.css'

type DealStageId =
  | 'lead'
  | 'contacted'
  | 'qualified'
  | 'proposal'
  | 'negotiation'
  | 'closed_won'
  | 'closed_lost'

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
  sector: string
}

type TimelineItem = {
  id: string
  type: TimelineType
  title: string
  description: string
  actor: string
  createdAt: string
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
  { id: 'lead', label: 'New Lead', probability: 15, tone: '#64748b' },
  { id: 'contacted', label: 'Contacted', probability: 30, tone: '#2563eb' },
  { id: 'qualified', label: 'Qualified', probability: 50, tone: '#0f766e' },
  { id: 'proposal', label: 'Proposal', probability: 70, tone: '#d97706' },
  { id: 'negotiation', label: 'Negotiation', probability: 85, tone: '#ea580c' },
  { id: 'closed_won', label: 'Closed Won', probability: 100, tone: '#16a34a' },
  { id: 'closed_lost', label: 'Closed Lost', probability: 0, tone: '#dc2626' },
]

const owners = ['Aarav Shah', 'Priya Menon', 'Neha Rao', 'Karan Malhotra']

let localCounter = 0

function nextId(prefix: string) {
  localCounter += 1
  return `${prefix}-${localCounter}`
}

function normalizeStage(stage: string): DealStageId {
  if (stage === 'closed') return 'closed_won'
  return (stage as DealStageId) ?? 'lead'
}

function formatDateLabel(value: string | undefined | null) {
  if (!value) return 'N/A'
  const date = new Date(value)
  if (isNaN(date.getTime())) return 'Invalid Date'
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatDateTimeLabel(value: string | undefined | null) {
  if (!value) return 'N/A'
  const date = new Date(value)
  if (isNaN(date.getTime())) return 'Invalid Date'
  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function daysUntil(date: string | undefined | null) {
  if (!date) return 0
  const current = new Date()
  const target = new Date(date)
  if (isNaN(target.getTime())) return 0
  const diff = target.getTime() - current.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function getTimelineIcon(type: TimelineType) {
  switch (type) {
    case 'email':
      return <Mail className="h-4 w-4" />
    case 'call':
      return <Phone className="h-4 w-4" />
    case 'meeting':
      return <CalendarDays className="h-4 w-4" />
    case 'note':
      return <MessageSquare className="h-4 w-4" />
    case 'task':
      return <CheckCircle2 className="h-4 w-4" />
    case 'stage':
      return <Target className="h-4 w-4" />
    default:
      return <Paperclip className="h-4 w-4" />
  }
}

function getAttachmentIcon(type: AttachmentItem['type']) {
  return type === 'image' ? <FileImage className="h-5 w-5" /> : <FileText className="h-5 w-5" />
}

function deriveStatus(task: Pick<TaskItem, 'status' | 'dueDate'>) {
  if (task.status === 'Completed') return 'Completed'
  return daysUntil(task.dueDate) < 0 ? 'Overdue' : 'Pending'
}

function seedDealRecord(id: number, fallback?: Partial<DealRecord>): DealRecord {
  const source = INITIAL_DEALS.find((item) => item.id === id) ?? INITIAL_DEALS[0]
  return {
    id: source.id,
    dealName: fallback?.dealName ?? `${source.company} ${source.sector} Expansion`,
    companyName: fallback?.companyName ?? source.company,
    contactPerson: fallback?.contactPerson ?? source.contact,
    contactEmail: fallback?.contactEmail ?? source.email,
    dealValue: fallback?.dealValue ?? source.value,
    stage: fallback?.stage ?? normalizeStage(source.stage),
    priority: fallback?.priority ?? source.priority,
    probability: fallback?.probability ?? source.prob,
    closeDate: fallback?.closeDate ?? source.closeDate,
    owner: fallback?.owner ?? owners[source.id % owners.length],
    sector: source.sector,
  }
}

function getDefaultComposer(type: QuickActionType): Pick<ComposerDraft, 'title' | 'description'> {
  if (type === 'email') {
    return {
      title: 'Email Sent',
      description: 'Shared revised pricing proposal and onboarding details.',
    }
  }
  if (type === 'call') {
    return {
      title: 'Call Logged',
      description: 'Reviewed buyer objections, timeline, and procurement next steps.',
    }
  }
  if (type === 'meeting') {
    return {
      title: 'Meeting Scheduled',
      description: 'Booked a follow-up meeting with decision makers for commercial review.',
    }
  }
  return {
    title: 'Note Added',
    description: 'Captured fresh customer context for the next rep handoff.',
  }
}

export default function DealDetailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { dealId = '' } = useParams()
  const dealFromState = location.state?.deal as Partial<DealRecord> | undefined
  const parsedId = Number(dealId)

  if (!parsedId || Number.isNaN(parsedId)) {
    return (
      <div className="p-6 lg:p-8">
        <div className="card mx-auto max-w-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900">Deal not found</h2>
          <p className="mt-3 text-sm text-slate-500">This deal link is invalid or no longer available.</p>
          <button type="button" className="btn-primary mt-6" onClick={() => navigate('/sales')}>
            <ArrowLeft className="h-4 w-4" />
            Back to Sales Pipeline
          </button>
        </div>
      </div>
    )
  }

  return <DealDetailWorkspace initialDeal={seedDealRecord(parsedId, dealFromState)} />
}

function DealDetailWorkspace({ initialDeal }: { initialDeal: DealRecord }) {
  const [deal, setDeal] = useState(initialDeal)
  const [timeline, setTimeline] = useState<TimelineItem[]>(() => [
    {
      id: nextId('timeline'),
      type: 'stage',
      title: 'Negotiation started',
      description: 'Commercial review moved forward after the pricing call with the CFO.',
      actor: deal.owner,
      createdAt: '2026-05-26T14:30:00',
    },
    {
      id: nextId('timeline'),
      type: 'email',
      title: 'Email Sent',
      description: 'Shared the updated commercial proposal and annual support scope.',
      actor: deal.owner,
      createdAt: '2026-05-25T10:00:00',
    },
    {
      id: nextId('timeline'),
      type: 'created',
      title: 'Deal created',
      description: `New opportunity opened for ${deal.companyName}.`,
      actor: deal.owner,
      createdAt: '2026-05-20T09:15:00',
    },
  ])
  const [tasks, setTasks] = useState<TaskItem[]>([
    { id: nextId('task'), title: 'Call customer', dueDate: '2026-05-24', reminder: '2026-05-24T09:00', status: 'Pending', owner: deal.owner },
    { id: nextId('task'), title: 'Send quotation', dueDate: '2026-05-28', reminder: '2026-05-28T10:00', status: 'Pending', owner: deal.owner },
    { id: nextId('task'), title: 'Follow-up meeting', dueDate: '2026-05-30', reminder: '2026-05-29T17:00', status: 'Completed', owner: deal.owner },
  ])
  const [notes, setNotes] = useState<NoteItem[]>([
    { id: nextId('note'), text: 'Customer wants discount on the annual plan if onboarding is included.', author: deal.owner, createdAt: '2026-05-26T16:10:00' },
    { id: nextId('note'), text: 'Decision maker is the CEO and final commercial approval comes from finance.', author: 'Priya Menon', createdAt: '2026-05-25T12:20:00' },
    { id: nextId('note'), text: 'Interested in the annual plan with quarterly business reviews.', author: deal.owner, createdAt: '2026-05-24T11:45:00' },
  ])
  const [attachments, setAttachments] = useState<AttachmentItem[]>([
    { id: nextId('attachment'), fileName: 'Quarterly Proposal.pdf', uploadedAt: '2026-05-25T09:15:00', uploadedBy: deal.owner, type: 'pdf' },
    { id: nextId('attachment'), fileName: 'Commercial Terms.docx', uploadedAt: '2026-05-24T17:05:00', uploadedBy: 'Priya Menon', type: 'docx' },
  ])
  const [taskDraft, setTaskDraft] = useState({
    title: '',
    dueDate: '2026-05-31',
    reminder: '2026-05-31T09:00',
  })
  const [noteDraft, setNoteDraft] = useState('')
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [editingNoteText, setEditingNoteText] = useState('')
  const [showEditDeal, setShowEditDeal] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [composer, setComposer] = useState<ComposerDraft | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const tasksWithDerivedStatus = useMemo(
    () => tasks.map((task) => ({ ...task, status: deriveStatus(task) })),
    [tasks]
  )

  const reminders = useMemo(() => {
    const overdueTasks = tasksWithDerivedStatus.filter((task) => task.status === 'Overdue').length
    const closeDateDays = daysUntil(deal.closeDate)
    const closeDateNear = closeDateDays >= 0 && closeDateDays <= 7 ? 1 : 0
    const lastActivityDays = timeline.length
      ? Math.floor((Date.now() - new Date(timeline[0].createdAt).getTime()) / (1000 * 60 * 60 * 24))
      : 0
    const inactivity = lastActivityDays >= 5 ? 1 : 0

    return [
      { label: 'Follow-up overdue', count: overdueTasks, tone: 'danger' as const },
      { label: 'Close date near', count: closeDateNear, tone: 'warning' as const },
      { label: 'No activity for 5 days', count: inactivity, tone: 'slate' as const },
    ]
  }, [deal.closeDate, tasksWithDerivedStatus, timeline])

  const stageIndex = STAGES.findIndex((stage) => stage.id === deal.stage)

  const addTimelineEntry = (type: TimelineType, title: string, description: string, actor = deal.owner) => {
    setTimeline((current) => [
      {
        id: nextId('timeline'),
        type,
        title,
        description,
        actor,
        createdAt: new Date().toISOString(),
      },
      ...current,
    ])
    setToast(title)
    window.setTimeout(() => setToast(null), 2200)
  }

  const updateStage = (nextStage: DealStageId) => {
    if (nextStage === deal.stage) return
    const stageMeta = STAGES.find((stage) => stage.id === nextStage)
    if (!stageMeta) return
    const previousLabel = STAGES.find((stage) => stage.id === deal.stage)?.label ?? deal.stage
    const nextDeal = { ...deal, stage: nextStage, probability: stageMeta.probability }
    setDeal(nextDeal)
    addTimelineEntry('stage', 'Stage changed', `Moved the deal from ${previousLabel} to ${stageMeta.label}.`)
  }

  const updateDealField = <K extends keyof DealRecord>(field: K, value: DealRecord[K]) => {
    setDeal((current) => ({ ...current, [field]: value }))
  }

  const createTask = () => {
    if (!taskDraft.title.trim()) return
    const nextTask: TaskItem = {
      id: nextId('task'),
      title: taskDraft.title.trim(),
      dueDate: taskDraft.dueDate,
      reminder: taskDraft.reminder,
      status: 'Pending',
      owner: deal.owner,
    }
    setTasks((current) => [nextTask, ...current])
    setTaskDraft((current) => ({ ...current, title: '' }))
    addTimelineEntry('task', 'Task created', `${nextTask.title} was added with a due date of ${formatDateLabel(nextTask.dueDate)}.`)
  }

  const toggleTaskStatus = (taskId: string) => {
    const currentTask = tasks.find((task) => task.id === taskId)
    if (!currentTask) return
    const nextStatus = deriveStatus(currentTask) === 'Completed' ? 'Pending' : 'Completed'
    setTasks((current) => current.map((task) => (task.id === taskId ? { ...task, status: nextStatus } : task)))
    if (nextStatus === 'Completed') {
      addTimelineEntry('task', 'Task completed', `${currentTask.title} was marked as completed.`)
    }
  }

  const addNote = () => {
    if (!noteDraft.trim()) return
    const nextNote: NoteItem = {
      id: nextId('note'),
      text: noteDraft.trim(),
      author: deal.owner,
      createdAt: new Date().toISOString(),
    }
    setNotes((current) => [nextNote, ...current])
    setNoteDraft('')
    addTimelineEntry('note', 'Note added', nextNote.text)
  }

  const saveEditedNote = () => {
    if (!editingNoteId || !editingNoteText.trim()) return
    setNotes((current) =>
      current.map((note) =>
        note.id === editingNoteId
          ? { ...note, text: editingNoteText.trim(), createdAt: new Date().toISOString(), author: deal.owner }
          : note
      )
    )
    addTimelineEntry('note', 'Note updated', editingNoteText.trim())
    setEditingNoteId(null)
    setEditingNoteText('')
  }

  const uploadFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return
    const nextFiles = Array.from(files)
      .filter((file) => file.type.includes('pdf') || file.type.includes('image') || file.name.toLowerCase().endsWith('.docx'))
      .map<AttachmentItem>((file) => ({
        id: nextId('attachment'),
        fileName: file.name,
        uploadedAt: new Date().toISOString(),
        uploadedBy: deal.owner,
        type: file.type.includes('image') ? 'image' : file.name.toLowerCase().endsWith('.docx') ? 'docx' : 'pdf',
        downloadUrl: URL.createObjectURL(file),
      }))

    if (nextFiles.length === 0) return
    setAttachments((current) => [...nextFiles, ...current])
    addTimelineEntry('meeting', 'Attachment uploaded', `${nextFiles.length} file${nextFiles.length > 1 ? 's were' : ' was'} added to the deal record.`)
  }

  const handleUploadChange = (event: ChangeEvent<HTMLInputElement>) => {
    uploadFiles(event.target.files)
    event.target.value = ''
  }

  const openComposer = (type: QuickActionType) => {
    const draft = getDefaultComposer(type)
    setComposer({ type, ...draft })
  }

  const submitComposer = () => {
    if (!composer || !composer.title.trim() || !composer.description.trim()) return

    if (composer.type === 'email') {
      const subject = encodeURIComponent(composer.title.trim())
      const body = encodeURIComponent(composer.description.trim())
      window.location.href = `mailto:${deal.contactEmail}?subject=${subject}&body=${body}`
      addTimelineEntry('email', composer.title.trim(), composer.description.trim())
    }

    if (composer.type === 'call') {
      addTimelineEntry('call', composer.title.trim(), composer.description.trim())
    }

    if (composer.type === 'meeting') {
      addTimelineEntry('meeting', composer.title.trim(), composer.description.trim())
    }

    if (composer.type === 'note') {
      const nextNote: NoteItem = {
        id: nextId('note'),
        text: composer.description.trim(),
        author: deal.owner,
        createdAt: new Date().toISOString(),
      }
      setNotes((current) => [nextNote, ...current])
      addTimelineEntry('note', composer.title.trim(), composer.description.trim())
    }

    setComposer(null)
  }

  return (
    <div className="deal-detail-shell">
      <div className="deal-detail-page">
        <div className="mb-4">
          <Link to="/sales" className="deal-detail-backlink">
            <ArrowLeft className="h-4 w-4" />
            Back to Pipeline
          </Link>
        </div>

        <PageHeader
          eyebrow="Deal Workspace"
          title={deal.dealName}
          subtitle={deal.companyName}
          actions={
            <>
              <select
                className="deal-detail-stage-select"
                value={deal.stage}
                onChange={(event) => updateStage(event.target.value as DealStageId)}
              >
                {STAGES.map((stage) => (
                  <option key={stage.id} value={stage.id}>{stage.label}</option>
                ))}
              </select>
              <button type="button" className="btn-ghost" onClick={() => setShowEditDeal((current) => !current)}>
                Edit Deal
              </button>
            </>
          }
        />

        <section className="card deal-overview-card">
          <SectionHeader
            title="Deal Overview"
            subtitle="Key commercial context for this one opportunity."
            right={<ReminderBadges items={reminders} />}
          />
          <div className="deal-overview-grid">
            <OverviewField label="Company Name" value={deal.companyName} />
            <OverviewField label="Contact Person" value={deal.contactPerson} />
            <OverviewField label="Deal Owner" value={deal.owner} />
            <OverviewField label="Deal Value" value={fmt(deal.dealValue)} />
            <OverviewField label="Priority" value={deal.priority} tone={pColor(deal.priority)} />
            <OverviewField label="Win Probability" value={`${deal.probability}%`} tone={STAGES[stageIndex]?.tone} />
            <OverviewField label="Expected Close Date" value={formatDateLabel(deal.closeDate)} />
          </div>

          {showEditDeal && (
            <div className="deal-inline-editor">
              <div className="deal-form-grid">
                <label>
                  <span>Deal Name</span>
                  <input className="input" value={deal.dealName} onChange={(event) => updateDealField('dealName', event.target.value)} />
                </label>
                <label>
                  <span>Company Name</span>
                  <input className="input" value={deal.companyName} onChange={(event) => updateDealField('companyName', event.target.value)} />
                </label>
                <label>
                  <span>Contact Person</span>
                  <input className="input" value={deal.contactPerson} onChange={(event) => updateDealField('contactPerson', event.target.value)} />
                </label>
                <label>
                  <span>Contact Email</span>
                  <input className="input" value={deal.contactEmail} onChange={(event) => updateDealField('contactEmail', event.target.value)} />
                </label>
                <label>
                  <span>Deal Owner</span>
                  <select className="input" value={deal.owner} onChange={(event) => updateDealField('owner', event.target.value)}>
                    {owners.map((owner) => <option key={owner} value={owner}>{owner}</option>)}
                  </select>
                </label>
                <label>
                  <span>Close Date</span>
                  <input className="input" type="date" value={deal.closeDate} onChange={(event) => updateDealField('closeDate', event.target.value)} />
                </label>
                <label>
                  <span>Deal Value</span>
                  <input className="input" type="number" value={deal.dealValue} onChange={(event) => updateDealField('dealValue', Number(event.target.value))} />
                </label>
                <label>
                  <span>Priority</span>
                  <select className="input" value={deal.priority} onChange={(event) => updateDealField('priority', event.target.value as Priority)}>
                    <option value="high">high</option>
                    <option value="medium">medium</option>
                    <option value="low">low</option>
                  </select>
                </label>
              </div>
            </div>
          )}
        </section>

        <section className="card deal-section-card">
          <SectionHeader title="Stage Progress" subtitle="A simple pipeline tracker for this one deal." />
          <div className="deal-stage-tracker">
            {STAGES.map((stage, index) => {
              const complete = index < stageIndex
              const active = index === stageIndex
              const reachable = index <= stageIndex
              return (
                <div key={stage.id} className={clsx('deal-stage-node', active && 'is-active', complete && 'is-complete')}>
                  <div className="deal-stage-line" aria-hidden={index === STAGES.length - 1}>
                    {index !== STAGES.length - 1 && (
                      <div className={clsx('deal-stage-line-fill', reachable && 'is-filled')} />
                    )}
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
                subtitle="Newest activity first. This is the center of the deal workspace."
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
                      <p>
                        {composer.type === 'email'
                          ? `Recipient: ${deal.contactEmail}`
                          : `Activity will be added to ${deal.companyName}'s timeline.`}
                      </p>
                    </div>
                    <button type="button" className="btn-ghost" onClick={() => setComposer(null)}>Close</button>
                  </div>
                  <div className="deal-composer-grid">
                    <input
                      className="input"
                      placeholder="Activity title"
                      value={composer.title}
                      onChange={(event) => setComposer((current) => current ? { ...current, title: event.target.value } : current)}
                    />
                    <textarea
                      className="input deal-note-input"
                      placeholder="Activity description"
                      value={composer.description}
                      onChange={(event) => setComposer((current) => current ? { ...current, description: event.target.value } : current)}
                    />
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
                {timeline.map((item) => (
                  <div key={item.id} className="deal-timeline-row fade-up">
                    <div className="deal-timeline-icon">{getTimelineIcon(item.type)}</div>
                    <div className="deal-timeline-card">
                      <div className="deal-timeline-head">
                        <div>
                          <h3>{item.title}</h3>
                          <p>{item.description}</p>
                        </div>
                        <span>{item.actor}</span>
                      </div>
                      <div className="deal-timeline-meta">{formatDateTimeLabel(item.createdAt)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="card deal-section-card">
              <SectionHeader title="Tasks & Follow-Ups" subtitle="Make next steps visible and hard to miss." />
              <div className="deal-task-create">
                <input
                  className="input"
                  placeholder="Create task"
                  value={taskDraft.title}
                  onChange={(event) => setTaskDraft((current) => ({ ...current, title: event.target.value }))}
                />
                <input
                  className="input"
                  type="date"
                  value={taskDraft.dueDate}
                  onChange={(event) => setTaskDraft((current) => ({ ...current, dueDate: event.target.value }))}
                />
                <input
                  className="input"
                  type="datetime-local"
                  value={taskDraft.reminder}
                  onChange={(event) => setTaskDraft((current) => ({ ...current, reminder: event.target.value }))}
                />
                <button type="button" className="btn-primary" onClick={createTask}>
                  <Plus className="h-4 w-4" />
                  Create Task
                </button>
              </div>
              <div className="deal-task-list">
                {tasksWithDerivedStatus.map((task) => (
                  <div key={task.id} className={clsx('deal-task-card', task.status === 'Overdue' && 'deal-task-overdue')}>
                    <div>
                      <div className="deal-task-title">{task.title}</div>
                      <div className="deal-task-meta">
                        <Clock3 className="h-4 w-4" />
                        Due {formatDateLabel(task.dueDate)} | Reminder {formatDateTimeLabel(task.reminder)}
                      </div>
                    </div>
                    <div className="deal-task-actions">
                      <span className={clsx('deal-status-pill', `deal-status-${task.status.toLowerCase()}`)}>{task.status}</span>
                      <button type="button" className="btn-ghost" onClick={() => toggleTaskStatus(task.id)}>
                        {task.status === 'Completed' ? 'Reopen' : 'Complete'}
                      </button>
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
                    <div className="deal-reminder-label">
                      <Bell className="h-4 w-4" />
                      {item.label}
                    </div>
                    <span className={clsx('deal-reminder-badge', `deal-reminder-${item.tone}`)}>{item.count}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="card deal-section-card">
              <SectionHeader title="Notes" subtitle="Context for the next touchpoint." />
              <div className="deal-note-create">
                <textarea
                  className="input deal-note-input"
                  placeholder="Add a quick note"
                  value={noteDraft}
                  onChange={(event) => setNoteDraft(event.target.value)}
                />
                <button type="button" className="btn-primary" onClick={addNote}>Add Note</button>
              </div>
              <div className="deal-notes-list">
                {notes.map((note) => {
                  const editing = editingNoteId === note.id
                  return (
                    <div key={note.id} className="deal-note-card">
                      <div className="deal-note-top">
                        <div className="deal-note-author">
                          <UserRound className="h-4 w-4" />
                          {note.author}
                        </div>
                        <span>{formatDateTimeLabel(note.createdAt)}</span>
                      </div>
                      {editing ? (
                        <div className="deal-note-edit">
                          <textarea className="input deal-note-input" value={editingNoteText} onChange={(event) => setEditingNoteText(event.target.value)} />
                          <div className="deal-note-actions">
                            <button type="button" className="btn-ghost" onClick={() => setEditingNoteId(null)}>Cancel</button>
                            <button type="button" className="btn-primary" onClick={saveEditedNote}>Save</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p>{note.text}</p>
                          <button
                            type="button"
                            className="deal-link-button"
                            onClick={() => {
                              setEditingNoteId(note.id)
                              setEditingNoteText(note.text)
                            }}
                          >
                            Edit note
                          </button>
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
                subtitle="Proposals, quotations, agreements, invoices."
                right={
                  <button type="button" className="btn-ghost" onClick={() => fileInputRef.current?.click()}>
                    <UploadCloud className="h-4 w-4" />
                    Upload
                  </button>
                }
              />
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,image/*"
                multiple
                className="hidden"
                onChange={handleUploadChange}
              />
              <div className="deal-upload-zone" onClick={() => fileInputRef.current?.click()}>
                <UploadCloud className="h-6 w-6" />
                <div>
                  <div className="font-semibold text-slate-900">Drop files or click to upload</div>
                  <p className="text-sm text-slate-500">PDF, DOCX, and image files only.</p>
                </div>
              </div>
              <div className="deal-attachment-list">
                {attachments.map((item) => (
                  <div key={item.id} className="deal-attachment-card">
                    <div className="deal-attachment-icon">{getAttachmentIcon(item.type)}</div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-semibold text-slate-900">{item.fileName}</div>
                      <div className="text-sm text-slate-500">{formatDateTimeLabel(item.uploadedAt)}</div>
                    </div>
                    <a
                      className="btn-ghost"
                      href={item.downloadUrl ?? '#'}
                      download={item.fileName}
                      onClick={(event) => {
                        if (!item.downloadUrl) {
                          event.preventDefault()
                          setToast(`Download ready for ${item.fileName}`)
                          window.setTimeout(() => setToast(null), 2200)
                        }
                      }}
                    >
                      <Download className="h-4 w-4" />
                      Download
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

function ReminderBadges({
  items,
}: {
  items: Array<{ label: string; count: number; tone: 'danger' | 'warning' | 'slate' }>
}) {
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
