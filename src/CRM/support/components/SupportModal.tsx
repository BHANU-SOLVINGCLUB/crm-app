import type { ReactNode } from 'react'

interface Props {
  open: boolean
  title: string
  description?: string
  children: ReactNode
  onClose: () => void
}

export default function SupportModal({ open, title, description, children, onClose }: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/35 p-4" onClick={onClose}>
      <div className="w-full max-w-xl rounded-3xl border border-theme bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="border-b border-theme px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-theme-primary">{title}</h3>
              {description && <p className="mt-1 text-sm text-theme-secondary">{description}</p>}
            </div>
            <button className="btn-ghost !px-3" onClick={onClose}>Close</button>
          </div>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
