import clsx from 'clsx'
import { Trash2, ChevronUp, ChevronDown } from 'lucide-react'
import type { Customer, CustomerStatus } from '../../data/customerData'
import './CustomerTable.css'

export type SortKey = 'name' | 'company' | 'revenue' | 'lastActivityDays' | 'renewalDate' | 'status'
export type SortDir = 'asc' | 'desc'

interface Props {
  rows: Customer[]
  selected: Set<number>
  onToggleSelect: (id: number) => void
  onToggleSelectAll: () => void
  onRowClick: (c: Customer) => void
  onCellUpdate: (id: number, key: keyof Customer, val: string | number) => void
  onDeleteRow: (id: number) => void
  sortKey: SortKey
  sortDir: SortDir
  onSort: (k: SortKey) => void
}

const STATUS_OPTIONS: CustomerStatus[] = ['Active', 'Inactive', 'VIP', 'Pending']

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (col !== sortKey) return <span className="ml-1 text-slate-600">â†•</span>
  return sortDir === 'asc'
    ? <ChevronUp className="h-3 w-3 ml-1 text-brand-purple inline" />
    : <ChevronDown className="h-3 w-3 ml-1 text-brand-purple inline" />
}

function StatusCell({ value, onChange }: { value: CustomerStatus; onChange: (v: CustomerStatus) => void }) {
  return (
    <div className="relative h-full w-full px-3 flex items-center">
      <select
        value={value}
        onChange={e => onChange(e.target.value as CustomerStatus)}
        className={`customer-status-select status-${value.toLowerCase()}`}
        onClick={e => e.stopPropagation()}
      >
        {STATUS_OPTIONS.map(s => (
          <option key={s} value={s} className="bg-white text-slate-800 font-normal">{s}</option>
        ))}
      </select>
    </div>
  )
}

const COLS: { key: SortKey; label: string; className: string }[] = [
  { key: 'name', label: 'Customer', className: 'cust-col-name' },
  { key: 'company', label: 'Company', className: 'cust-col-company' },
  { key: 'status', label: 'Status', className: 'cust-col-status' },
  { key: 'revenue', label: 'Revenue', className: 'cust-col-revenue' },
  { key: 'lastActivityDays', label: 'Last Activity', className: 'cust-col-activity' },
  { key: 'renewalDate', label: 'Renewal', className: 'cust-col-renewal' },
]

export default function CustomerTable({
  rows, selected, onToggleSelect, onToggleSelectAll,
  onRowClick, onCellUpdate, onDeleteRow,
  sortKey, sortDir, onSort,
}: Props) {
  const allSelected = rows.length > 0 && selected.size === rows.length

  return (
    <div className="overflow-auto max-h-[62vh]">
      <table className="sheet">
        <thead>
          <tr>
            <th className="row-num cust-col-check !text-center">
              <input type="checkbox" checked={allSelected} onChange={onToggleSelectAll} className="accent-violet-500" />
            </th>
            <th className="cust-col-check">#</th>
            {COLS.map(col => (
              <th key={col.key} className={`cust-sort-heading ${col.className}`} onClick={() => onSort(col.key)}>
                {col.label}
                <SortIcon col={col.key} sortKey={sortKey} sortDir={sortDir} />
              </th>
            ))}
            <th className="cust-col-phone">Phone</th>
            <th className="cust-col-email">Email</th>
            <th className="cust-col-manager">Manager</th>
            <th className="cust-col-payment">Payment</th>
            <th className="cust-col-action" />
          </tr>
        </thead>
        <tbody>
          {rows.map((c, displayIdx) => {
            const isSelected = selected.has(c.id)

            return (
              <tr key={c.id} className={clsx('cust-row', isSelected && 'selected')} onClick={() => onRowClick(c)}>
                <td className="row-num !text-center" onClick={e => e.stopPropagation()}>
                  <input type="checkbox" checked={isSelected} onChange={() => onToggleSelect(c.id)} className="accent-violet-500" />
                </td>
                <td className="row-num">{displayIdx + 1}</td>
                <td onClick={e => e.stopPropagation()}>
                  <div className="flex items-center gap-2.5 px-3 h-full">
                    <div className={clsx('avatar avatar-sm flex-shrink-0', c.status === 'VIP' && 'customer-avatar-vip')}>
                      {initials(c.name)}
                    </div>
                    <input value={c.name} onChange={e => onCellUpdate(c.id, 'name', e.target.value)} className="cell-input font-semibold flex-1 min-w-0" placeholder="Customer name" />
                  </div>
                </td>
                <td onClick={e => e.stopPropagation()}>
                  <input value={c.company} onChange={e => onCellUpdate(c.id, 'company', e.target.value)} className="cell-input" placeholder="Company" />
                </td>
                <td onClick={e => e.stopPropagation()}>
                  <StatusCell value={c.status} onChange={v => onCellUpdate(c.id, 'status', v)} />
                </td>
                <td onClick={e => e.stopPropagation()}>
                  <input type="number" value={c.revenue || ''} onChange={e => onCellUpdate(c.id, 'revenue', Number(e.target.value))} className="cell-input text-right tabular-nums text-emerald-400 font-semibold" placeholder="0" />
                </td>
                <td>
                  <div className="px-3 flex items-center gap-2 h-full">
                    <span className="text-[12px] text-slate-500 truncate">{c.lastActivity}</span>
                    {c.lastActivityDays > 0 && (
                      <span className={clsx('text-[10px] font-semibold ml-auto flex-shrink-0', c.lastActivityDays >= 14 ? 'text-red-400' : c.lastActivityDays >= 7 ? 'text-amber-400' : 'text-slate-500')}>
                        {c.lastActivityDays}d ago
                      </span>
                    )}
                    {c.lastActivityDays === 0 && <span className="text-[10px] font-semibold ml-auto text-emerald-400 flex-shrink-0">Today</span>}
                  </div>
                </td>
                <td onClick={e => e.stopPropagation()}>
                  <input type="date" value={c.renewalDate} onChange={e => onCellUpdate(c.id, 'renewalDate', e.target.value)} className="cell-input tabular-nums" />
                </td>
                <td onClick={e => e.stopPropagation()}>
                  <input value={c.phone} onChange={e => onCellUpdate(c.id, 'phone', e.target.value)} className="cell-input" placeholder="+91 00000 00000" />
                </td>
                <td onClick={e => e.stopPropagation()}>
                  <input type="email" value={c.email} onChange={e => onCellUpdate(c.id, 'email', e.target.value)} className="cell-input" placeholder="email@company.com" />
                </td>
                <td onClick={e => e.stopPropagation()}>
                  <input value={c.assignedManager} onChange={e => onCellUpdate(c.id, 'assignedManager', e.target.value)} className="cell-input" placeholder="Manager" />
                </td>
                <td>
                  <div className="px-3 flex items-center h-full">
                    <span className={`status-badge payment-${c.paymentStatus.toLowerCase()}`}>{c.paymentStatus}</span>
                  </div>
                </td>
                <td className="row-num" onClick={e => e.stopPropagation()}>
                  <button onClick={() => onDeleteRow(c.id)} className="text-slate-600 hover:text-red-400 transition mx-auto block">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            )
          })}
          {rows.length === 0 && (
            <tr>
              <td colSpan={15} className="text-center py-16 text-slate-500">
                <div className="text-4xl mb-3">ðŸ”</div>
                <div className="text-[14px]">No customers match your search or filter.</div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
