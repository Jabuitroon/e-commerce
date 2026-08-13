import { Outlet } from 'react-router-dom'

import { SideMenu } from '../components/SideMenu'
import HeaderHome from '../UI/Home'

export function AdminLayout() {
  return (
    <div className='flex min-h-screen bg-gray-50 flex-col'>
      <HeaderHome />
      <div className='flex h-full mt-16'>
        <SideMenu />
        <main className='flex-1'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
