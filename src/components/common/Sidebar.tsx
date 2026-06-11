import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Megaphone,
  Target,
  Users,
  Briefcase,
  Wallet,
  Settings,
  Headphones,
  BookOpen,
  ExternalLink,
  HelpCircle,
  Bell,
} from 'lucide-react'
import HelpSupportDrawer from './HelpSupportDrawer'
import { pushAppToast } from '../../store/uiStore'
import './Sidebar.css'

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, active: true },
  { to: '/marketing', label: 'Marketing', icon: Megaphone, active: true },
  { to: '/leads', label: 'Lead Capture', icon: Target, active: true },
  { to: '/sales', label: 'Sales', icon: Briefcase, active: true },
  { to: '/customers', label: 'Customers', icon: Users, active: true },
  { to: '/finance', label: 'Finance', icon: Wallet, active: true },
  { to: '/support', label: 'Support', icon: Headphones, active: true },
  { to: '/settings', label: 'Settings', icon: Settings, active: true },
]

export default function Sidebar() {
  const [isHelpOpen, setIsHelpOpen] = useState(false)

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-mark" aria-hidden="true">
          <span className="sidebar-brand-mark-ring" />
          <span className="sidebar-brand-mark-letter">K</span>
        </div>
        <div className="sidebar-brand-copy">
          <div className="sidebar-brand-title">Krisantec CRM</div>
        </div>
      </div>

      <div className="sidebar-divider" />
      <div className="sidebar-section-label">Main Menu</div>

      <nav className="sidebar-nav">
        {nav.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''} ${item.active ? '' : 'disabled'}`
              }
              onClick={(event) => {
                if (!item.active) event.preventDefault()
              }}
            >
              {({ isActive }) => (
                <>
                  <Icon className="sidebar-link-icon" strokeWidth={isActive ? 2.2 : 1.8} />
                  <span>{item.label}</span>
                  {!item.active && <span className="sidebar-soon">Soon</span>}
                </>
              )}
            </NavLink>
          )
        })}
      </nav>

      <div className="sidebar-divider sidebar-divider-bottom" />
      <div className="sidebar-bottom">
        <a
          href="/krisantec/doc/index.html"
          target="_blank"
          rel="noreferrer"
          className="sidebar-link sidebar-action"
        >
          <BookOpen className="sidebar-link-icon" strokeWidth={1.8} />
          <span>Project Docs</span>
          <ExternalLink className="sidebar-external-icon" strokeWidth={2} />
        </a>
        <button className="sidebar-link sidebar-action" type="button" onClick={() => pushAppToast('Notification center opened from the sidebar.', 'success')}>
          <Bell className="sidebar-link-icon" strokeWidth={1.8} />
          <span>Notifications</span>
          <span className="sidebar-count">3</span>
        </button>
        <button
          onClick={() => setIsHelpOpen(true)}
          className="sidebar-link sidebar-action"
          type="button"
        >
          <HelpCircle className="sidebar-link-icon" strokeWidth={1.8} />
          <span>Help & Support</span>
        </button>
      </div>

      <HelpSupportDrawer isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </aside>
  )
}
