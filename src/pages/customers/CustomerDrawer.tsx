import { useEffect, useRef, useState } from 'react'
import {
  X, Phone, Mail, Calendar, CreditCard,
  MessageSquare, ShoppingBag, LifeBuoy, ChevronRight,
  User, Building2, Edit3, CheckCircle2,
} from 'lucide-react'
import clsx from 'clsx'
import type { Customer } from '../../data/customerData'
import { fmtRevenue, statusColor, payColor } from '../../data/customerData'

interface Props {
  customer: Customer | null
  onClose: () => void
  onUpdate: (id: number, patch: Partial<Customer>) => void
}

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

type DrawerTab = 'info' | 'purchases' | 'tickets' | 'notes'

const TABS: { id: DrawerTab; label: string; icon: React.ReactNode }[] = [
  { id: 'info',      label: 'Info',     icon: <User className="h-3.5 w-3.5" /> },
  { id: 'purchases', label: 'Purchases', icon: <ShoppingBag className="h-3.5 w-3.5" /> },
  { id: 'tickets',   label: 'Tickets',  icon: <LifeBuoy className="h-3.5 w-3.5" /> },
  { id: 'notes',     label: 'Notes',    icon: <MessageSquare className="h-3.5 w-3.5" /> },
]

const ticketClass: Record<string, string> = {
  'Open':        'ticket-open',
  'In Progress': 'ticket-inprogress',
  'Closed':      'ticket-closed',
}

