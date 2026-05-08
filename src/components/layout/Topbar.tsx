import { Bell, Search, Plus } from 'lucide-react'
import IndustrySwitcher from './IndustrySwitcher'

export default function Topbar() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-bg/70 border-b border-line">
      <div className="flex items-center gap-3 px-5 lg:px-8 h-[68px]">
        <IndustrySwitcher />

        <div className="hidden md:flex items-center gap-2 ml-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              placeholder="Search leads, campaigns, contacts…"
              className="input pl-9"
            />
          </div>
        </div>

        <div className="flex-1 md:hidden" />

        <div className="flex items-center gap-2">
          <button className="btn-ghost px-3 py-2">
            <Plus className="h-4 w-4" strokeWidth={2.2} />
            <span className="hidden sm:inline">Quick Add</span>
          </button>
          <button className="relative h-10 w-10 rounded-xl border border-line bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center transition">
            <Bell className="h-[18px] w-[18px]" strokeWidth={1.8} />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-brand-pink live-dot" />
          </button>
          <div className="ml-1 h-10 w-10 rounded-full bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center text-[13px] font-bold">
            BK
          </div>
        </div>
      </div>
    </header>
  )
}
