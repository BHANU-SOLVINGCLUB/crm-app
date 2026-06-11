import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Plus,
  Filter,
  Search,
  Trash2,
  RotateCcw,
  Download,
  Upload,
  CheckCircle2,
  Users,
  Sparkles,
  ChevronDown,
  Check,
  MoreVertical,
  Phone,
  MessageSquare,
  MessageCircle,
  UserPlus,
  Handshake,
  X,
  History,
  Save,
  Eye,
} from 'lucide-react'

import PageHeader from '../components/common/PageHeader'
import Drawer from '../components/common/Drawer'
import Timeline from '../components/event-details/Timeline'
import { useIndustryStore } from '../store/industryStore'
import { pushAppToast } from '../store/uiStore'
import { leadsByIndustry, type LeadColumn, type LeadInteraction, type LeadRow } from '../data/leads'
import { normalizeIndustryKey } from '../data/industries'
import { formatINR, formatNumber } from '../lib/format'
import './LeadCapture.css'

const statusToneCycle = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4', '#f43f5e']

function statusTone(status: string, statuses: string[]) {
  const idx = Math.max(0, statuses.indexOf(status))
  return statusToneCycle[idx % statusToneCycle.length]
}

function CellRenderer({
  col,
  value,
  onChange,
  statuses,
}: {
  col: LeadColumn
  value: string | number
  onChange: (v: string | number) => void
  statuses: string[]
}) {
  if (col.type === 'select' && col.options) {
    const isStatus = col.key === 'status'
    if (isStatus) {
      return (
        <StatusSelect
          value={String(value)}
          statuses={statuses}
          onChange={(nextValue) => onChange(nextValue)}
        />
      )
    }

    return (
      <div className="relative h-full w-full">
        <select
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
          className="cell-input appearance-none cursor-pointer pr-6"
        >
          {col.options.map((o) => (
            <option key={o} value={o} className="bg-white text-slate-800">
              {o}
            </option>
          ))}
        </select>
      </div>
    )
  }
  if (col.type === 'currency') {
    return (
      <input
        type="number"
        value={String(value ?? '')}
        onChange={(e) => onChange(Number(e.target.value))}
        className="cell-input text-right tabular-nums"
        placeholder="0"
      />
    )
  }
  if (col.type === 'number') {
    return (
      <input
        type="number"
        value={String(value ?? '')}
        onChange={(e) => onChange(Number(e.target.value))}
        className="cell-input tabular-nums"
      />
    )
  }
  if (col.type === 'date') {
    return (
      <input
        type="date"
        value={String(value ?? '')}
        onChange={(e) => onChange(e.target.value)}
        className="cell-input tabular-nums"
      />
    )
  }
  return (
    <input
      value={String(value ?? '')}
      onChange={(e) => onChange(e.target.value)}
      className="cell-input"
      type={col.type === 'email' ? 'email' : col.type === 'phone' ? 'tel' : 'text'}
    />
  )
}

function getLeadDisplayName(row: LeadRow) {
  return String(
    row.name ??
      row.student ??
      row.guest ??
      row.company ??
      row.contact ??
      row.parent ??
      'Lead Details'
  )
}

function getLeadId(row: LeadRow, industryKey: string, rowIndex: number) {
  const rawLeadId = row.__leadId
  return typeof rawLeadId === 'string' && rawLeadId.trim() ? rawLeadId : `${industryKey}-lead-${rowIndex + 1}`
}

function formatDateTimeLocal(date = new Date()) {
  const offset = date.getTimezoneOffset()
  const localDate = new Date(date.getTime() - offset * 60_000)
  return localDate.toISOString().slice(0, 16)
}

interface InteractionDraft {
  leadId: string
  interactionType: string
  interactionChannel: string
  interactionAt: string
  interactionOutcome: string
  followUpAt: string
  followUpMode: string
  remarks: string
  autoStatusUpdate: boolean
  followUpRequired: boolean
}

const interactionTypeOptions = [
  'Inbound Call',
  'Outbound Call',
  'Missed Call',
  'Follow Up Call',
  'Qualification Call',
  'Conversion Call',
  'Support Call',
]
const interactionChannelOptions = ['Phone', 'WhatsApp', 'SMS', 'Email', 'Walk-in', 'Google Meet']
const followUpModeOptions = ['Call Back', 'WhatsApp Message', 'SMS', 'Email', 'Meeting', 'No Follow-up']

