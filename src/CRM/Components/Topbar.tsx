import { useState } from 'react'
import { Bell, Search, Plus } from 'lucide-react'
import IndustrySwitcher from './IndustrySwitcher'
import NotificationDropdown from './NotificationDropdown'
import './Topbar.css'

export default function Topbar() {
  const [showNotifications, setShowNotifications] = useState(false)

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
        <button className="topbar-add-btn" type="button">
          <Plus className="topbar-add-icon" strokeWidth={2.5} />
          <span className="topbar-add-text">Quick Add</span>
        </button>
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
