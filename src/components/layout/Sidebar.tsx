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
  PieChart,
} from 'lucide-react'
import clsx from 'clsx'
import HelpSupportDrawer from '../ui/HelpSupportDrawer'

const nav = [
  { to: '/',          label: 'Dashboard',     icon: LayoutDashboard, active: true },
  { to: '/marketing', label: 'Marketing',     icon: Megaphone,       active: true },
  { to: '/leads',     label: 'Lead Capture',  icon: Target,          active: true },
  { to: '/sales',     label: 'Sales',         icon: Briefcase,       active: true },
  { to: '/analytics', label: 'Analytics',     icon: PieChart,        active: true },
  { to: '/customers', label: 'Customers',     icon: Users,           active: true },
  { to: '/finance',   label: 'Finance',       icon: Wallet,          active: true },
  { to: '/support',   label: 'Support',       icon: Headphones,      active: true },
  { to: '/settings',  label: 'Settings',      icon: Settings,        active: true },
]

export default function Sidebar() {
  const [isHelpOpen, setIsHelpOpen] = useState(false)

  return (
    <aside
      className="hidden lg:flex lg:flex-col lg:w-60 shrink-0"
      style={{ background: '#1a3664', borderRight: '1px solid rgba(255,255,255,0.08)' }}
    >
      {/* Logo */}
      <div className="px-5 pt-6 pb-5 flex items-center gap-3">
        <div
          className="h-8 w-8 rounded-lg flex items-center justify-center font-bold text-white text-[15px]"
          style={{ background: 'linear-gradient(135deg,#3b82f6,#1a56db)' }}
        >
          K
        </div>
        <div>
          <div className="text-[14px] font-bold tracking-tight text-white">Krisantec CRM</div>
          <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>v0.1 · Frontend preview</div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '0 16px 12px' }} />

      {/* Nav label */}
      <div className="px-4 pb-1 text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>
        Main Menu
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-2.5 py-1 space-y-0.5 overflow-y-auto">
        {nav.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                clsx(
                  'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-150',
                  isActive
                    ? 'text-white'
                    : item.active
                      ? 'text-blue-200 hover:text-white'
                      : 'cursor-not-allowed opacity-40'
                )
              }
              style={({ isActive }) => isActive ? {
                background: 'rgba(255,255,255,0.12)',
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)',
              } : undefined}
              onClick={(e) => { if (!item.active) e.preventDefault() }}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className="h-[17px] w-[17px] flex-shrink-0"
                    strokeWidth={isActive ? 2.2 : 1.8}
                    style={{ color: isActive ? '#60a5fa' : 'rgba(147,197,253,0.75)' }}
                  />
                  <span>{item.label}</span>
                  {!item.active && (
                    <span
                      className="ml-auto text-[9px] uppercase tracking-wider rounded-full px-1.5 py-0.5 font-semibold"
                      style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.3)' }}
                    >
                      Soon
                    </span>
                  )}
                </>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '8px 16px' }} />

      {/* Bottom section */}
      <div className="px-2.5 pb-2 space-y-0.5">
        <a
          href="/krisantec/doc/index.html"
          target="_blank"
          rel="noreferrer"
          className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-150"
          style={{ color: 'rgba(147,197,253,0.75)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <BookOpen className="h-[17px] w-[17px] flex-shrink-0" strokeWidth={1.8} />
          <span>Project Docs</span>
          <ExternalLink className="ml-auto h-3 w-3 opacity-50" strokeWidth={2} />
        </a>
        <button
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-150"
          style={{ color: 'rgba(147,197,253,0.75)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <Bell className="h-[17px] w-[17px] flex-shrink-0" strokeWidth={1.8} />
          <span>Notifications</span>
          <span
            className="ml-auto text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center"
            style={{ background: '#1a56db', color: 'white' }}
          >
            3
          </span>
        </button>
        <button
          onClick={() => setIsHelpOpen(true)}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-150"
          style={{ color: 'rgba(147,197,253,0.75)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <HelpCircle className="h-[17px] w-[17px] flex-shrink-0" strokeWidth={1.8} />
          <span>Help & Support</span>
        </button>
      </div>
      
      <HelpSupportDrawer isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </aside>
  )
}
