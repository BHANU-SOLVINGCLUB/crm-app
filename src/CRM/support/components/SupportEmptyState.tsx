import type { LucideIcon } from 'lucide-react'

interface Props {
  icon: LucideIcon
  title: string
  description: string
}

export default function SupportEmptyState({ icon: Icon, title, description }: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-slate-50/70 px-6 py-12 text-center">
      <div className="icon-tile bg-white text-slate-500 shadow-sm">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-slate-500">{description}</p>
    </div>
  )
}
