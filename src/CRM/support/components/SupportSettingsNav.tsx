import clsx from 'clsx'
import { NavLink } from 'react-router-dom'
import { supportSettingsAreas } from '../services/mockSupportData'

export default function SupportSettingsNav() {
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-2">
        <NavLink
          to="/support/settings"
          end
          className={({ isActive }) =>
            clsx(
              'inline-flex min-w-max items-center rounded-xl border px-3 py-2 text-sm font-semibold transition',
              isActive
                ? 'border-brand-blue/20 bg-brand-blue text-white shadow-sm'
                : 'border-theme bg-white text-theme-secondary hover:border-slate-300 hover:text-theme-primary'
            )
          }
        >
          Overview
        </NavLink>
        {supportSettingsAreas.map((area) => (
          <NavLink
            key={area.id}
            to={area.path}
            className={({ isActive }) =>
              clsx(
                'inline-flex min-w-max items-center rounded-xl border px-3 py-2 text-sm font-semibold transition',
                isActive
                  ? 'border-brand-blue/20 bg-brand-blue text-white shadow-sm'
                  : 'border-theme bg-white text-theme-secondary hover:border-slate-300 hover:text-theme-primary'
              )
            }
          >
            {area.title}
          </NavLink>
        ))}
      </div>
    </div>
  )
}
