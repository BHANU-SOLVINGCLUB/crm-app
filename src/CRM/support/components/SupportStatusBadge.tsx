interface Props {
  status: string
}

const styles: Record<string, string> = {
  Open: 'bg-sky-100 text-sky-700',
  'In Progress': 'bg-indigo-100 text-indigo-700',
  'Waiting Customer': 'bg-amber-100 text-amber-700',
  Resolved: 'bg-emerald-100 text-emerald-700',
  Closed: 'bg-theme-surface text-theme-primary',
  Escalated: 'bg-rose-100 text-rose-700',
}

export default function SupportStatusBadge({ status }: Props) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${styles[status] ?? 'bg-theme-surface text-theme-primary'}`}>{status}</span>
}
