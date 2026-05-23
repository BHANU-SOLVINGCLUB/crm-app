import { createContext, useContext, useMemo, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from 'react'

import { cn } from '../../lib/utils'

interface TabsContextValue {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabsContext() {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('Tabs components must be used within <Tabs>.')
  }
  return context
}

export function Tabs({
  value,
  onValueChange,
  children,
  className,
}: {
  value: string
  onValueChange: (value: string) => void
  children: ReactNode
  className?: string
}) {
  const contextValue = useMemo(() => ({ value, onValueChange }), [onValueChange, value])

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={cn('space-y-5', className)}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'inline-flex w-full flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white/80 p-1.5 shadow-sm md:w-auto',
        className
      )}
      {...props}
    />
  )
}

export function TabsTrigger({
  value,
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { value: string }) {
  const context = useTabsContext()
  const isActive = context.value === value

  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-all',
        isActive
          ? 'bg-slate-900 text-white shadow-sm'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
        className
      )}
      onClick={() => context.onValueChange(value)}
      {...props}
    >
      {children}
    </button>
  )
}

export function TabsContent({
  value,
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { value: string }) {
  const context = useTabsContext()
  if (context.value !== value) return null

  return (
    <div className={cn('space-y-5', className)} {...props}>
      {children}
    </div>
  )
}
