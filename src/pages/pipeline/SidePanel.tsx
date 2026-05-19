import type { Deal } from '../../data/pipeline'
import { STAGES, fmt, pColor, pBg, probColor } from '../../data/pipeline'

interface Props {
  deal: Deal | null
  onClose: () => void
  onMoveStage: (id: number, stage: string) => void
  onMarkWon: () => void
  onMarkLost: () => void
  onEdit: () => void
}

export default function SidePanel({ deal: d, onClose, onMoveStage, onMarkWon, onMarkLost, onEdit }: Props) {
  const open = !!d
  const st = d ? STAGES.find(s => s.id === d.stage) : null
  const daysLeft = d ? Math.ceil((new Date(d.closeDate).getTime() - Date.now()) / 864e5) : 0

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Panel */}
      <div className={`fixed top-0 right-0 h-screen w-[380px] max-w-full bg-white border-l border-line z-50 flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'} text-slate-700 shadow-card-lg`}>
        {d && (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-line bg-slate-50/50">
              <span className="h-3 w-3 rounded-full flex-shrink-0" style={{ background: st?.color }} />
              <span className="text-[16px] font-bold flex-1 truncate text-slate-900">{d.company}</span>
              <button onClick={onClose} className="h-8 w-8 rounded-lg border border-line flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition text-lg">✕</button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">

              {/* Deal info */}
              <section>
                <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">Deal Information</div>
                {[
                  ['Value', fmt(d.value)],
                  ['Contact', d.contact],
                  ['Email', d.email || '—'],
                  ['Sector', d.sector || '—'],
                  ['Stage', st?.name || d.stage],
                  ['Priority', d.priority],
                  ['Close Date', `${d.closeDate}${daysLeft <= 7 ? ` (${daysLeft}d!)` : ''}`],
                ].map(([label, val]) => (
                  <div key={label} className="flex items-center justify-between py-2 border-b border-line last:border-none">
                    <span className="text-[12px] text-slate-500">{label}</span>
                    <span
                      className="text-[13px] font-semibold text-slate-800"
                      style={{
                        color: label === 'Stage' ? st?.color :
                               label === 'Priority' ? pColor(d.priority) :
                               label === 'Close Date' && daysLeft <= 7 ? '#ef4444' : undefined,
                        background: label === 'Priority' ? pBg(d.priority) : undefined,
                        padding: label === 'Priority' ? '2px 10px' : undefined,
                        borderRadius: label === 'Priority' ? '99px' : undefined,
                        fontSize: label === 'Priority' ? '12px' : undefined,
                      }}
                    >
                      {val}
                    </span>
                  </div>
                ))}
              </section>

              {/* Win probability */}
              <section>
                <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">Win Probability</div>
                <div className="rounded-xl bg-[#f8fafd] border border-line p-4">
                  <div className="flex justify-between text-[13px] mb-2 text-slate-700">
                    <span>Likelihood to close</span>
                    <span className="font-bold" style={{ color: probColor(d.prob) }}>{d.prob}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${d.prob}%`, background: probColor(d.prob) }} />
                  </div>
                  <p className="text-[11.5px] text-slate-500 mt-2">
                    {d.prob >= 70 ? 'High confidence — push to close now!' : d.prob >= 40 ? 'Medium — keep nurturing this deal.' : 'Low — needs more qualification.'}
                  </p>
                </div>
              </section>

              {/* Move stage */}
              <section>
                <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">Move to Stage</div>
                <div className="flex flex-wrap gap-2">
                  {STAGES.map(s => (
                    <button
                      key={s.id}
                      onClick={() => onMoveStage(d.id, s.id)}
                      className="text-[11px] font-semibold px-3 py-1.5 rounded-full border transition"
                      style={s.id === d.stage
                        ? { background: s.color, borderColor: s.color, color: '#fff' }
                        : { borderColor: 'rgba(0,0,0,0.08)', color: '#64748b' }
                      }
                      onMouseEnter={e => { if (s.id !== d.stage) e.currentTarget.style.background = '#f8fafd' }}
                      onMouseLeave={e => { if (s.id !== d.stage) e.currentTarget.style.background = 'transparent' }}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </section>

              {/* Activity */}
              <section>
                <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">Recent Activity</div>
                <div className="space-y-0 divide-y divide-line">
                  {[
                    { icon: '📞', text: d.lastAct, time: d.lastActDays === 0 ? 'Today' : `${d.lastActDays}d ago` },
                    { icon: '✉️', text: 'Email thread started', time: `${d.lastActDays + 3}d ago` },
                    { icon: '👤', text: 'Deal created', time: `${d.lastActDays + 7}d ago` },
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

              {/* Note */}
              <section>
                <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">Quick Note</div>
                <textarea
                  className="w-full rounded-lg border border-line bg-[#f8fafd] px-3 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-brand/60 resize-none h-20 transition"
                  placeholder="Add a note about this deal..."
                />
                <button className="mt-2 w-full py-1.5 rounded-lg border border-line text-[12px] font-semibold text-slate-600 hover:bg-slate-50 transition">✓ Save Note</button>
              </section>
            </div>

            {/* Footer actions */}
            <div className="flex gap-2 px-5 py-4 border-t border-line bg-slate-50/50">
              <button onClick={onMarkWon} className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-semibold transition flex items-center justify-center gap-1">🏆 Won</button>
              <button onClick={onMarkLost} className="flex-1 py-2 rounded-lg border border-red-500/40 text-red-500 hover:bg-red-50/50 text-[13px] font-semibold transition flex items-center justify-center gap-1">✕ Lost</button>
              <button onClick={onEdit} className="flex-1 py-2 rounded-lg btn-primary text-[13px] font-semibold flex items-center justify-center gap-1">✏ Edit</button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
