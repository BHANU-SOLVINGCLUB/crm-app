import { useState, useEffect } from 'react'
import type { Deal } from '../data/pipeline'
import { STAGES, fmt } from '../data/pipeline'
import { fetchDealActivities, createDealActivity } from '../../api/sales'
import type { ApiDealActivity } from '../../api/sales'
import './SidePanel.css'

interface Props {
  deal: Deal | null
  orgId: number | null
  onClose: () => void
  onMoveStage: (id: number, stage: string) => void
  onMarkWon: () => void
  onMarkLost: () => void
  onEdit: () => void
}

const probTone = (value: number) => value >= 70 ? 'high' : value >= 40 ? 'medium' : 'low'

const ACTIVITY_ICON: Record<string, string> = {
  note:         '📝',
  call:         '📞',
  email:        '✉️',
  meeting:      '📅',
  stage_change: '🔀',
}

function timeAgo(dateStr: string): string {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 864e5)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  return `${days}d ago`
}

export default function SidePanel({
  deal: d, orgId, onClose, onMoveStage, onMarkWon, onMarkLost, onEdit,
}: Props) {
  const open = !!d
  const st = d ? STAGES.find((s) => s.id === d.stage) : null
  const daysLeft = d ? Math.ceil((new Date(d.closeDate).getTime() - Date.now()) / 864e5) : 0

  // ── Real deal activities ───────────────────────────────────────────
  const [activities, setActivities] = useState<ApiDealActivity[]>([])
  const [loadingActivities, setLoadingActivities] = useState(false)

  // ── Quick Note ────────────────────────────────────────────────────
  const [note, setNote] = useState('')
  const [savingNote, setSavingNote] = useState(false)

  // Load real activities whenever the panel opens for a different deal
  useEffect(() => {
    if (!d || !orgId) { setActivities([]); return }
    setLoadingActivities(true)
    fetchDealActivities(orgId, d.id)
      .then(setActivities)
      .catch(() => setActivities([]))
      .finally(() => setLoadingActivities(false))
  }, [d?.id, orgId])

  const saveNote = async () => {
    if (!note.trim() || !d || !orgId) return
    setSavingNote(true)
    try {
      const created = await createDealActivity(orgId, d.id, { type: 'note', notes: note.trim() })
      setActivities((prev) => [created, ...prev])
      setNote('')
    } catch {
      // silently fail — note stays in textarea for retry
    } finally {
      setSavingNote(false)
    }
  }

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <div className={`fixed top-0 right-0 h-screen w-[380px] max-w-full bg-white border-l border-theme z-50 flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'} text-theme-primary shadow-card-lg`}>
        {d && (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-theme bg-theme-surface">
              <span className={`side-stage-dot stage-${d.stage}`} />
              <span className="text-[16px] font-bold flex-1 truncate text-theme-primary">{d.company}</span>
              <button
                onClick={onClose}
                className="h-8 w-8 rounded-lg border border-theme flex items-center justify-center text-theme-muted hover:text-theme-primary hover:bg-theme-surface transition text-lg"
              >✕</button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">

              {/* Deal Information */}
              <section>
                <div className="text-[11px] font-bold uppercase tracking-widest text-theme-muted mb-3">Deal Information</div>
                {[
                  ['Value',      fmt(d.value)],
                  ['Contact',    d.contact],
                  ['Email',      d.email || '—'],
                  ['Sector',     d.sector || '—'],
                  ['Stage',      st?.name || d.stage],
                  ['Priority',   d.priority],
                  ['Close Date', `${d.closeDate}${daysLeft <= 7 ? ` (${daysLeft}d!)` : ''}`],
                ].map(([label, val]) => (
                  <div key={label} className="flex items-center justify-between py-2 border-b border-theme last:border-none">
                    <span className="text-[12px] text-theme-secondary">{label}</span>
                    <span className={`side-info-value ${label === 'Stage' ? `stage-text-${d.stage}` : ''} ${label === 'Priority' ? `side-priority priority-${d.priority}` : ''} ${label === 'Close Date' && daysLeft <= 7 ? 'side-close-urgent' : ''}`}>
                      {val}
                    </span>
                  </div>
                ))}
              </section>

              {/* Win Probability */}
              <section>
                <div className="text-[11px] font-bold uppercase tracking-widest text-theme-muted mb-3">Win Probability</div>
                <div className="rounded-xl bg-[#f8fafd] border border-theme p-4">
                  <div className="flex justify-between text-[13px] mb-2 text-theme-primary">
                    <span>Likelihood to close</span>
                    <span className={`font-bold prob-text-${probTone(d.prob)}`}>{d.prob}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-theme-surface overflow-hidden">
                    <div className={`side-prob-fill prob-${probTone(d.prob)} prob-width-${Math.round(d.prob / 5) * 5}`} />
                  </div>
                  <p className="text-[11.5px] text-theme-secondary mt-2">
                    {d.prob >= 70
                      ? 'High confidence — push to close now!'
                      : d.prob >= 40
                        ? 'Medium — keep nurturing this deal.'
                        : 'Low — needs more qualification.'}
                  </p>
                </div>
              </section>

              {/* Move to Stage */}
              <section>
                <div className="text-[11px] font-bold uppercase tracking-widest text-theme-muted mb-3">Move to Stage</div>
                <div className="flex flex-wrap gap-2">
                  {STAGES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => onMoveStage(d.id, s.id)}
                      className={`side-stage-button stage-border-${s.id} ${s.id === d.stage ? `active stage-bg-${s.id}` : ''}`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </section>

              {/* Recent Activity — now real backend data */}
              <section>
                <div className="text-[11px] font-bold uppercase tracking-widest text-theme-muted mb-3">
                  Recent Activity
                  {loadingActivities && <span className="ml-2 font-normal normal-case tracking-normal text-theme-muted">Loading…</span>}
                </div>
                <div className="space-y-0 divide-y divide-line">
                  {activities.length === 0 && !loadingActivities && (
                    <p className="text-[12px] text-theme-muted py-3">No activities yet. Add a note below to get started.</p>
                  )}
                  {activities.slice(0, 5).map((a) => (
                    <div key={a.id} className="flex items-start gap-3 py-3">
                      <span className="h-8 w-8 rounded-lg bg-[#f0f5fb] flex items-center justify-center text-[14px] flex-shrink-0">
                        {ACTIVITY_ICON[a.type] ?? '💬'}
                      </span>
                      <div className="min-w-0">
                        <div className="text-[13px] font-medium text-theme-primary truncate">{a.notes || a.type}</div>
                        <div className="text-[11px] text-theme-muted">
                          {a.performed_by_name ?? 'System'} · {timeAgo(a.created_at)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Quick Note — now saves to backend */}
              <section>
                <div className="text-[11px] font-bold uppercase tracking-widest text-theme-muted mb-3">Quick Note</div>
                <textarea
                  className="w-full rounded-lg border border-theme bg-[#f8fafd] px-3 py-2 text-sm text-theme-primary outline-none placeholder:text-theme-muted focus:border-brand/60 resize-none h-20 transition"
                  placeholder="Add a note about this deal..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
                <button
                  onClick={saveNote}
                  disabled={savingNote || !note.trim()}
                  className="mt-2 w-full py-1.5 rounded-lg border border-theme text-[12px] font-semibold text-theme-secondary hover:bg-theme-surface transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {savingNote ? 'Saving…' : '✓ Save Note'}
                </button>
              </section>
            </div>

            {/* Footer actions */}
            <div className="flex gap-2 px-5 py-4 border-t border-theme bg-theme-surface">
              <button onClick={onMarkWon}  className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-semibold transition flex items-center justify-center gap-1">🏆 Won</button>
              <button onClick={onMarkLost} className="flex-1 py-2 rounded-lg border border-red-500/40 text-red-500 hover:bg-red-50/50 text-[13px] font-semibold transition flex items-center justify-center gap-1">✕ Lost</button>
              <button onClick={onEdit}     className="flex-1 py-2 rounded-lg btn-primary text-[13px] font-semibold flex items-center justify-center gap-1">✏ Edit</button>
            </div>
          </>
        )}
      </div>
    </>
  )
}