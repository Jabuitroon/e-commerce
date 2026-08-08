import { useAuthStore } from '../../store/auth.store'

export function useIsAdmin(): boolean {
  const role = useAuthStore((state) => state.profile?.rol)
  return role === 'administrador'
}
