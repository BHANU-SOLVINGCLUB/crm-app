interface Props {
  priority: string
}

const styles: Record<string, string> = {
  Critical: 'bg-rose-100 text-rose-700',
  High: 'bg-orange-100 text-orange-700',
  Medium: 'bg-blue-100 text-blue-700',
  Low: 'bg-theme-surface text-theme-primary',
}

export default function SupportPriorityBadge({ priority }: Props) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${styles[priority] ?? 'bg-theme-surface text-theme-primary'}`}>{priority}</span>
}
