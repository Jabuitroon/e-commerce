import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { type StateToken, type Actions } from '../src/types'

export const useAuthStore = create(
  persist<StateToken & Actions>(
    (set) => ({
      token: '',
      profile: null,
      isAuth: false,
      setToken: (token: string) =>
        set((state) => ({
          token,
        })),
      setProfile: (profile: any) =>
        set((state) => ({
          profile,
        })),
      setIsAuth: (isAuth: boolean) =>
        set((state) => ({
          isAuth,
        })),
      logout: () => ({
        token: '',
        profile: null,
        isAuth: false,
      }),
    }),
    { name: 'auth' }
  )
)
