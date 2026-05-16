import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import clsx from 'clsx'
import { useIndustryStore, industries } from '../../store/industryStore'
import type { IndustryKey } from '../../data/industries'

export default function IndustrySwitcher() {
  const current     = useIndustryStore((s) => s.current)
  const setIndustry = useIndustryStore((s) => s.setIndustry)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const active     = industries.find((i) => i.key === current) ?? industries[0]
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
      {/* Trigger button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 transition-all"
        style={{
          background: open ? '#f0f5fb' : 'transparent',
          border: '1px solid transparent',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = '#f0f5fb')}
        onMouseLeave={e => { if (!open) e.currentTarget.style.background = 'transparent' }}
      >
        {/* Industry icon */}
        <span
          className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `${active.accent}18`, color: active.accent }}
        >
          <ActiveIcon className="h-[16px] w-[16px]" strokeWidth={2} />
        </span>

        {/* Labels */}
        <span className="text-left hidden sm:block">
          <span className="block text-[9.5px] uppercase tracking-[0.1em] font-bold" style={{ color: '#9ca3af' }}>
            Industry
          </span>
          <span className="block text-[13px] font-semibold leading-tight text-gray-900">
            {active.name}
          </span>
        </span>

        {/* Chevron */}
        <ChevronDown
          className={clsx('h-4 w-4 transition-transform flex-shrink-0', open && 'rotate-180')}
          strokeWidth={2}
          style={{ color: '#6b7280' }}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute left-0 top-full mt-2 w-[310px] rounded-xl p-1.5 z-50"
          style={{
            background: '#ffffff',
            border: '1px solid rgba(0,0,0,0.09)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)',
          }}
        >
          {/* Dropdown header */}
          <div className="px-3 pt-2 pb-1.5 text-[10.5px] uppercase tracking-widest font-semibold" style={{ color: '#9ca3af' }}>
            Switch industry template
          </div>

          {/* Industry list */}
          <div className="grid grid-cols-1 gap-0.5 max-h-[400px] overflow-y-auto">
            {industries.map((i) => {
              const Icon     = i.icon
              const selected = i.key === (current as IndustryKey)
              return (
                <button
                  key={i.key}
                  onClick={() => { setIndustry(i.key); setOpen(false) }}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all w-full"
                  style={{
                    background: selected ? `${i.accent}10` : 'transparent',
                  }}
                  onMouseEnter={e => { if (!selected) e.currentTarget.style.background = '#f3f7fe' }}
                  onMouseLeave={e => { e.currentTarget.style.background = selected ? `${i.accent}10` : 'transparent' }}
                >
                  <span
                    className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${i.accent}15`, color: i.accent }}
                  >
                    <Icon className="h-[16px] w-[16px]" strokeWidth={2} />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[13px] font-semibold text-gray-800 truncate">{i.name}</span>
                    <span className="block text-[11.5px] truncate" style={{ color: '#9ca3af' }}>{i.tagline}</span>
                  </span>
                  {selected && (
                    <Check className="h-4 w-4 flex-shrink-0" strokeWidth={2.5} style={{ color: '#1a56db' }} />
                  )}
                </button>
              )
            })}
          </div>

          {/* Footer note */}
          <div
            className="px-3 py-2 mt-1 text-[11px] rounded-b-lg"
            style={{ borderTop: '1px solid rgba(0,0,0,0.06)', color: '#9ca3af' }}
          >
            Workflows, fields, campaigns & data update everywhere.
          </div>
        </div>
      )}
    </div>
  )
}
