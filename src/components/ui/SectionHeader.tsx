import type { ReactNode } from 'react'

interface Props {
  title: string
  subtitle?: string
  right?: ReactNode
}

export default function SectionHeader({ title, subtitle, right }: Props) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
      <div>
        <h2 className="text-[22px] font-bold tracking-tight">{title}</h2>
        {subtitle && <p className="text-[13.5px] text-muted mt-1 max-w-2xl">{subtitle}</p>}
      </div>
      {right}
    </div>
  )
}
