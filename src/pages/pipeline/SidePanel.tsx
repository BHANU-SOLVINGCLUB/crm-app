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
      <div className={`fixed top-0 right-0 h-screen w-[380px] max-w-full bg-[#0a1424] border-l border-white/10 z-50 flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        {d && (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
              <span className="h-3 w-3 rounded-full flex-shrink-0" style={{ background: st?.color }} />
              <span className="text-[16px] font-bold flex-1 truncate">{d.company}</span>
              <button onClick={onClose} className="h-8 w-8 rounded-lg border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition text-lg">✕</button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">

              {/* Deal info */}
              <section>
                <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-3">Deal Information</div>
                {[
                  ['Value', fmt(d.value)],
                  ['Contact', d.contact],
                  ['Email', d.email || '—'],
                  ['Sector', d.sector || '—'],
                  ['Stage', st?.name || d.stage],
                  ['Priority', d.priority],
                  ['Close Date', `${d.closeDate}${daysLeft <= 7 ? ` (${daysLeft}d!)` : ''}`],
                ].map(([label, val]) => (
                  <div key={label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-none">
                    <span className="text-[12px] text-slate-500">{label}</span>
                    <span
                      className="text-[13px] font-semibold"
                      style={{
                        color: label === 'Stage' ? st?.color :
                               label === 'Priority' ? pColor(d.priority) :
                               label === 'Close Date' && daysLeft <= 7 ? '#f87171' : undefined,
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
                <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-3">Win Probability</div>
                <div className="rounded-xl bg-white/[0.04] border border-white/10 p-4">
                  <div className="flex justify-between text-[13px] mb-2">
                    <span>Likelihood to close</span>
                    <span className="font-bold" style={{ color: probColor(d.prob) }}>{d.prob}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${d.prob}%`, background: probColor(d.prob) }} />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">
                    {d.prob >= 70 ? 'High confidence — push to close now!' : d.prob >= 40 ? 'Medium — keep nurturing this deal.' : 'Low — needs more qualification.'}
                  </p>
                </div>
              </section>

              {/* Move stage */}
              <section>
                <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-3">Move to Stage</div>
                <div className="flex flex-wrap gap-2">
                  {STAGES.map(s => (
                    <button
                      key={s.id}
                      onClick={() => onMoveStage(d.id, s.id)}
                      className="text-[11px] font-semibold px-3 py-1.5 rounded-full border transition"
                      style={s.id === d.stage
                        ? { background: s.color, borderColor: s.color, color: '#fff' }
                        : { borderColor: 'rgba(255,255,255,0.1)', color: '#94a3b8' }
                      }
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </section>

              {/* Activity */}
              <section>
                <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-3">Recent Activity</div>
                <div className="space-y-0 divide-y divide-white/5">
                  {[
                    { icon: '📞', text: d.lastAct, time: d.lastActDays === 0 ? 'Today' : `${d.lastActDays}d ago` },
                    { icon: '✉️', text: 'Email thread started', time: `${d.lastActDays + 3}d ago` },
                    { icon: '👤', text: 'Deal created', time: `${d.lastActDays + 7}d ago` },
                  ].map((a, i) => (
                    <div key={i} className="flex items-start gap-3 py-3">
                      <span className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-[14px] flex-shrink-0">{a.icon}</span>
                      <div>
                        <div className="text-[13px] font-medium">{a.text}</div>
                        <div className="text-[11px] text-slate-500">{a.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Note */}
              <section>
                <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-3">Quick Note</div>
                <textarea
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500/60 resize-none h-20 transition"
                  placeholder="Add a note about this deal..."
                />
                <button className="mt-2 w-full py-1.5 rounded-lg border border-white/10 text-[12px] font-semibold text-slate-300 hover:bg-white/5 transition">✓ Save Note</button>
              </section>
            </div>

            {/* Footer actions */}
            <div className="flex gap-2 px-5 py-4 border-t border-white/10">
              <button onClick={onMarkWon} className="flex-1 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-[13px] font-semibold transition flex items-center justify-center gap-1">🏆 Won</button>
              <button onClick={onMarkLost} className="flex-1 py-2 rounded-lg border border-red-500/40 text-red-400 hover:bg-red-500/10 text-[13px] font-semibold transition flex items-center justify-center gap-1">✕ Lost</button>
              <button onClick={onEdit} className="flex-1 py-2 rounded-lg btn-primary text-[13px] font-semibold flex items-center justify-center gap-1">✏ Edit</button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
