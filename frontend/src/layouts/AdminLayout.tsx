import { NavLink, Outlet } from 'react-router-dom'

const NAV_ITEMS = [{ to: '/admin/orders', label: 'Orders' }]

export function AdminLayout() {
  return (
    <div className='flex min-h-screen bg-gray-50'>
      <aside className='w-56 border-r border-gray-200 bg-white p-4'>
        <nav className='space-y-1'>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className='flex-1'>
        <Outlet />
      </main>
    </div>
  )
}