export default function CustomerDrawer({ customer, onClose, onUpdate }: Props) {
  const [tab, setTab] = useState<DrawerTab>('info')
  const [notes, setNotes] = useState('')
  const [visible, setVisible] = useState(false)
  const prevId = useRef<number | null>(null)

  // Animate in/out
  useEffect(() => {
    if (customer) {
      setVisible(true)
      if (customer.id !== prevId.current) {
        setTab('info')
        setNotes(customer.notes)
        prevId.current = customer.id
      }
    } else {
      setVisible(false)
    }
  }, [customer])

  const handleClose = () => {
    setVisible(false)
    setTimeout(onClose, 220)
  }

  // Save notes on blur
  const handleNotesBlur = () => {
    if (customer && notes !== customer.notes) {
      onUpdate(customer.id, { notes })
    }
  }

  if (!customer && !visible) return null

  const sc = customer ? statusColor[customer.status] : null

  return (
    <>
      {/* Overlay */}
      <div
        className="overlay-enter fixed inset-0 bg-black/50 z-40"
        onClick={handleClose}
        style={{ backdropFilter: 'blur(2px)' }}
      />

      {/* Drawer */}
      <aside
        className={clsx(
          'fixed top-0 right-0 h-full z-50 flex flex-col',
          visible ? 'drawer-enter' : 'drawer-exit'
        )}
        style={{
          width: 400,
          background: '#ffffff',
          borderLeft: '1px solid rgba(0,0,0,0.1)',
          boxShadow: '-8px 0 40px rgba(0,0,0,0.15)',
        }}
      >
        {customer && (
          <>
            {/* Header */}
            <div className="px-5 pt-5 pb-4 border-b border-line flex-shrink-0">
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div
                  className="avatar avatar-lg flex-shrink-0 fade-up"
                  style={customer.status === 'VIP' ? {
                    background: 'linear-gradient(135deg,#6c63ff,#ec4899)',
                    boxShadow: '0 0 16px rgba(167,139,250,0.4)',
                  } : undefined}
                >
                  {initials(customer.name)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[17px] font-bold leading-tight truncate text-gray-900">{customer.name}</span>
                    {sc && (
                      <span
                        className="status-badge flex-shrink-0"
                        style={{ color: sc.text, background: sc.bg }}
                      >
                        {customer.status}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 text-[12.5px] text-gray-500">
                    <Building2 className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="truncate">{customer.company}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5 text-[12.5px] text-gray-500">
                    <User className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="truncate">Mgr: {customer.assignedManager}</span>
                  </div>
                </div>

                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-700 transition p-1 rounded-lg hover:bg-gray-100 flex-shrink-0"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Revenue + Payment */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div
                  className="rounded-xl p-3"
                  style={{ background: '#f0fdf4', border: '1px solid #a7f3d0' }}
                >
                  <div className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-1">Revenue</div>
                  <div className={clsx('text-[18px] font-bold text-emerald-600', customer.status === 'VIP' && 'vip-glow')}>
                    {fmtRevenue(customer.revenue)}
                  </div>
                </div>
                <div
                  className="rounded-xl p-3"
                  style={{
                    background: `${payColor[customer.paymentStatus]}18`,
                    border: `1px solid ${payColor[customer.paymentStatus]}30`,
                  }}
                >
                  <div className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-1">Payment</div>
                  <div className="text-[18px] font-bold" style={{ color: payColor[customer.paymentStatus] }}>
                    {customer.paymentStatus}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div
              className="flex border-b flex-shrink-0 overflow-x-auto"
              style={{ borderColor: 'rgba(0,0,0,0.07)' }}
            >
              {TABS.map(t => (
                <button
                  key={t.id}
                  className={clsx('cust-tab flex items-center gap-1.5', tab === t.id && 'active')}
                  onClick={() => setTab(t.id)}
                >
                  {t.icon} {t.label}
                  {t.id === 'tickets' && customer.supportTickets.length > 0 && (
                    <span
                      className="ml-0.5 text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold flex-shrink-0"
                      style={{ background: 'rgba(248,113,113,0.2)', color: '#f87171' }}
                    >
                      {customer.supportTickets.length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Body */}
            <div className="drawer-body">

              {/* ── INFO ── */}
              {tab === 'info' && (
                <div className="fade-up">
                  <div className="drawer-section">
                    <div className="drawer-label">Contact Details</div>
                    <div className="space-y-3">
                      <InfoRow icon={<Phone className="h-4 w-4" />} label="Phone" value={customer.phone} />
                      <InfoRow icon={<Mail className="h-4 w-4" />}  label="Email" value={customer.email} />
                    </div>
                  </div>

                  <div className="drawer-section">
                    <div className="drawer-label">Account Details</div>
                    <div className="space-y-3">
                      <InfoRow icon={<Calendar className="h-4 w-4" />}   label="Renewal Date"   value={customer.renewalDate} />
                      <InfoRow icon={<CreditCard className="h-4 w-4" />} label="Payment Status"  value={customer.paymentStatus}
                        valueStyle={{ color: payColor[customer.paymentStatus], fontWeight: 600 }}
                      />
                      <InfoRow icon={<ChevronRight className="h-4 w-4" />} label="Last Activity"
                        value={`${customer.lastActivity}${customer.lastActivityDays > 0 ? ` · ${customer.lastActivityDays}d ago` : ' · Today'}`}
                      />
                    </div>
                  </div>

                  {/* Quick actions */}
                  <div className="drawer-section">
                    <div className="drawer-label">Quick Actions</div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { icon: <Edit3 className="h-4 w-4" />,        label: 'Edit Customer' },
                        { icon: <Mail className="h-4 w-4" />,          label: 'Send Email' },
                        { icon: <CheckCircle2 className="h-4 w-4" />, label: 'Mark Active' },
                        { icon: <LifeBuoy className="h-4 w-4" />,     label: 'Open Ticket' },
                      ].map((a) => (
                        <button
                          key={a.label}
                          className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-[12.5px] font-medium text-gray-600 hover:text-blue-700 transition"
                          style={{ background: '#f3f7fe', border: '1px solid rgba(26,86,219,0.1)' }}
                          onClick={() => {/* hook up later */}}
                        >
                          <span style={{ color: '#1a56db' }}>{a.icon}</span>
                          {a.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── PURCHASES ── */}
              {tab === 'purchases' && (
                <div className="fade-up">
                  <div className="drawer-section">
                    <div className="drawer-label">Purchase History</div>
                    {customer.purchaseHistory.length === 0 ? (
                      <p className="text-[13px] text-slate-500">No purchases recorded.</p>
                    ) : (
                      <table className="ph-table">
                        <tbody>
                          {customer.purchaseHistory.map((p, i) => (
                            <tr key={i}>
                              <td style={{ paddingRight: 12 }}>
                                <div className="text-[12.5px] font-medium text-slate-900 leading-snug">{p.item}</div>
                                <div className="text-[11px] text-slate-500 mt-0.5">{p.date}</div>
                              </td>
                              <td className="amount">{p.amount === 0 ? 'Free' : fmtRevenue(p.amount)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>

                  <div className="drawer-section">
                    <div className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-1">Lifetime Value</div>
                    <div className="text-[24px] font-bold text-emerald-600">{fmtRevenue(customer.revenue)}</div>
                    <div className="text-[12px] text-gray-400 mt-1">{customer.purchaseHistory.length} transaction(s) on record</div>
                  </div>
                </div>
              )}

              {/* ── TICKETS ── */}
              {tab === 'tickets' && (
                <div className="fade-up">
                  <div className="drawer-section">
                    <div className="drawer-label">Support Tickets</div>
                    {customer.supportTickets.length === 0 ? (
                      <p className="text-[13px] text-slate-500">No open tickets. 🎉</p>
                    ) : (
                      <div className="space-y-3">
                        {customer.supportTickets.map((t, i) => (
                          <div
                            key={i}
                            className="rounded-xl p-3"
                            style={{ background: '#f8fafd', border: '1px solid rgba(0,0,0,0.07)' }}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="text-[12.5px] font-semibold text-gray-800 leading-snug">{t.issue}</div>
                                <div className="text-[11px] text-gray-400 mt-1">
                                  <span className="font-mono">{t.id}</span> · {t.date}
                                </div>
                              </div>
                              <span className={clsx('rounded-full px-2.5 py-0.5 text-[11px] font-semibold flex-shrink-0', ticketClass[t.status])}>
                                {t.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── NOTES ── */}
              {tab === 'notes' && (
                <div className="fade-up">
                  <div className="drawer-section">
                    <div className="drawer-label">Internal Notes</div>
                    <textarea
                      className="notes-area"
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      onBlur={handleNotesBlur}
                      placeholder="Add notes about this customer…"
                    />
                    <div className="text-[11px] text-slate-500 mt-2">Notes are saved automatically on blur.</div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </aside>
    </>
  )
}

function InfoRow({
  icon, label, value, valueStyle,
}: {
  icon: React.ReactNode
  label: string
  value: string
  valueStyle?: React.CSSProperties
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-slate-500 mt-0.5 flex-shrink-0">{icon}</span>
      <div className="min-w-0">
        <div className="text-[11px] text-slate-500 font-medium mb-0.5">{label}</div>
        <div className="text-[13px] text-slate-200 break-all" style={valueStyle}>{value}</div>
      </div>
    </div>
  )
}
