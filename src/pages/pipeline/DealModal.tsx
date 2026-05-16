import { useState, useEffect } from 'react'
import type { Deal } from '../../data/pipeline'
import { STAGES } from '../../data/pipeline'

interface Props {
  open: boolean
  onClose: () => void
  onSave: (deal: Omit<Deal, 'id' | 'lastAct' | 'lastActDays'>) => void
  editDeal?: Deal | null
  defaultStage?: string
}

const empty = { company:'', contact:'', email:'', value:0, stage:'lead', prob:50, priority:'medium', closeDate:'', sector:'' }

export default function DealModal({ open, onClose, onSave, editDeal, defaultStage }: Props) {
  const [f, setF] = useState({ ...empty })

  useEffect(() => {
    if (editDeal) setF({ company:editDeal.company, contact:editDeal.contact, email:editDeal.email, value:editDeal.value, stage:editDeal.stage, prob:editDeal.prob, priority:editDeal.priority, closeDate:editDeal.closeDate, sector:editDeal.sector })
    else setF({ ...empty, stage: defaultStage || 'lead' })
  }, [editDeal, defaultStage, open])

  if (!open) return null

  const set = (k: string, v: string | number) => setF(p => ({ ...p, [k]: v }))

  const handleSave = () => {
    if (!f.company.trim() || !f.contact.trim() || !f.value || !f.closeDate) return
    onSave(f as Omit<Deal, 'id' | 'lastAct' | 'lastActDays'>)
  }

  const inp = "w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500/60 transition"
  const sel = inp + " cursor-pointer"

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#0c1424] border border-white/10 rounded-2xl w-[480px] max-w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-2 mb-5">
          <span className="text-lg">💼</span>
          <h2 className="text-[17px] font-bold">{editDeal ? `Edit — ${editDeal.company}` : 'Add New Deal'}</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[12px] font-semibold text-slate-400 mb-1 block">Company name *</label>
            <input className={inp} placeholder="e.g. Ravi Pharma Pvt Ltd" value={f.company} onChange={e => set('company', e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] font-semibold text-slate-400 mb-1 block">Contact person *</label>
              <input className={inp} placeholder="e.g. Ravi Shankar" value={f.contact} onChange={e => set('contact', e.target.value)} />
            </div>
            <div>
              <label className="text-[12px] font-semibold text-slate-400 mb-1 block">Email</label>
              <input className={inp} type="email" placeholder="contact@company.in" value={f.email} onChange={e => set('email', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] font-semibold text-slate-400 mb-1 block">Deal value (₹) *</label>
              <input className={inp} type="number" placeholder="e.g. 450000" value={f.value || ''} onChange={e => set('value', Number(e.target.value))} />
            </div>
            <div>
              <label className="text-[12px] font-semibold text-slate-400 mb-1 block">Close date *</label>
              <input className={inp} type="date" value={f.closeDate} onChange={e => set('closeDate', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] font-semibold text-slate-400 mb-1 block">Stage</label>
              <select className={sel} value={f.stage} onChange={e => set('stage', e.target.value)}>
                {STAGES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[12px] font-semibold text-slate-400 mb-1 block">Priority</label>
              <select className={sel} value={f.priority} onChange={e => set('priority', e.target.value)}>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] font-semibold text-slate-400 mb-1 block">Win probability %</label>
              <input className={inp} type="number" min={0} max={100} placeholder="e.g. 60" value={f.prob || ''} onChange={e => set('prob', Number(e.target.value))} />
            </div>
            <div>
              <label className="text-[12px] font-semibold text-slate-400 mb-1 block">Sector</label>
              <input className={inp} placeholder="e.g. Healthcare" value={f.sector} onChange={e => set('sector', e.target.value)} />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-white/10 text-sm font-medium text-slate-300 hover:bg-white/5 transition">Cancel</button>
          <button onClick={handleSave} className="btn-primary px-4 py-2 text-sm">✓ Save Deal</button>
        </div>
      </div>
    </div>
  )
}
