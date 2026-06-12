import { useEffect, useRef, useState } from 'react'
import { Bell, Search, Plus, UserPlus, Briefcase, Users, Sun, Moon, Monitor, Check } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import IndustrySwitcher from './IndustrySwitcher'
import NotificationDropdown from './NotificationDropdown'
import {
  THEME_ACCENTS,
  applyThemeSettings,
  getStoredThemeSettings,
  type ThemeAccent,
  type ThemeMode,
} from '../../theme/theme'
import './Topbar.css'

export default function Topbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showQuickAdd, setShowQuickAdd] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const initialTheme = getStoredThemeSettings()
  const [themeMode, setThemeMode] = useState<ThemeMode>(initialTheme.mode)
  const [themeAccent, setThemeAccent] = useState<ThemeAccent>(initialTheme.accent)
  const quickAddRef = useRef<HTMLDivElement | null>(null)
  const profileMenuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!quickAddRef.current?.contains(event.target as Node)) {
        setShowQuickAdd(false)
      }
      if (!profileMenuRef.current?.contains(event.target as Node)) {
        setShowProfileMenu(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  useEffect(() => {
    applyThemeSettings({ mode: themeMode, accent: themeAccent })
  }, [themeMode, themeAccent])

  useEffect(() => {
    if (themeMode !== 'auto') return
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => applyThemeSettings({ mode: 'auto', accent: themeAccent }, false)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [themeMode, themeAccent])

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
        <div className="topbar-profile-wrap" ref={profileMenuRef}>
          <button
            className="topbar-avatar"
            title="Bhavik Kumar - Admin"
            type="button"
            onClick={() => setShowProfileMenu((current) => !current)}
          >
            BK
          </button>
          {showProfileMenu && (
            <div className="topbar-profile-menu">
              <div className="topbar-profile-head">
                <strong>Appearance</strong>
                <span>Workspace theme</span>
              </div>

              <div className="topbar-theme-block">
                <div className="topbar-theme-title">Mode</div>
                <div className="topbar-mode-switch">
                  <button
                    className={`topbar-mode-btn ${themeMode === 'day' ? 'active' : ''}`}
                    type="button"
                    onClick={() => setThemeMode('day')}
                  >
                    <Sun className="h-3.5 w-3.5" />
                    Day
                  </button>
                  <button
                    className={`topbar-mode-btn ${themeMode === 'night' ? 'active' : ''}`}
                    type="button"
                    onClick={() => setThemeMode('night')}
                  >
                    <Moon className="h-3.5 w-3.5" />
                    Night
                  </button>
                  <button
                    className={`topbar-mode-btn ${themeMode === 'auto' ? 'active' : ''}`}
                    type="button"
                    onClick={() => setThemeMode('auto')}
                  >
                    <Monitor className="h-3.5 w-3.5" />
                    Auto
                  </button>
                </div>
              </div>

              <div className="topbar-theme-block">
                <div className="topbar-theme-title">Themes</div>
                <div className="topbar-theme-swatches">
                  {THEME_ACCENTS.map((accent) => (
                    <button
                      key={accent.id}
                      type="button"
                      className={`topbar-theme-dot ${themeAccent === accent.id ? 'active' : ''}`}
                      style={{ backgroundColor: accent.hex }}
                      title={accent.label}
                      onClick={() => setThemeAccent(accent.id)}
                    >
                      {themeAccent === accent.id && <Check className="h-3 w-3" />}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                className="topbar-theme-reset"
                onClick={() => {
                  setThemeMode('day')
                  setThemeAccent('blue')
                }}
              >
                Reset to default
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
