import { Products } from './Products'
import { Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'

import { useAuthStore } from '../../store/auth'
import { Register } from '../components/Register'
import { Login } from '../components/Login'
import { Profile } from './Profile'

export function AppRouter() {
  const isAuth = useAuthStore((state) => state.isAuth)
  return (
    <>
      <Routes>
        <Route element={<ProtectedRoute IsAllowed={isAuth} />}>
          <Route path='/profile' element={<Profile />} />
        </Route>

        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<Products />} />
      </Routes>
    </>
  )
}
