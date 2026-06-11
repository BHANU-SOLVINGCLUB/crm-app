import clsx from 'clsx'

interface Props {
  status: string
}

const toneMap: Record<string, string> = {
  Draft: 'bg-theme-surface text-theme-secondary',
  Sent: 'bg-sky-100 text-sky-700',
  Viewed: 'bg-violet-100 text-violet-700',
  Paid: 'bg-emerald-100 text-emerald-700',
  Success: 'bg-emerald-100 text-emerald-700',
  Partial: 'bg-amber-100 text-amber-700',
  Pending: 'bg-amber-100 text-amber-700',
  Overdue: 'bg-rose-100 text-rose-700',
  Failed: 'bg-rose-100 text-rose-700',
  Refunded: 'bg-theme-surface text-theme-primary',
  Cancelled: 'bg-theme-surface text-theme-primary',
  Approved: 'bg-emerald-100 text-emerald-700',
  Rejected: 'bg-rose-100 text-rose-700',
  Escalated: 'bg-orange-100 text-orange-700',
  'Reminder Sent': 'bg-sky-100 text-sky-700',
  'Customer Replied': 'bg-violet-100 text-violet-700',
  'Promise To Pay': 'bg-orange-100 text-orange-700',
  Closed: 'bg-emerald-100 text-emerald-700',
  Booked: 'bg-indigo-100 text-indigo-700',
}

export default function FinanceStatusBadge({ status }: Props) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold',
        toneMap[status] ?? 'bg-theme-surface text-theme-primary'
      )}
    >
      {status}
    </span>
  )
}
