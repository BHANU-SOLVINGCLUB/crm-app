import type { HTMLAttributes } from 'react'

import { cn } from '../../lib/utils'

export function Avatar({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-lg font-bold text-white shadow-lg shadow-blue-500/20',
        className
      )}
      {...props}
    />
  )
}
