import clsx from 'clsx'
import { Trash2, ChevronUp, ChevronDown } from 'lucide-react'
import type { Customer, CustomerStatus } from '../../data/customerData'
import { statusColor } from '../../data/customerData'

export type SortKey = 'name' | 'company' | 'revenue' | 'lastActivityDays' | 'renewalDate' | 'status'
export type SortDir = 'asc' | 'desc'

interface Props {
  rows: Customer[]
  allRows: Customer[]
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
  if (col !== sortKey) return <span className="ml-1 text-slate-600">↕</span>
  return sortDir === 'asc'
    ? <ChevronUp   className="h-3 w-3 ml-1 text-brand-purple inline" />
    : <ChevronDown className="h-3 w-3 ml-1 text-brand-purple inline" />
}

function StatusCell({ value, onChange }: { value: CustomerStatus; onChange: (v: CustomerStatus) => void }) {
  const sc = statusColor[value]
  return (
    <div className="relative h-full w-full px-3 flex items-center">
      <select
        value={value}
        onChange={e => onChange(e.target.value as CustomerStatus)}
        className="appearance-none cursor-pointer bg-transparent border-none outline-none w-full font-semibold text-[12px]"
        style={{ color: sc.text }}
        onClick={e => e.stopPropagation()}
      >
        {STATUS_OPTIONS.map(s => (
          <option key={s} value={s} className="bg-[#14122a] text-white font-normal">{s}</option>
        ))}
      </select>
    </div>
  )
}

const COLS: { key: SortKey; label: string; minW: number }[] = [
  { key: 'name',            label: 'Customer',       minW: 180 },
  { key: 'company',         label: 'Company',         minW: 160 },
  { key: 'status',          label: 'Status',          minW: 120 },
  { key: 'revenue',         label: 'Revenue',         minW: 110 },
  { key: 'lastActivityDays', label: 'Last Activity',  minW: 150 },
  { key: 'renewalDate',     label: 'Renewal',         minW: 120 },
]

