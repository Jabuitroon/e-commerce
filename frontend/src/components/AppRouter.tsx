import { Products } from './Products'
import { Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from '../routes/ProtectedRoute'

import { CartPage } from '../pages/CartPage'
import { CheckoutPage } from '../pages/CheckoutPage'
import { OrderConfirmationPage } from '../pages/OrderConfirmationPage'
import { Register } from '../components/Register'
import { LoginPage } from '../pages/LoginPage'
import { Profile } from './Profile'

export function AppRouter() {
  return (
    <>
      <Routes>
        <Route element={<ProtectedRoute allowedRoles={['administrador']} />}>
          <Route path='/profile' element={<Profile />} />
        </Route>
        <Route path='/cart' element={<CartPage />} />
        <Route path='/checkout' element={<CheckoutPage />} />
        <Route path='/order-confirmation' element={<OrderConfirmationPage />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/' element={<Products />} />
      </Routes>
    </>
  )
}
