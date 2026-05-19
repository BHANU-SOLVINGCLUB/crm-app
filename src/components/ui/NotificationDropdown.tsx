import { useState } from 'react'
import { Bell, Settings, X, UserPlus, FileText, AlertCircle } from 'lucide-react'
import clsx from 'clsx'

type Notification = {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  type: 'mention' | 'system' | 'alert'
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'New Lead Assigned',
    message: 'Jane Smith assigned Acme Corp to you.',
    time: '5m ago',
    read: false,
    type: 'mention',
  },
  {
    id: '2',
    title: 'Invoice Paid',
    message: 'Invoice #INV-1042 for ₹1,20,000 has been paid.',
    time: '2h ago',
    read: false,
    type: 'system',
  },
  {
    id: '3',
    title: 'SLA Warning',
    message: 'Ticket #892 is approaching its 24h SLA deadline.',
    time: '4h ago',
    read: false,
    type: 'alert',
  },
  {
    id: '4',
    title: 'Weekly Report Ready',
    message: 'Your pipeline summary for this week is generated.',
    time: '1d ago',
    read: true,
    type: 'system',
  },
]

export default function NotificationDropdown({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all')
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)

  const unreadCount = notifications.filter(n => !n.read).length
  const filtered = notifications.filter(n => activeTab === 'all' || !n.read)

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'mention': return <UserPlus className="h-4 w-4 text-blue-500" />
      case 'system': return <FileText className="h-4 w-4 text-emerald-500" />
      case 'alert': return <AlertCircle className="h-4 w-4 text-rose-500" />
      default: return <Bell className="h-4 w-4 text-slate-500" />
    }
  }

  return (
    <div className="absolute top-[52px] right-6 w-[360px] bg-white rounded-xl shadow-2xl border border-line z-50 fade-up overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-line flex items-center justify-between bg-slate-50">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          Notifications
          {unreadCount > 0 && (
            <span className="bg-brand-blue text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
              {unreadCount}
            </span>
          )}
        </h3>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button 
              onClick={markAllRead}
              className="text-[11px] font-medium text-brand-blue hover:text-blue-800 transition-colors"
            >
              Mark all read
            </button>
          )}
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-200 text-slate-500 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-line px-4">
        <button
          className={clsx('px-3 py-2 text-[13px] font-medium border-b-2 transition-colors', activeTab === 'all' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-slate-500 hover:text-slate-700')}
          onClick={() => setActiveTab('all')}
        >
          All
        </button>
        <button
          className={clsx('px-3 py-2 text-[13px] font-medium border-b-2 transition-colors', activeTab === 'unread' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-slate-500 hover:text-slate-700')}
          onClick={() => setActiveTab('unread')}
        >
          Unread
        </button>
      </div>

      {/* List */}
      <div className="max-h-[340px] overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <Bell className="h-8 w-8 mx-auto mb-3 opacity-20" />
            <p className="text-[13px] font-medium">No notifications</p>
            <p className="text-[12px] mt-1">You're all caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-line">
            {filtered.map(notif => (
              <div 
                key={notif.id} 
                className={clsx(
                  'px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer group flex gap-3',
                  !notif.read && 'bg-blue-50/50'
                )}
                onClick={() => markAsRead(notif.id)}
              >
                <div className="mt-0.5 shrink-0 h-8 w-8 rounded-full bg-white border border-line flex items-center justify-center shadow-sm">
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-0.5">
                    <p className={clsx('text-[13px] truncate', notif.read ? 'text-slate-700' : 'font-semibold text-slate-900')}>
                      {notif.title}
                    </p>
                    <span className="text-[11px] text-slate-400 whitespace-nowrap ml-2">{notif.time}</span>
                  </div>
                  <p className="text-[12px] text-slate-500 leading-snug">{notif.message}</p>
                </div>
                {!notif.read && (
                  <div className="shrink-0 flex items-center justify-center pt-2">
                    <div className="h-2 w-2 rounded-full bg-brand-blue" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-line bg-slate-50">
        <a href="/settings" className="w-full flex items-center justify-center gap-2 py-1.5 rounded-lg text-[12px] font-medium text-slate-600 hover:bg-slate-200 transition-colors">
          <Settings className="h-3.5 w-3.5" />
          Notification Settings
        </a>
      </div>
    </div>
  )
}
