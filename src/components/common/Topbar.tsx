import { useEffect, useRef, useState } from 'react'
import { Bell, Search, Plus, UserPlus, Briefcase, Users } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import IndustrySwitcher from './IndustrySwitcher'
import NotificationDropdown from './NotificationDropdown'
import './Topbar.css'

export default function Topbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showQuickAdd, setShowQuickAdd] = useState(false)
  const quickAddRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!quickAddRef.current?.contains(event.target as Node)) {
        setShowQuickAdd(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  const runQuickAdd = (target: 'lead' | 'customer' | 'deal') => {
    const routeMap = {
      lead: '/leads?quickAdd=lead',
      customer: '/customers?quickAdd=customer',
      deal: '/sales?quickAdd=deal',
    }

    setShowQuickAdd(false)
    if (location.pathname + location.search === routeMap[target]) return
    navigate(routeMap[target])
  }

  return (
    <header className="topbar">
      <div className="topbar-left">
        <IndustrySwitcher />
      </div>
      <div className="topbar-divider" />
      <div className="topbar-search-area">
        <div className="topbar-search">
          <Search className="topbar-search-icon" strokeWidth={2} />
          <input placeholder="Search leads, campaigns, contacts..." className="topbar-search-input" />
        </div>
      </div>
      <div className="topbar-spacer" />
      <div className="topbar-actions">
        <div className="topbar-quick-add-wrap" ref={quickAddRef}>
          <button className="topbar-add-btn" type="button" onClick={() => setShowQuickAdd((current) => !current)}>
            <Plus className="topbar-add-icon" strokeWidth={2.5} />
            <span className="topbar-add-text">Quick Add</span>
          </button>
          {showQuickAdd && (
            <div className="topbar-quick-add-menu">
              <button type="button" className="topbar-quick-add-item" onClick={() => runQuickAdd('lead')}>
                <span className="topbar-quick-add-icon"><UserPlus className="h-4 w-4" /></span>
                <span>
                  <strong>New Lead</strong>
                  <small>Add a blank lead row in the current industry</small>
                </span>
              </button>
              <button type="button" className="topbar-quick-add-item" onClick={() => runQuickAdd('customer')}>
                <span className="topbar-quick-add-icon"><Users className="h-4 w-4" /></span>
                <span>
                  <strong>New Customer</strong>
                  <small>Create a customer row in the customer directory</small>
                </span>
              </button>
              <button type="button" className="topbar-quick-add-item" onClick={() => runQuickAdd('deal')}>
                <span className="topbar-quick-add-icon"><Briefcase className="h-4 w-4" /></span>
                <span>
                  <strong>New Deal</strong>
                  <small>Open the deal form in the sales pipeline</small>
                </span>
              </button>
            </div>
          )}
        </div>
        <div className="topbar-notification-wrap">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="topbar-bell-btn"
            type="button"
          >
            <Bell className="topbar-bell-icon" strokeWidth={1.8} />
            <span className="topbar-notification-dot" />
          </button>
          {showNotifications && <NotificationDropdown onClose={() => setShowNotifications(false)} />}
        </div>
        <div className="topbar-avatar" title="John Doe - Admin">
          BK
        </div>
      </div>
    </header>
  )
}
