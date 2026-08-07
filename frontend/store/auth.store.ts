import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Rol = 'cliente' | 'administrador'

export interface Perfil {
  id_usuario: number
  nombre: string
  email: string
  rol: Rol
}

interface AuthState {
  token: string | null
  profile: Perfil | null
  hasHydrated: boolean // true cuando persist terminó de leer localStorage
}

interface AuthActions {
  setToken: (token: string) => void
  setProfile: (profile: Perfil) => void
  login: (token: string, profile: Perfil) => void // conveniencia: setea ambos atómicamente
  logout: () => void
  setHasHydrated: (state: boolean) => void
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      token: null,
      profile: null,
      hasHydrated: false,

      setToken: (token) => set({ token }),
      setProfile: (profile) => set({ profile }),

      login: (token, profile) => set({ token, profile }),

      logout: () => set({ token: null, profile: null }),

      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: 'auth',
      onRehydrateStorage: () => (state) => {
        // Se ejecuta cuando Zustand termina de leer localStorage
        state?.setHasHydrated(true)
      },
    },
  ),
)

// --- Selectors atómicos (evitan re-renders innecesarios) ---
export const useAuthToken = () => useAuthStore((s) => s.token)
export const useAuthProfile = () => useAuthStore((s) => s.profile)
export const useIsAuthenticated = () =>
  useAuthStore((s) => !!s.token && !!s.profile)
export const useAuthHasHydrated = () => useAuthStore((s) => s.hasHydrated)
