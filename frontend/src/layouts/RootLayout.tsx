import { Outlet } from 'react-router-dom'
import HeaderHome from '../UI/Home'

export default function RootLayout() {
  return (
    <div className='flex min-h-screen bg-gray-50 flex-col'>
      <HeaderHome />
      <main className='flex flex-col'>
        <Outlet />
      </main>
    </div>
  )
}
