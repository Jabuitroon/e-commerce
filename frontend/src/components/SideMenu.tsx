import { NavLink } from 'react-router-dom'
import { useAuthStore } from '../../store/auth.store'
import { NAV_ITEMS } from '../const/navConfig'

export function SideMenu() {
  const user = useAuthStore((state) => state.profile)

  if (!user) return null

  const visibleItems = NAV_ITEMS.filter((item) => item.role === user.rol)

  if (visibleItems.length === 0) return null

  return (
    <aside className='w-56 border-r border-gray-200 bg-white p-4'>
      <nav className='space-y-1'>
        {visibleItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              {Icon && <Icon className='h-4 w-4' />}
              {item.label}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
