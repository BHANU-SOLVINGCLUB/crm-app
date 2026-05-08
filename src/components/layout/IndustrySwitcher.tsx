import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import clsx from 'clsx'
import { useIndustryStore, industries } from '../../store/industryStore'
import type { IndustryKey } from '../../data/industries'

export default function IndustrySwitcher() {
  const current = useIndustryStore((s) => s.current)
  const setIndustry = useIndustryStore((s) => s.setIndustry)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const active = industries.find((i) => i.key === current) ?? industries[0]
  const ActiveIcon = active.icon

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="group flex items-center gap-3 rounded-xl border border-line bg-white/[0.04] hover:bg-white/[0.08] transition px-3 py-2"
      >
        <span
          className="icon-tile h-9 w-9"
          style={{ background: `${active.accent}22`, color: active.accent }}
        >
          <ActiveIcon className="h-[18px] w-[18px]" strokeWidth={1.8} />
        </span>
        <span className="text-left">
          <span className="block text-[10.5px] uppercase tracking-widest text-slate-500 font-semibold">
            Industry
          </span>
          <span className="block text-[14px] font-semibold leading-tight">{active.name}</span>
        </span>
        <ChevronDown
          className={clsx('h-4 w-4 text-slate-400 transition', open && 'rotate-180')}
          strokeWidth={2}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-[320px] rounded-2xl border border-line bg-[#0c1424]/95 backdrop-blur-xl shadow-glass-lg p-2">
          <div className="px-3 py-2 text-[10.5px] uppercase tracking-widest text-slate-500 font-semibold">
            Switch industry template
          </div>
          <div className="grid grid-cols-1 gap-1 max-h-[420px] overflow-y-auto">
            {industries.map((i) => {
              const Icon = i.icon
              const selected = i.key === (current as IndustryKey)
              return (
                <button
                  key={i.key}
                  onClick={() => {
                    setIndustry(i.key)
                    setOpen(false)
                  }}
                  className={clsx(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 transition text-left',
                    selected ? 'bg-white/[0.08]' : 'hover:bg-white/[0.05]'
                  )}
                >
                  <span
                    className="h-9 w-9 rounded-lg flex items-center justify-center"
                    style={{ background: `${i.accent}22`, color: i.accent }}
                  >
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
                  </span>
                  <span className="flex-1">
                    <span className="block text-[13.5px] font-semibold">{i.name}</span>
                    <span className="block text-[11.5px] text-slate-400">{i.tagline}</span>
                  </span>
                  {selected && <Check className="h-4 w-4 text-brand-blue" />}
                </button>
              )
            })}
          </div>
          <div className="px-3 py-2 mt-1 border-t border-line text-[11px] text-slate-500">
            Workflows, fields, campaigns, platforms & sample data update everywhere.
          </div>
        </div>
      )}
    </div>
  )
}
