import type { ReactNode } from 'react'
import { useCurrentIndustry } from '../../store/industryStore'

interface Props {
  eyebrow?: string
  title: string
  subtitle?: string
  actions?: ReactNode
}

export default function PageHeader({ eyebrow, title, subtitle, actions }: Props) {
  const industry = useCurrentIndustry()
  const Icon = industry.icon
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-7">
      <div>
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-semibold"
            style={{ background: `${industry.accent}1f`, color: industry.accent }}
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={2.2} />
            {industry.name}
          </span>
          {eyebrow && (
            <span className="text-[11.5px] uppercase tracking-widest text-slate-500 font-semibold">
              {eyebrow}
            </span>
          )}
        </div>
        <h1 className="mt-2 text-[34px] font-bold tracking-tight leading-[1.05]">
          {title}
        </h1>
        {subtitle && <p className="mt-2 text-[14.5px] text-muted max-w-2xl">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