export default function CustomerTable({
  rows, allRows, selected, onToggleSelect, onToggleSelectAll,
  onRowClick, onCellUpdate, onDeleteRow,
  sortKey, sortDir, onSort,
}: Props) {
  const allSelected = rows.length > 0 && selected.size === rows.length

  return (
    <div className="overflow-auto max-h-[62vh]">
      <table className="sheet">
        <thead>
          <tr>
            {/* Checkbox */}
            <th className="row-num !text-center" style={{ width: 44 }}>
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onToggleSelectAll}
                className="accent-violet-500"
              />
            </th>
            {/* Row # */}
            <th style={{ width: 44 }}>#</th>

            {/* Sortable column headers */}
            {COLS.map(col => (
              <th
                key={col.key}
                style={{ minWidth: col.minW, cursor: 'pointer', userSelect: 'none' }}
                onClick={() => onSort(col.key)}
              >
                {col.label}
                <SortIcon col={col.key} sortKey={sortKey} sortDir={sortDir} />
              </th>
            ))}

            {/* Non-sortable columns */}
            <th style={{ minWidth: 140 }}>Phone</th>
            <th style={{ minWidth: 190 }}>Email</th>
            <th style={{ minWidth: 140 }}>Manager</th>
            <th style={{ minWidth: 120 }}>Payment</th>
            {/* Action */}
            <th style={{ width: 52 }} />
          </tr>
        </thead>
        <tbody>
          {rows.map((c, displayIdx) => {
            const isSelected = selected.has(c.id)

            return (
              <tr
                key={c.id}
                className={clsx('cust-row', isSelected && 'selected')}
                onClick={() => onRowClick(c)}
              >
                {/* Checkbox */}
                <td className="row-num !text-center" onClick={e => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(c.id)}
                    className="accent-violet-500"
                  />
                </td>

                {/* Row # */}
                <td className="row-num">{displayIdx + 1}</td>

                {/* Customer Name with avatar */}
                <td onClick={e => e.stopPropagation()}>
                  <div className="flex items-center gap-2.5 px-3 h-full">
                    <div
                      className="avatar avatar-sm flex-shrink-0"
                      style={c.status === 'VIP' ? {
                        background: 'linear-gradient(135deg,#6c63ff,#ec4899)',
                        boxShadow: '0 0 8px rgba(167,139,250,0.35)',
                      } : undefined}
                    >
                      {initials(c.name)}
                    </div>
                    <input
                      value={c.name}
                      onChange={e => onCellUpdate(c.id, 'name', e.target.value)}
                      className="cell-input font-semibold flex-1 min-w-0"
                      placeholder="Customer name"
                    />
                  </div>
                </td>

                {/* Company */}
                <td onClick={e => e.stopPropagation()}>
                  <input
                    value={c.company}
                    onChange={e => onCellUpdate(c.id, 'company', e.target.value)}
                    className="cell-input"
                    placeholder="Company"
                  />
                </td>

                {/* Status — dropdown */}
                <td onClick={e => e.stopPropagation()}>
                  <StatusCell
                    value={c.status}
                    onChange={v => onCellUpdate(c.id, 'status', v)}
                  />
                </td>

                {/* Revenue */}
                <td onClick={e => e.stopPropagation()}>
                  <input
                    type="number"
                    value={c.revenue || ''}
                    onChange={e => onCellUpdate(c.id, 'revenue', Number(e.target.value))}
                    className="cell-input text-right tabular-nums text-emerald-400 font-semibold"
                    placeholder="0"
                  />
                </td>

                {/* Last Activity */}
                <td>
                  <div className="px-3 flex items-center gap-2 h-full">
                    <span className="text-[12px] text-slate-300 truncate">{c.lastActivity}</span>
                    {c.lastActivityDays > 0 && (
                      <span
                        className={clsx(
                          'text-[10px] font-semibold ml-auto flex-shrink-0',
                          c.lastActivityDays >= 14 ? 'text-red-400'
                          : c.lastActivityDays >= 7 ? 'text-amber-400'
                          : 'text-slate-500'
                        )}
                      >
                        {c.lastActivityDays}d ago
                      </span>
                    )}
                    {c.lastActivityDays === 0 && (
                      <span className="text-[10px] font-semibold ml-auto text-emerald-400 flex-shrink-0">Today</span>
                    )}
                  </div>
                </td>

                {/* Renewal Date */}
                <td onClick={e => e.stopPropagation()}>
                  <input
                    type="date"
                    value={c.renewalDate}
                    onChange={e => onCellUpdate(c.id, 'renewalDate', e.target.value)}
                    className="cell-input tabular-nums"
                  />
                </td>

                {/* Phone */}
                <td onClick={e => e.stopPropagation()}>
                  <input
                    value={c.phone}
                    onChange={e => onCellUpdate(c.id, 'phone', e.target.value)}
                    className="cell-input"
                    placeholder="+91 00000 00000"
                  />
                </td>

                {/* Email */}
                <td onClick={e => e.stopPropagation()}>
                  <input
                    type="email"
                    value={c.email}
                    onChange={e => onCellUpdate(c.id, 'email', e.target.value)}
                    className="cell-input"
                    placeholder="email@company.com"
                  />
                </td>

                {/* Assigned Manager */}
                <td onClick={e => e.stopPropagation()}>
                  <input
                    value={c.assignedManager}
                    onChange={e => onCellUpdate(c.id, 'assignedManager', e.target.value)}
                    className="cell-input"
                    placeholder="Manager"
                  />
                </td>

                {/* Payment status */}
                <td>
                  <div className="px-3 flex items-center h-full">
                    <span
                      className="status-badge"
                      style={{
                        color: c.paymentStatus === 'Paid' ? '#34d399' : c.paymentStatus === 'Overdue' ? '#f87171' : '#fbbf24',
                        background: c.paymentStatus === 'Paid' ? 'rgba(52,211,153,0.1)' : c.paymentStatus === 'Overdue' ? 'rgba(248,113,113,0.1)' : 'rgba(251,191,36,0.1)',
                      }}
                    >
                      {c.paymentStatus}
                    </span>
                  </div>
                </td>

                {/* Delete */}
                <td className="row-num" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => onDeleteRow(c.id)}
                    className="text-slate-600 hover:text-red-400 transition mx-auto block"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            )
          })}

          {rows.length === 0 && (
            <tr>
              <td colSpan={15} className="text-center py-16 text-slate-500">
                <div className="text-4xl mb-3">🔍</div>
                <div className="text-[14px]">No customers match your search or filter.</div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
