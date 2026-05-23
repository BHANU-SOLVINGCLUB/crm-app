import { cn } from '../../lib/utils'

export function Progress({
  value,
  className,
}: {
  value: number
  className?: string
}) {
  const safeValue = Math.max(0, Math.min(100, value))

  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-full bg-slate-200', className)}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 transition-all duration-500"
        style={{ width: `${safeValue}%` }}
      />
    </div>
  )
}
