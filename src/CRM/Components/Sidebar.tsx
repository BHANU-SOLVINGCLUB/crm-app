import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Megaphone,
  Target,
  Users,
  Briefcase,
  Package2,
  Wallet,
  Settings,
  Headphones,
  BookOpen,
  ExternalLink,
  HelpCircle,
  Bell,
  ShoppingCart,
} from 'lucide-react'
import HelpSupportDrawer from './HelpSupportDrawer'
import { pushAppToast } from '../store/uiStore'
import { productCatalogRoutes } from '../product-catalog/routes'
import './Sidebar.css'

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, active: true },
  { to: '/marketing', label: 'Marketing', icon: Megaphone, active: true },
  { to: '/leads', label: 'Lead Capture', icon: Target, active: true },
  { to: '/sales', label: 'Sales', icon: Briefcase, active: true },
  { to: '/products', label: 'Product Catalog', icon: Package2, active: true },
  { to: '/orders', label: 'Orders', icon: ShoppingCart, active: true },
  { to: '/customers', label: 'Customers', icon: Users, active: true },
  { to: '/finance', label: 'Finance', icon: Wallet, active: true },
  { to: '/support', label: 'Support', icon: Headphones, active: true },
  { to: '/settings', label: 'Settings', icon: Settings, active: true },
]

export default function Sidebar() {
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const location = useLocation()
  const showProductCatalog = location.pathname.startsWith('/products')

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
            <div key={item.to} className="sidebar-group">
              <NavLink
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

              {item.to === '/products' && showProductCatalog && (
                <div className="sidebar-subnav">
                  {productCatalogRoutes.map((route) => {
                    const RouteIcon = route.icon
                    return (
                      <NavLink
                        key={route.path}
                        to={route.path}
                        end={route.path === '/products'}
                        className={({ isActive }) => `sidebar-subnav-link ${isActive ? 'active' : ''}`}
                      >
                        <RouteIcon className="sidebar-link-icon" strokeWidth={2} />
                        <span>{route.label}</span>
                      </NavLink>
                    )
                  })}
                </div>
              )}
            </div>
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
