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
                : 'border-line bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900'
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
                  : 'border-line bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900'
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
