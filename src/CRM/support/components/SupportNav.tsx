import clsx from 'clsx'
import { NavLink } from 'react-router-dom'
import { supportRoutes } from '../routes'

export default function SupportNav() {
  return (
    <div className="sticky top-0 z-20 border-b border-line bg-[#dce8f5]/90 px-5 py-3 backdrop-blur lg:px-8">
      <div className="flex gap-2 overflow-x-auto">
        {supportRoutes.map((route) => {
          const Icon = route.icon
          return (
            <NavLink
              key={route.path}
              to={route.path}
              end={route.path === '/support'}
              className={({ isActive }) =>
                clsx(
                  'inline-flex min-w-max items-center gap-2 rounded-xl border px-3 py-2 text-[13px] font-semibold transition',
                  isActive
                    ? 'border-brand-blue/20 bg-white text-brand-blue shadow-sm'
                    : 'border-transparent bg-white/55 text-slate-600 hover:border-line hover:bg-white hover:text-slate-900'
                )
              }
            >
              <Icon className="h-4 w-4" strokeWidth={2} />
              {route.label}
            </NavLink>
          )
        })}
      </div>
    </div>
  )
}
