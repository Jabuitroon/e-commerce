// src/routes/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import {
  useIsAuthenticated,
  useAuthProfile,
  useAuthHasHydrated,
} from '../../store/auth.store'
import type { Rol } from '../../store/auth.store'

interface ProtectedRouteProps {
  allowedRoles: Rol[]
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const hasHydrated = useAuthHasHydrated()
  const isAuthenticated = useIsAuthenticated()
  const profile = useAuthProfile()
  const location = useLocation()

  // Espera a que Zustand termine de leer localStorage antes de decidir nada
  if (!hasHydrated) {
    return (
      <div className='flex h-screen items-center justify-center text-gray-400'>
        Loading...
      </div>
    )
  }

  if (!isAuthenticated || !profile) {
    return <Navigate to='/login' state={{ from: location }} replace />
  }

  if (!allowedRoles.includes(profile.rol)) {
    return <Navigate to='/403' replace />
  }

  return <Outlet />
}
