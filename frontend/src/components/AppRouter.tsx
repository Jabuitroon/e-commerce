import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { ProtectedRoute } from '../routes/ProtectedRoute'
import { AdminLayout } from '../layouts/AdminLayout'
import RootLayout from '../layouts/RootLayout'
import { CartPage } from '../pages/CartPage'
import { CheckoutPage } from '../pages/CheckoutPage'
import { OrderConfirmationPage } from '../pages/OrderConfirmationPage'
import { Register } from '../components/Register'
import { LoginPage } from '../pages/LoginPage'
import { Profile } from './Profile'
import ProductPage from '../pages/ProductPage'

const OrdersPage = lazy(() => import('../pages/OrderPage'))
const OrderDetailPage = lazy(() => import('../pages/OrderDetailPage'))

function withSuspense(element: React.ReactNode) {
  return (
    <Suspense
      fallback={
        <div className='flex h-screen items-center justify-center text-gray-400'>
          Loading...
        </div>
      }
    >
      {element}
    </Suspense>
  )
}

const router = createBrowserRouter([
  { path: '/', element: <ProductPage /> },
  { path: '/register', element: <Register /> },
  { path: '/login', element: <LoginPage /> },

  {
    element: <ProtectedRoute allowedRoles={['administrador']} />,
    children: [
      { path: '/profile', element: <Profile /> },
      {
        path: '/admin',
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to='/admin/orders' replace /> },
          { path: 'orders', element: withSuspense(<OrdersPage />) },
          {
            path: 'orders/:id',
            element: withSuspense(<OrderDetailPage />),
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={['administrador', 'cliente']} />,
    children: [
      {
        path: '/',
        element: <RootLayout />,
        children: [
          { path: '/cart', element: <CartPage /> },
          { path: '/checkout', element: <CheckoutPage /> },
          { path: '/order-confirmation', element: <OrderConfirmationPage /> },
        ],
      },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
