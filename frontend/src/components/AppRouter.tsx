import { Products } from './Products'
import { Routes, Route } from 'react-router-dom'
import { Register } from '../components/Register'
import { Login } from '../components/Login'

export function AppRouter() {
  return (
    <>
      <Routes>
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<Products />} />
      </Routes>
    </>
  )
}