function buildBlankLeadRow(schema: { columns: LeadColumn[]; statuses: string[] }): LeadRow {
  const blank: LeadRow = {}
  schema.columns.forEach((column) => {
    blank[column.key] =
      column.type === 'currency' || column.type === 'number'
        ? 0
        : column.type === 'select'
          ? column.options?.[0] ?? ''
          : ''
  })
  blank.status = schema.statuses[0]
  return blank
}

export default function LeadCapture() {
  const navigate = useNavigate()
  const location = useLocation()
  const industryKey = useIndustryStore((s) => s.current)
  const getLeads = useIndustryStore((s) => s.getLeads)
  const addLead = useIndustryStore((s) => s.addLead)
  const updateLead = useIndustryStore((s) => s.updateLead)
  const deleteLeads = useIndustryStore((s) => s.deleteLeads)
  const leadInteractions = useIndustryStore((s) => s.leadInteractions)
  const getLeadInteractions = useIndustryStore((s) => s.getLeadInteractions)
  const addLeadInteraction = useIndustryStore((s) => s.addLeadInteraction)
  const resetLeads = useIndustryStore((s) => s.resetLeads)

  const safeIndustryKey = normalizeIndustryKey(industryKey)
  const schema = leadsByIndustry[safeIndustryKey].schema
  const rows = getLeads(safeIndustryKey)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [selectedLeadIdx, setSelectedLeadIdx] = useState<number | null>(null)
  const [interactionLeadIdx, setInteractionLeadIdx] = useState<number | null>(null)
  const [interactionDraft, setInteractionDraft] = useState<InteractionDraft | null>(null)
  const [liveToast, setLiveToast] = useState<{ id: number, message: string } | null>(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return rows
      .map((r, i) => ({ row: r, i }))
      .filter(({ row }) => {
        if (statusFilter !== 'All' && row.status !== statusFilter) return false
        if (!q) return true
        return Object.values(row).some((v) => String(v).toLowerCase().includes(q))
      })
  }, [rows, search, statusFilter])

  const stats = useMemo(() => {
    const total = rows.length
    const bySource = rows.reduce<Record<string, number>>((acc, r) => {
      const s = String(r.source ?? 'â€”')
      acc[s] = (acc[s] || 0) + 1
      return acc
    }, {})
    const topSource = Object.entries(bySource).sort((a, b) => b[1] - a[1])[0]
    const valueKey = schema.columns.find((c) => c.type === 'currency')?.key
    const totalValue = valueKey ? rows.reduce((s, r) => s + (Number(r[valueKey]) || 0), 0) : 0
    const won = rows.filter((r) => ['Won', 'Booked', 'Admitted', 'Confirmed', 'Signed', 'Ordered', 'PO Received', 'Closed'].includes(String(r.status))).length
    return { total, topSource, totalValue, valueKey, won }
  }, [rows, schema])

  const updateCell = (rowIdx: number, key: string, val: string | number) => {
    updateLead(safeIndustryKey, rowIdx, key, val)
  }

  const interactionOutcomeOptions = useMemo(
    () =>
      Array.from(
        new Set([
          'Connected',
          'Interested',
          'Need Follow-up',
          'Callback Requested',
          'No Answer',
          'Not Interested',
          ...schema.statuses,
        ])
      ),
    [schema.statuses]
  )

  const pushToast = (message: string) => {
    const toastId = Date.now()
    setLiveToast({ id: toastId, message })
    setTimeout(() => {
      setLiveToast((current) => (current?.id === toastId ? null : current))
    }, 3500)
  }

  const addRow = () => {
    addLead(safeIndustryKey, buildBlankLeadRow(schema))
    pushToast('New lead row added.')
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get('quickAdd') !== 'lead') return

    const timer = window.setTimeout(() => {
      addLead(safeIndustryKey, buildBlankLeadRow(schema))
      pushToast('Quick Add created a new lead row.')
      navigate(location.pathname, { replace: true })
    }, 0)

    return () => window.clearTimeout(timer)
  }, [addLead, location.pathname, location.search, navigate, safeIndustryKey, schema])

  const simulateRealtimeEvent = () => {
    const blank: LeadRow = {}
    schema.columns.forEach((c) => {
      if (c.type === 'currency' || c.type === 'number') blank[c.key] = 0
      else if (c.type === 'select') blank[c.key] = c.options?.[0] ?? ''
      else blank[c.key] = ''
    })
    const names = ['Acme Corp', 'Stark Industries', 'Wayne Enterprises', 'Globex']
    blank.name = names[Math.floor(Math.random() * names.length)] + ' (Live Event)'
    blank.source = 'API Webhook'
    blank.status = schema.statuses[0]
    addLead(safeIndustryKey, blank)

    pushToast('New lead incoming via Webhook...')
  }


  const deleteSelected = () => {
    if (selected.size === 0) return
    deleteLeads(safeIndustryKey, selected)
    setSelected(new Set())
  }

  const toggleSelect = (i: number) => {
    const next = new Set(selected)
    if (next.has(i)) next.delete(i)
    else next.add(i)
    setSelected(next)
  }

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) setSelected(new Set())
    else setSelected(new Set(filtered.map((f) => f.i)))
  }

  const openInteractionModal = (row: LeadRow, rowIndex: number) => {
    setInteractionLeadIdx(rowIndex)
    setInteractionDraft({
      leadId: getLeadId(row, safeIndustryKey, rowIndex),
      interactionType: interactionTypeOptions[0],
      interactionChannel: interactionChannelOptions[0],
      interactionAt: formatDateTimeLocal(),
      interactionOutcome: interactionOutcomeOptions[0],
      followUpAt: '',
      followUpMode: followUpModeOptions[0],
      remarks: '',
      autoStatusUpdate: false,
      followUpRequired: false,
    })
  }

  const closeInteractionModal = () => {
    setInteractionLeadIdx(null)
    setInteractionDraft(null)
  }

  const activeInteractionLead = interactionLeadIdx !== null ? rows[interactionLeadIdx] : null
  const activeInteractionLeadId =
    interactionLeadIdx !== null && activeInteractionLead
      ? getLeadId(activeInteractionLead, safeIndustryKey, interactionLeadIdx)
      : ''
  const savedInteractions = useMemo(
    () => (activeInteractionLeadId ? getLeadInteractions(safeIndustryKey, activeInteractionLeadId) : []),
    [activeInteractionLeadId, getLeadInteractions, leadInteractions, safeIndustryKey]
  )

  const saveInteraction = () => {
    if (interactionLeadIdx === null || !activeInteractionLead || !interactionDraft) return
    if (!interactionDraft.interactionType || !interactionDraft.interactionChannel || !interactionDraft.interactionOutcome || !interactionDraft.remarks.trim()) {
      pushToast('Fill the required interaction fields before saving.')
      return
    }

    const leadName = getLeadDisplayName(activeInteractionLead)
    const interaction: LeadInteraction = {
      id: `${interactionDraft.leadId}-${Date.now()}`,
      leadId: interactionDraft.leadId,
      leadLabel: leadName,
      interactionType: interactionDraft.interactionType,
      interactionChannel: interactionDraft.interactionChannel,
      interactionAt: interactionDraft.interactionAt,
      interactionOutcome: interactionDraft.interactionOutcome,
      followUpAt: interactionDraft.followUpAt,
      followUpMode: interactionDraft.followUpMode,
      remarks: interactionDraft.remarks.trim(),
      autoStatusUpdate: interactionDraft.autoStatusUpdate,
      followUpRequired: interactionDraft.followUpRequired,
      createdAt: new Date().toISOString(),
    }

    addLeadInteraction(safeIndustryKey, interactionDraft.leadId, interaction)

    if (interactionDraft.autoStatusUpdate) {
      const exactStatus = schema.statuses.find(
        (status) => status.toLowerCase() === interactionDraft.interactionOutcome.toLowerCase()
      )
      const followUpStatus = schema.statuses.find((status) => status.toLowerCase().includes('follow'))
      const fallbackStatus = schema.statuses.find((status) => status.toLowerCase().includes('contact'))
      const nextStatus =
        exactStatus ??
        (interactionDraft.followUpRequired ? followUpStatus : undefined) ??
        fallbackStatus

      if (nextStatus) {
        updateLead(safeIndustryKey, interactionLeadIdx, 'status', nextStatus)
      }
    }

    pushToast(`Interaction saved for ${leadName}.`)
    closeInteractionModal()
  }

  const handleLeadAction = (action: 'call' | 'interaction' | 'assign' | 'whatsapp' | 'sms' | 'delete', row: LeadRow, rowIndex: number) => {
    const leadName = getLeadDisplayName(row)
    const phone = String(row.phone ?? '').trim()

    if (action === 'delete') {
      deleteLeads(safeIndustryKey, new Set([rowIndex]))
      pushToast(`${leadName} removed from leads.`)
      return
    }

    if (!phone && (action === 'call' || action === 'whatsapp' || action === 'sms')) {
      pushToast(`No phone number available for ${leadName}.`)
      return
    }

    if (action === 'call') {
      pushToast(`Ready to call ${leadName} at ${phone}.`)
      return
    }

    if (action === 'assign') {
      pushToast(`Assignment started for ${leadName}.`)
      return
    }

    if (action === 'interaction') {
      openInteractionModal(row, rowIndex)
      return
    }

    if (action === 'whatsapp') {
      pushToast(`WhatsApp follow-up queued for ${leadName}.`)
      return
    }

    pushToast(`SMS reminder queued for ${leadName}.`)
  }

  return (
    <div className="leads-container">
      <PageHeader
        eyebrow="Lead Capture"
        actions={
          <>
            <button className="btn-ghost" onClick={() => resetLeads(safeIndustryKey)} title="Reset to sample data">
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
            <button className="btn-ghost" onClick={() => pushToast('Import flow will map CSV columns into this lead sheet.')}>
              <Upload className="h-4 w-4" />
              Import
            </button>
            <button className="btn-ghost leads-simulate-btn" onClick={simulateRealtimeEvent}>
              <Sparkles className="h-4 w-4" />
              Simulate Live
            </button>
            <button className="btn-primary" onClick={addRow}>
              <Plus className="h-4 w-4" />
              New Lead
            </button>
          </>
        }
      />

      {/* Mini stat strip */}
      <div className="leads-ministat-grid">
        <MiniStat label="Total leads" value={formatNumber(stats.total)} accent="#3b82f6" icon={<Users className="h-4 w-4" />} />
        <MiniStat
          label="Top source"
          value={stats.topSource ? stats.topSource[0] : 'â€”'}
          hint={stats.topSource ? `${stats.topSource[1]} leads` : ''}
          accent="#10b981"
          icon={<Sparkles className="h-4 w-4" />}
        />
        <MiniStat
          label="Won / Closed"
          value={formatNumber(stats.won)}
          hint={stats.total ? `${((stats.won / stats.total) * 100).toFixed(1)}% conversion` : ''}
          accent="#8b5cf6"
          icon={<CheckCircle2 className="h-4 w-4" />}
        />
        <MiniStat
          label="Pipeline value"
          value={formatINR(stats.totalValue, { compact: true })}
          hint={stats.valueKey ? `Sum of ${schema.columns.find((c) => c.key === stats.valueKey)?.label}` : ''}
          accent="#f59e0b"
          icon={<Sparkles className="h-4 w-4" />}
        />
      </div>

      {/* Toolbar */}
      <div className="card leads-toolbar">
        <div className="leads-toolbar-inner">
          <div className="leads-search-container">
            <Search className="leads-search-icon" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search across all fieldsâ€¦"
              className="input leads-search-input"
            />
          </div>

          <div className="leads-filter-group">
            <span className="chip"><Filter className="h-3 w-3" /> Status</span>
            <button
              onClick={() => setStatusFilter('All')}
              className={`leads-filter-btn ${statusFilter === 'All' ? 'all-active' : 'inactive'}`}
            >
              All
            </button>
            {schema.statuses.map((s) => {
              const active = statusFilter === s
              const tone = statusTone(s, schema.statuses)
              return (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`leads-filter-btn ${active ? '' : 'inactive'}`}
                  style={active ? { color: tone, backgroundColor: `${tone}15`, borderColor: `${tone}30` } : undefined}
                >
                  {s}
                </button>
              )
            })}
          </div>

          <div className="leads-action-group">
            {selected.size > 0 && (
              <button
                onClick={deleteSelected}
                className="btn-ghost leads-delete-action"
              >
                <Trash2 className="h-4 w-4" />
                Delete ({selected.size})
              </button>
            )}
            <button
              className="btn-ghost"
              onClick={() => pushToast(`Export prepared for ${selected.size > 0 ? `${selected.size} selected` : filtered.length} lead(s).`)}
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Sheet */}
      <div className="card leads-sheet-container">
        <div className="leads-sheet-scroll">
          <table className="sheet">
            <thead>
              <tr>
                <th className="row-num !text-center">
                  <input
                    type="checkbox"
                    checked={filtered.length > 0 && selected.size === filtered.length}
                    onChange={toggleSelectAll}
                    className="leads-checkbox"
                  />
                </th>
                <th style={{ width: 44 }}>#</th>
                <th style={{ width: 148 }}>Actions</th>
                {schema.columns.map((col) => (
                  <th key={col.key} style={{ minWidth: col.width ?? 140 }}>
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={schema.columns.length + 3} className="leads-empty-state">
                    No leads match your filters. Try clearing search or status.
                  </td>
                </tr>
              ) : (
                filtered.map(({ row, i }, displayIdx) => (
                  <tr 
                    key={i} 
                    className={`leads-row ${selected.has(i) ? 'selected' : ''}`}
                    onClick={(e) => {
                      const target = e.target as HTMLElement
                      if (target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.closest('button')) return
                      navigate(`/leads/${getLeadId(row, safeIndustryKey, i)}`)
                    }}
                  >
                    <td className="row-num !text-center">
                      <input
                        type="checkbox"
                        checked={selected.has(i)}
                        onChange={() => toggleSelect(i)}
                        className="leads-checkbox"
                      />
                    </td>
                    <td className="row-num">{displayIdx + 1}</td>
                    <td className="row-num">
                      <div className="lead-row-actions">
                        <button
                          type="button"
                          className="detail-open-btn detail-open-btn-leads"
                          onClick={(event) => {
                            event.stopPropagation()
                            navigate(`/leads/${getLeadId(row, safeIndustryKey, i)}`)
                          }}
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Open
                        </button>
                        <LeadActionsMenu
                          row={row}
                          onAction={(action) => handleLeadAction(action, row, i)}
                        />
                      </div>
                    </td>
                    {schema.columns.map((col) => (
                      <td key={col.key}>
                        <CellRenderer
                          col={col}
                          value={row[col.key] as string | number}
                          onChange={(v) => updateCell(i, col.key, v)}
                          statuses={schema.statuses}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="leads-sheet-footer">
          <div>
            Showing <span className="leads-footer-stats-highlight">{filtered.length}</span> of{' '}
            <span className="leads-footer-stats-highlight">{rows.length}</span> leads
            {selected.size > 0 && <> Â· <span className="leads-footer-selected">{selected.size}</span> selected</>}
          </div>
          <div className="leads-footer-tips">
            <span className="chip">âŒ¨ Click any cell to edit</span>
            <span className="chip">ðŸ’¾ Auto-saved locally</span>
          </div>
        </div>
      </div>

      <InteractionModal
        isOpen={interactionDraft !== null && activeInteractionLead !== null}
        onClose={closeInteractionModal}
        leadLabel={activeInteractionLead ? getLeadDisplayName(activeInteractionLead) : ''}
        leadId={interactionDraft?.leadId ?? ''}
        draft={interactionDraft}
        outcomeOptions={interactionOutcomeOptions}
        interactions={savedInteractions}
        onDraftChange={(patch) => setInteractionDraft((current) => (current ? { ...current, ...patch } : current))}
        onSave={saveInteraction}
      />

      {/* Toast Notification */}
      {liveToast && (
        <div className="leads-toast">
          <Sparkles className="h-5 w-5" />
          <div className="leads-toast-text">{liveToast.message}</div>
        </div>
      )}

      {/* Detail Drawer */}
      <Drawer
        isOpen={selectedLeadIdx !== null}
        onClose={() => setSelectedLeadIdx(null)}
        title={selectedLeadIdx !== null ? getLeadDisplayName(rows[selectedLeadIdx] ?? {}) : ''}
        subtitle="Real-time activity and enrichment data"
        width="max-w-2xl"
      >
        {selectedLeadIdx !== null && (
          <div className="leads-drawer-content">
            {/* Quick Actions */}
            <div className="leads-drawer-actions">
               <button
                 className="btn-primary leads-drawer-action-btn"
                 onClick={() => pushAppToast(`Email draft opened for ${getLeadDisplayName(rows[selectedLeadIdx] ?? {})}.`, 'success')}
               >
                 Send Email
               </button>
               <button
                 className="btn-ghost leads-drawer-action-btn leads-drawer-action-ghost"
                 onClick={() => pushAppToast(`Call log started for ${getLeadDisplayName(rows[selectedLeadIdx] ?? {})}.`, 'success')}
               >
                 Log Call
               </button>
               <button
                 className="btn-ghost leads-drawer-action-btn leads-drawer-action-ghost"
                 onClick={() => pushAppToast(`Follow-up scheduling opened for ${getLeadDisplayName(rows[selectedLeadIdx] ?? {})}.`, 'success')}
               >
                 Schedule
               </button>
             </div>
            
            {/* Field Overview */}
            <div>
              <h3 className="leads-drawer-section-title">Lead Data</h3>
              <div className="leads-drawer-grid">
                {schema.columns.map(col => (
                   <div key={col.key} className="leads-drawer-field">
                     <div className="leads-drawer-field-label">{col.label}</div>
                     <div className="leads-drawer-field-value">
                        {col.type === 'currency' 
                          ? formatINR(Number(rows[selectedLeadIdx]?.[col.key]) || 0, { compact: true })
                          : String(rows[selectedLeadIdx]?.[col.key] || 'â€”')}
                     </div>
                   </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h3 className="leads-drawer-section-title">Activity Timeline</h3>
              <Timeline 
                events={[
                  {
                    id: 1,
                    title: 'Viewed Pricing Page',
                    description: 'Lead spent 4 mins on the enterprise pricing page.',
                    date: 'Just now',
                    iconBg: 'rgba(59, 130, 246, 0.15)',
                    iconColor: '#3b82f6',
                    icon: <Search className="w-3.5 h-3.5" />
                  },
                  {
                    id: 2,
                    title: 'Lead Captured',
                    description: `Captured via ${rows[selectedLeadIdx]?.source || 'Website'}.`,
                    date: '15 mins ago',
                    iconBg: 'rgba(16, 185, 129, 0.15)',
                    iconColor: '#10b981',
                    icon: <CheckCircle2 className="w-3.5 h-3.5" />
                  }
                ]}
              />
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}

function InteractionModal({
  isOpen,
  onClose,
  leadLabel,
  leadId,
  draft,
  outcomeOptions,
  interactions,
  onDraftChange,
  onSave,
}: {
  isOpen: boolean
  onClose: () => void
  leadLabel: string
  leadId: string
  draft: InteractionDraft | null
  outcomeOptions: string[]
  interactions: LeadInteraction[]
  onDraftChange: (patch: Partial<InteractionDraft>) => void
  onSave: () => void
}) {
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = 'auto'
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen || !draft) return null

  return createPortal(
    <div className="interaction-modal-shell">
      <div className="interaction-modal-backdrop" onClick={onClose} />
      <div className="interaction-modal-card">
        <div className="interaction-modal-header">
          <div>
            <div className="interaction-modal-title">Add Interaction</div>
            <div className="interaction-modal-subtitle">{leadLabel}</div>
          </div>
          <button type="button" className="interaction-modal-close" onClick={onClose} aria-label="Close interaction modal">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="interaction-modal-body">
          <div className="interaction-lead-banner">
            <div className="interaction-lead-badge">Lead Interaction</div>
            <div className="interaction-lead-name">{leadLabel}</div>
            <div className="interaction-lead-caption">Capture exactly what the customer said, the outcome, and the agreed next step.</div>
          </div>

          <div className="interaction-layout">
            <div className="interaction-main">
              <section className="interaction-panel">
                <div className="interaction-panel-title">Interaction Details</div>
                <div className="interaction-form-grid">
                  <div className="interaction-field">
                    <label className="interaction-label">Lead ID *</label>
                    <input value={leadId} readOnly className="interaction-input interaction-input-readonly" />
                  </div>
                  <div className="interaction-field">
                    <label className="interaction-label">Interaction Type *</label>
                    <div className="interaction-select-wrap">
                      <select
                        value={draft.interactionType}
                        onChange={(e) => onDraftChange({ interactionType: e.target.value })}
                        className="interaction-input interaction-select"
                      >
                        {interactionTypeOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="interaction-field">
                    <label className="interaction-label">Interaction Channel *</label>
                    <div className="interaction-select-wrap">
                      <select
                        value={draft.interactionChannel}
                        onChange={(e) => onDraftChange({ interactionChannel: e.target.value })}
                        className="interaction-input interaction-select"
                      >
                        {interactionChannelOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="interaction-field">
                    <label className="interaction-label">Interaction Date & Time *</label>
                    <input
                      type="datetime-local"
                      value={draft.interactionAt}
                      onChange={(e) => onDraftChange({ interactionAt: e.target.value })}
                      className="interaction-input"
                    />
                  </div>
                </div>
              </section>

              <section className="interaction-panel">
                <div className="interaction-panel-title">Outcome & Follow-up</div>
                <div className="interaction-form-grid interaction-form-grid-compact">
                  <div className="interaction-field">
                    <label className="interaction-label">Interaction Outcome *</label>
                    <div className="interaction-select-wrap">
                      <select
                        value={draft.interactionOutcome}
                        onChange={(e) => onDraftChange({ interactionOutcome: e.target.value })}
                        className="interaction-input interaction-select"
                      >
                        {outcomeOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="interaction-field">
                    <label className="interaction-label">Follow-up Date & Time</label>
                    <input
                      type="datetime-local"
                      value={draft.followUpAt}
                      onChange={(e) => onDraftChange({ followUpAt: e.target.value, followUpRequired: e.target.value !== '' })}
                      className="interaction-input"
                    />
                  </div>
                  <div className="interaction-field">
                    <label className="interaction-label">Follow-up Mode *</label>
                    <div className="interaction-select-wrap">
                      <select
                        value={draft.followUpMode}
                        onChange={(e) => onDraftChange({ followUpMode: e.target.value })}
                        className="interaction-input interaction-select"
                      >
                        {followUpModeOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="interaction-check-row">
                  <label className="interaction-check">
                    <input
                      type="checkbox"
                      checked={draft.autoStatusUpdate}
                      onChange={(e) => onDraftChange({ autoStatusUpdate: e.target.checked })}
                    />
                    <span>Auto Status Update</span>
                  </label>
                  <label className="interaction-check">
                    <input
                      type="checkbox"
                      checked={draft.followUpRequired}
                      onChange={(e) => onDraftChange({ followUpRequired: e.target.checked })}
                    />
                    <span>Follow-up Required</span>
                  </label>
                </div>
              </section>

              <section className="interaction-panel">
                <div className="interaction-panel-title">Customer Remarks</div>
                <div className="interaction-field">
                  <label className="interaction-label">Detailed Remarks *</label>
                  <textarea
                    value={draft.remarks}
                    onChange={(e) => onDraftChange({ remarks: e.target.value })}
                    className="interaction-textarea"
                    placeholder="Capture exactly what the customer asked, objections raised, budget, timeline, and next step."
                  />
                </div>
              </section>
            </div>

            <aside className="interaction-side">
              <div className="interaction-panel interaction-history-panel">
                <div className="interaction-history">
                  <div className="interaction-history-title">
                    <History className="h-4 w-4" />
                    Previous Interactions
                  </div>
                  {interactions.length === 0 ? (
                    <div className="interaction-history-empty">No interactions saved for this lead yet.</div>
                  ) : (
                    <div className="interaction-history-list">
                      {interactions.map((interaction) => (
                        <div key={interaction.id} className="interaction-history-card">
                          <div className="interaction-history-meta">
                            <span>{interaction.interactionType}</span>
                            <span>{interaction.interactionChannel}</span>
                            <span>{new Date(interaction.interactionAt).toLocaleString()}</span>
                          </div>
                          <div className="interaction-history-outcome">{interaction.interactionOutcome}</div>
                          <div className="interaction-history-remarks">{interaction.remarks}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>

        <div className="interaction-modal-footer">
          <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
          <button type="button" className="btn-primary interaction-save-btn" onClick={onSave}>
            <Save className="h-4 w-4" />
            Save Interaction
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

function LeadActionsMenu({
  row,
  onAction,
}: {
  row: LeadRow
  onAction: (action: 'call' | 'interaction' | 'assign' | 'whatsapp' | 'sms' | 'delete') => void
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const [menuPosition, setMenuPosition] = useState<{ top: number, left: number }>({ top: 0, left: 0 })

  useEffect(() => {
    if (!open) return

    const updatePosition = () => {
      const rect = triggerRef.current?.getBoundingClientRect()
      if (!rect) return

      const menuWidth = 192
      const viewportPadding = 12
      const left = Math.min(
        Math.max(rect.right - menuWidth, viewportPadding),
        window.innerWidth - menuWidth - viewportPadding
      )
      const top = Math.min(rect.bottom + 8, window.innerHeight - 320)

      setMenuPosition({ top, left })
    }

    updatePosition()

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node
      const clickedTriggerArea = rootRef.current?.contains(target)
      const clickedMenuArea = menuRef.current?.contains(target)

      if (!clickedTriggerArea && !clickedMenuArea) {
        setOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  const menuItems: Array<{
    id: 'call' | 'interaction' | 'assign' | 'whatsapp' | 'sms' | 'delete'
    label: string
    icon: typeof Phone
    destructive?: boolean
  }> = [
    { id: 'call', label: 'Call Now', icon: Phone },
    { id: 'interaction', label: 'Interaction', icon: Handshake },
    { id: 'assign', label: 'Assign', icon: UserPlus },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
    { id: 'sms', label: 'SMS', icon: MessageSquare },
    { id: 'delete', label: 'Delete Lead', icon: Trash2, destructive: true },
  ]

  return (
    <div ref={rootRef} className={`lead-actions ${open ? 'open' : ''}`}>
      <button
        ref={triggerRef}
        type="button"
        className="lead-actions-trigger"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Open actions for ${getLeadDisplayName(row)}`}
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {open && (
        createPortal(
          <div
            ref={menuRef}
            className="lead-actions-menu"
            role="menu"
            style={{ top: menuPosition.top, left: menuPosition.left }}
          >
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  type="button"
                  role="menuitem"
                  className={`lead-actions-item ${item.destructive ? 'destructive' : ''}`}
                  onClick={() => {
                    onAction(item.id)
                    setOpen(false)
                  }}
                >
                  <span className="lead-actions-item-label">
                    <Icon className="h-3.5 w-3.5" />
                    {item.label}
                  </span>
                </button>
              )
            })}
          </div>,
          document.body
        )
      )}
    </div>
  )
}

function StatusSelect({
  value,
  statuses,
  onChange,
}: {
  value: string
  statuses: string[]
  onChange: (value: string) => void
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const tone = statusTone(value, statuses)

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  return (
    <div
      ref={rootRef}
      className={`status-select ${open ? 'open' : ''}`}
      style={{ '--status-tone': tone } as CSSProperties}
    >
      <button
        type="button"
        className="status-select-trigger"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="status-select-value">
          <span className="status-select-dot" />
          <span className="status-select-label">{value}</span>
        </span>
        <ChevronDown className={`status-select-chevron ${open ? 'open' : ''}`} />
      </button>

      {open && (
        <div className="status-select-menu" role="listbox" aria-label="Status options">
          {statuses.map((status) => {
            const optionTone = statusTone(status, statuses)
            const active = status === value
            return (
              <button
                key={status}
                type="button"
                role="option"
                aria-selected={active}
                className={`status-select-option ${active ? 'active' : ''}`}
                style={{ '--option-tone': optionTone } as CSSProperties}
                onClick={() => {
                  onChange(status)
                  setOpen(false)
                }}
              >
                <span className="status-select-option-value">
                  <span className="status-select-dot" />
                  <span className="status-select-label">{status}</span>
                </span>
                {active && <Check className="status-select-check" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function MiniStat({
  label,
  value,
  hint,
  accent,
  icon,
}: {
  label: string
  value: string
  hint?: string
  accent: string
  icon: React.ReactNode
}) {
  return (
    <div className="card-soft leads-ministat-card">
      <div
        className="leads-ministat-icon"
        style={{ background: `${accent}22`, color: accent }}
      >
        {icon}
      </div>
      <div className="leads-ministat-content">
        <div className="leads-ministat-label">{label}</div>
        <div className="leads-ministat-value" title={value}>{value}</div>
        {hint && <div className="leads-ministat-hint">{hint}</div>}
      </div>
    </div>
  )
}
