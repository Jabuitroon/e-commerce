import { Outlet } from 'react-router-dom'

import { SideMenu } from '../components/SideMenu'
import Home from '../UI/Home'

export function AdminLayout() {
  return (
    <div className='flex min-h-screen bg-gray-50 flex-col'>
      <Home />
      <div className='flex h-full'>
        <SideMenu />
        <main className='flex-1'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
