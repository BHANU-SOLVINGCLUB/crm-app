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
  Sparkles,
  BookOpen,
  ExternalLink,
} from 'lucide-react'
import clsx from 'clsx'

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, active: true },
  { to: '/marketing', label: 'Marketing', icon: Megaphone, active: true },
  { to: '/leads', label: 'Lead Capture', icon: Target, active: true },
  { to: '/sales', label: 'Sales Pipeline', icon: Briefcase, active: false },
  { to: '/customers', label: 'Customers', icon: Users, active: false },
  { to: '/finance', label: 'Finance', icon: Wallet, active: false },
  { to: '/support', label: 'Support', icon: Headphones, active: false },
  { to: '/settings', label: 'Settings', icon: Settings, active: false },
]

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 shrink-0 border-r border-line bg-black/20 backdrop-blur-xl">
      <div className="px-5 pt-6 pb-5 flex items-center gap-3">
        <div
          className="h-9 w-9 rounded-xl flex items-center justify-center font-bold text-white"
          style={{ background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)' }}
        >
          K
        </div>
        <div>
          <div className="text-[15px] font-bold tracking-tight">Krisantec CRM</div>
          <div className="text-[11px] text-muted">v0.1 · Frontend preview</div>
        </div>
      </div>

      <div className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
        Workspace
      </div>
      <nav className="flex-1 px-2 py-1 space-y-1 overflow-y-auto">
        {nav.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                clsx(
                  'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition',
                  isActive
                    ? 'bg-white/[0.07] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]'
                    : item.active
                      ? 'text-slate-300 hover:bg-white/[0.04] hover:text-white'
                      : 'text-slate-500 cursor-not-allowed'
                )
              }
              onClick={(e) => {
                if (!item.active) e.preventDefault()
              }}
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={1.7} />
              <span>{item.label}</span>
              {!item.active && (
                <span className="ml-auto text-[9.5px] uppercase tracking-wider text-slate-500 bg-white/5 border border-white/5 rounded-full px-1.5 py-0.5">
                  Soon
                </span>
              )}
            </NavLink>
          )
        })}
      </nav>

      <div className="px-3 pt-4 pb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
        Resources
      </div>
      <div className="px-2 pb-2">
        <a
          href="/krisantec/doc/index.html"
          target="_blank"
          rel="noreferrer"
          className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium text-slate-300 hover:bg-white/[0.04] hover:text-white transition"
        >
          <BookOpen className="h-[18px] w-[18px]" strokeWidth={1.7} />
          <span>Project Doc</span>
          <ExternalLink className="ml-auto h-3.5 w-3.5 text-slate-500 group-hover:text-slate-300" strokeWidth={2} />
        </a>
      </div>

      <div className="m-3 mt-auto rounded-2xl border border-line bg-gradient-to-br from-brand-purple/15 to-brand-blue/10 p-4">
        <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-200">
          <Sparkles className="h-3.5 w-3.5 text-brand-purple" />
          AI Workflow Engine
        </div>
        <p className="mt-1.5 text-[12px] leading-snug text-muted">
          Auto-route leads, score intent and trigger journeys per industry template.
        </p>
        <button className="mt-3 w-full text-[11.5px] font-semibold rounded-lg bg-white/10 hover:bg-white/15 transition py-1.5">
          Explore engine
        </button>
      </div>
    </aside>
  )
}
