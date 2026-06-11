import { useEffect } from 'react'
import { CheckCircle2, Info } from 'lucide-react'
import { useUiStore } from '../../store/uiStore'

export default function GlobalToast() {
  const toast = useUiStore((state) => state.toast)
  const clearToast = useUiStore((state) => state.clearToast)

  useEffect(() => {
    if (!toast) return

    const timer = window.setTimeout(() => {
      clearToast()
    }, 2800)

    return () => window.clearTimeout(timer)
  }, [clearToast, toast])

  if (!toast) return null

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[120] flex -translate-x-1/2 items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-[13px] font-semibold text-white shadow-2xl">
      {toast.tone === 'success' ? <CheckCircle2 className="h-4 w-4 text-emerald-300" /> : <Info className="h-4 w-4 text-sky-300" />}
      <span>{toast.message}</span>
    </div>
  )
}
