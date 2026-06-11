import type { Deal } from '../../data/pipeline'
import { STAGES, fmt } from '../../data/pipeline'
import './SidePanel.css'

interface Props {
  deal: Deal | null
  onClose: () => void
  onMoveStage: (id: number, stage: string) => void
  onMarkWon: () => void
  onMarkLost: () => void
  onEdit: () => void
  onOpen: () => void
}

const probTone = (value: number) => value >= 70 ? 'high' : value >= 40 ? 'medium' : 'low'

export default function SidePanel({ deal: d, onClose, onMoveStage, onMarkWon, onMarkLost, onEdit, onOpen }: Props) {
  const open = !!d
  const st = d ? STAGES.find(s => s.id === d.stage) : null
  const daysLeft = d ? Math.ceil((new Date(d.closeDate).getTime() - Date.now()) / 864e5) : 0

  return (
    <>
      <div className={`fixed inset-0 bg-black/40 z-40 transition-opacity ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />

      <div className={`fixed top-0 right-0 h-screen w-[380px] max-w-full bg-white border-l border-line z-50 flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'} text-slate-700 shadow-card-lg`}>
        {d && (
          <>
            <div className="flex items-center gap-3 px-5 py-4 border-b border-line bg-slate-50/50">
              <span className={`side-stage-dot stage-${d.stage}`} />
              <span className="text-[16px] font-bold flex-1 truncate text-slate-900">{d.company}</span>
              <button onClick={onClose} className="h-8 w-8 rounded-lg border border-line flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition text-lg">âœ•</button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
              <section>
                <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">Deal Information</div>
                {[
                  ['Value', fmt(d.value)],
                  ['Contact', d.contact],
                  ['Email', d.email || 'â€”'],
                  ['Sector', d.sector || 'â€”'],
                  ['Stage', st?.name || d.stage],
                  ['Priority', d.priority],
                  ['Close Date', `${d.closeDate}${daysLeft <= 7 ? ` (${daysLeft}d!)` : ''}`],
                ].map(([label, val]) => (
                  <div key={label} className="flex items-center justify-between py-2 border-b border-line last:border-none">
                    <span className="text-[12px] text-slate-500">{label}</span>
                    <span className={`side-info-value ${label === 'Stage' ? `stage-text-${d.stage}` : ''} ${label === 'Priority' ? `side-priority priority-${d.priority}` : ''} ${label === 'Close Date' && daysLeft <= 7 ? 'side-close-urgent' : ''}`}>
                      {val}
                    </span>
                  </div>
                ))}
              </section>

              <section>
                <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">Win Probability</div>
                <div className="rounded-xl bg-[#f8fafd] border border-line p-4">
                  <div className="flex justify-between text-[13px] mb-2 text-slate-700">
                    <span>Likelihood to close</span>
                    <span className={`font-bold prob-text-${probTone(d.prob)}`}>{d.prob}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div className={`side-prob-fill prob-${probTone(d.prob)} prob-width-${Math.round(d.prob / 5) * 5}`} />
                  </div>
                  <p className="text-[11.5px] text-slate-500 mt-2">
                    {d.prob >= 70 ? 'High confidence - push to close now!' : d.prob >= 40 ? 'Medium - keep nurturing this deal.' : 'Low - needs more qualification.'}
                  </p>
                </div>
              </section>

              <section>
                <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">Move to Stage</div>
                <div className="flex flex-wrap gap-2">
                  {STAGES.map(s => (
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

              <section>
                <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">Recent Activity</div>
                <div className="space-y-0 divide-y divide-line">
                  {[
                    { icon: 'ðŸ“ž', text: d.lastAct, time: d.lastActDays === 0 ? 'Today' : `${d.lastActDays}d ago` },
                    { icon: 'âœ‰ï¸', text: 'Email thread started', time: `${d.lastActDays + 3}d ago` },
                    { icon: 'ðŸ‘¤', text: 'Deal created', time: `${d.lastActDays + 7}d ago` },
                  ].map((a, i) => (
                    <div key={i} className="flex items-start gap-3 py-3">
                      <span className="h-8 w-8 rounded-lg bg-[#f0f5fb] flex items-center justify-center text-[14px] flex-shrink-0">{a.icon}</span>
                      <div>
                        <div className="text-[13px] font-medium text-slate-800">{a.text}</div>
                        <div className="text-[11px] text-slate-400">{a.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">Quick Note</div>
                <textarea className="w-full rounded-lg border border-line bg-[#f8fafd] px-3 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-brand/60 resize-none h-20 transition" placeholder="Add a note about this deal..." />
                <button className="mt-2 w-full py-1.5 rounded-lg border border-line text-[12px] font-semibold text-slate-600 hover:bg-slate-50 transition">âœ“ Save Note</button>
              </section>
            </div>

            <div className="flex gap-2 px-5 py-4 border-t border-line bg-slate-50/50">
              <button onClick={onOpen} className="detail-open-btn detail-open-btn-sales flex-1">Open</button>
              <button onClick={onMarkWon} className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-semibold transition flex items-center justify-center gap-1">ðŸ† Won</button>
              <button onClick={onMarkLost} className="flex-1 py-2 rounded-lg border border-red-500/40 text-red-500 hover:bg-red-50/50 text-[13px] font-semibold transition flex items-center justify-center gap-1">âœ• Lost</button>
              <button onClick={onEdit} className="flex-1 py-2 rounded-lg btn-primary text-[13px] font-semibold flex items-center justify-center gap-1">âœ Edit</button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
