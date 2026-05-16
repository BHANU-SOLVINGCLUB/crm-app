import { Bell, Search, Plus, ChevronDown } from 'lucide-react'
import IndustrySwitcher from './IndustrySwitcher'

export default function Topbar() {
  return (
    <header
      className="sticky top-0 z-40 flex items-center gap-4 px-6 h-[60px] bg-white border-b"
      style={{ borderColor: 'rgba(0,0,0,0.08)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
    >
      {/* LEFT — Industry switcher */}
      <div className="flex-shrink-0">
        <IndustrySwitcher />
      </div>

      {/* Divider */}
      <div className="h-6 w-px bg-gray-200 flex-shrink-0" />

      {/* CENTER — Search bar (grows to fill space) */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none"
            style={{ color: '#9ca3af' }}
            strokeWidth={2}
          />
          <input
            placeholder="Search leads, campaigns, contacts…"
            className="w-full rounded-lg pl-9 pr-4 py-2 text-[13.5px] outline-none transition-all"
            style={{
              background: '#f3f7fe',
              border: '1px solid rgba(0,0,0,0.09)',
              color: '#111827',
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = 'rgba(26,86,219,0.45)'
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(26,86,219,0.08)'
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = 'rgba(0,0,0,0.09)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          />
        </div>
      </div>

      {/* Spacer pushes right actions to far right */}
      <div className="flex-1" />

      {/* RIGHT — Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* + Quick Add */}
        <button
          className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[13px] font-semibold text-white transition-all"
          style={{ background: '#1a56db', boxShadow: '0 2px 6px rgba(26,86,219,0.3)' }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#1648c0'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(26,86,219,0.4)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#1a56db'
            e.currentTarget.style.boxShadow = '0 2px 6px rgba(26,86,219,0.3)'
          }}
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          <span className="hidden sm:inline">Quick Add</span>
        </button>

        {/* Bell */}
        <button
          className="relative h-9 w-9 rounded-lg flex items-center justify-center transition-all"
          style={{ background: '#f3f7fe', border: '1px solid rgba(0,0,0,0.08)' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#e8f0fb')}
          onMouseLeave={e => (e.currentTarget.style.background = '#f3f7fe')}
        >
          <Bell className="h-[17px] w-[17px]" strokeWidth={1.8} style={{ color: '#4b5563' }} />
          {/* Notification dot */}
          <span
            className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full border-2 border-white"
            style={{ background: '#7c3aed' }}
          />
        </button>

        {/* User avatar */}
        <div
          className="h-9 w-9 rounded-full flex items-center justify-center text-[12px] font-bold text-white cursor-pointer flex-shrink-0 transition-all"
          style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}
          title="John Doe — Admin"
        >
          BK
        </div>
      </div>
    </header>
  )
}
