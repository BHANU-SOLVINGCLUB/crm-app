import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { useIndustryStore, industries } from '../../store/industryStore'
import type { IndustryKey } from '../../data/industries'
import './IndustrySwitcher.css'

export default function IndustrySwitcher() {
  const current = useIndustryStore((s) => s.current)
  const setIndustry = useIndustryStore((s) => s.setIndustry)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const active = industries.find((i) => i.key === current) ?? industries[0]
  const ActiveIcon = active.icon

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div className="industry-switcher" ref={ref}>
      <button
        onClick={() => setOpen((value) => !value)}
        className={`industry-switcher-btn ${open ? 'active' : ''}`}
        type="button"
      >
        <span className={`industry-icon industry-${active.key}`}>
          <ActiveIcon className="industry-icon-svg" strokeWidth={2} />
        </span>
        <span className="industry-labels">
          <span className="industry-eyebrow">Industry</span>
          <span className="industry-name">{active.name}</span>
        </span>
        <ChevronDown className={`industry-chevron ${open ? 'open' : ''}`} strokeWidth={2} />
      </button>

      {open && (
        <div className="industry-menu">
          <div className="industry-menu-title">Switch industry template</div>
          <div className="industry-list">
            {industries.map((industry) => {
              const Icon = industry.icon
              const selected = industry.key === (current as IndustryKey)
              return (
                <button
                  key={industry.key}
                  onClick={() => {
                    setIndustry(industry.key)
                    setOpen(false)
                  }}
                  className={`industry-option ${selected ? 'selected' : ''}`}
                  type="button"
                >
                  <span className={`industry-icon industry-${industry.key}`}>
                    <Icon className="industry-icon-svg" strokeWidth={2} />
                  </span>
                  <span className="industry-option-copy">
                    <span className="industry-option-name">{industry.name}</span>
                    <span className="industry-option-tagline">{industry.tagline}</span>
                  </span>
                  {selected && <Check className="industry-check" strokeWidth={2.5} />}
                </button>
              )
            })}
          </div>
          <div className="industry-menu-footer">
            Workflows, fields, campaigns & data update everywhere.
          </div>
        </div>
      )}
    </div>
  )
}
