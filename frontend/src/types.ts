import { Product } from './interfaces/interfaces'

export type DataProducts = Array<Product>

export type StateToken = {
  token: string
  isAuth: boolean
  profile: string
}

// Funciones que actualizan estado
export type Actions = {
  setToken: (token: string) => void
  setProfile: (profile: string) => void
  setIsAuth: (isAuth: boolean) => void
  logout: () => void
}

export type LoginResponse = {
  success: boolean
  data: { token: string } | { msg: string }
}

export type nameCategory =
  | 'prime'
  | 'home'
  | 'sale'
  | 'all'
  | 'light'
  | 'alternative'

export interface Filters {
  category: nameCategory
  minPrices: number
}

export type ApiGetProducts = {
  data: DataProducts
}

export type userDataLogin = {
  email: string
  password: string
}
