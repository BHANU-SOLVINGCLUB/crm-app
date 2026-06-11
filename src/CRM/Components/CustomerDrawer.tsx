import { useEffect, useRef, useState } from 'react'
import {
  X, Phone, Mail, Calendar, CreditCard,
  MessageSquare, ShoppingBag, LifeBuoy, ChevronRight,
  User, Building2, Edit3, CheckCircle2,
} from 'lucide-react'
import clsx from 'clsx'
import type { Customer } from '../data/customerData'
import { fmtRevenue } from '../data/customerData'
import { pushAppToast } from '../store/uiStore'
import './CustomerDrawer.css'

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

  const runQuickAction = (action: 'edit' | 'email' | 'activate' | 'ticket') => {
    if (!customer) return
    if (action === 'edit') {
      setTab('info')
      pushAppToast(`Customer profile ready to edit for ${customer.name}.`, 'success')
      return
    }
    if (action === 'email') {
      pushAppToast(`Email draft opened for ${customer.name}.`, 'success')
      return
    }
    if (action === 'activate') {
      onUpdate(customer.id, { status: 'Active' })
      pushAppToast(`${customer.name} marked as active.`, 'success')
      return
    }
    setTab('tickets')
    pushAppToast(`Support ticket view opened for ${customer.name}.`, 'success')
  }

  if (!customer && !visible) return null

  return (
    <>
      {/* Overlay */}
      <div className="customer-drawer-overlay overlay-enter fixed inset-0 bg-black/50 z-40" onClick={handleClose} />

      {/* Drawer */}
      <aside
        className={clsx(
          'customer-drawer-panel fixed top-0 right-0 h-full z-50 flex flex-col',
          visible ? 'drawer-enter' : 'drawer-exit'
        )}
      >
        {customer && (
          <>
            {/* Header */}
            <div className="px-5 pt-5 pb-4 border-b border-theme flex-shrink-0">
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div
                  className={clsx('avatar avatar-lg flex-shrink-0 fade-up', customer.status === 'VIP' && 'customer-drawer-avatar-vip')}
                >
                  {initials(customer.name)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[17px] font-bold leading-tight truncate text-gray-900">{customer.name}</span>
                    <span className={`status-badge flex-shrink-0 status-${customer.status.toLowerCase()}`}>
                      {customer.status}
                    </span>
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
                <div className="customer-drawer-revenue rounded-xl p-3">
                  <div className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-1">Revenue</div>
                  <div className={clsx('text-[18px] font-bold text-emerald-600', customer.status === 'VIP' && 'vip-glow')}>
                    {fmtRevenue(customer.revenue)}
                  </div>
                </div>
                <div className={`customer-drawer-payment rounded-xl p-3 payment-card-${customer.paymentStatus.toLowerCase()}`}>
                  <div className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-1">Payment</div>
                  <div className={`text-[18px] font-bold payment-text-${customer.paymentStatus.toLowerCase()}`}>
                    {customer.paymentStatus}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="customer-drawer-tabs flex border-b flex-shrink-0 overflow-x-auto">
              {TABS.map(t => (
                <button
                  key={t.id}
                  className={clsx('cust-tab flex items-center gap-1.5', tab === t.id && 'active')}
                  onClick={() => setTab(t.id)}
                >
                  {t.icon} {t.label}
                  {t.id === 'tickets' && customer.supportTickets.length > 0 && (
                    <span
                      className="customer-ticket-count ml-0.5 text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold flex-shrink-0"
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
                      <InfoRow icon={<CreditCard className="h-4 w-4" />} label="Payment Status" value={customer.paymentStatus} valueClass={`payment-text-${customer.paymentStatus.toLowerCase()}`} />
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
                        { icon: <Edit3 className="h-4 w-4" />, label: 'Edit Customer', action: 'edit' as const },
                        { icon: <Mail className="h-4 w-4" />, label: 'Send Email', action: 'email' as const },
                        { icon: <CheckCircle2 className="h-4 w-4" />, label: 'Mark Active', action: 'activate' as const },
                        { icon: <LifeBuoy className="h-4 w-4" />, label: 'Open Ticket', action: 'ticket' as const },
                      ].map((a) => (
                        <button
                          key={a.label}
                          className="customer-quick-action flex items-center gap-2 rounded-xl px-3 py-2.5 text-[12.5px] font-medium text-gray-600 hover:text-blue-700 transition"
                          onClick={() => runQuickAction(a.action)}
                        >
                          <span className="customer-quick-action-icon">{a.icon}</span>
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
                      <p className="text-[13px] text-theme-secondary">No purchases recorded.</p>
                    ) : (
                      <table className="ph-table">
                        <tbody>
                          {customer.purchaseHistory.map((p, i) => (
                            <tr key={i}>
                              <td className="ph-item-cell">
                                <div className="text-[12.5px] font-medium text-theme-primary leading-snug">{p.item}</div>
                                <div className="text-[11px] text-theme-secondary mt-0.5">{p.date}</div>
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
                      <p className="text-[13px] text-theme-secondary">No open tickets. 🎉</p>
                    ) : (
                      <div className="space-y-3">
                        {customer.supportTickets.map((t, i) => (
                          <div
                            key={i}
                            className="customer-ticket-card rounded-xl p-3"
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
                    <div className="text-[11px] text-theme-secondary mt-2">Notes are saved automatically on blur.</div>
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
  icon, label, value, valueClass,
}: {
  icon: React.ReactNode
  label: string
  value: string
  valueClass?: string
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-theme-secondary mt-0.5 flex-shrink-0">{icon}</span>
      <div className="min-w-0">
        <div className="text-[11px] text-theme-secondary font-medium mb-0.5">{label}</div>
        <div className={clsx('text-[13px] text-slate-200 break-all', valueClass)}>{value}</div>
      </div>
    </div>
  )
}

