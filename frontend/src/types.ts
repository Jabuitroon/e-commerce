export type Data = Array<Record<string, string>>

export type StateToken = {
  token: string
  isAuth: boolean
  profile: any
}

export type Actions = {
  // Funciones que actualizan estado
  setToken: (token: string) => void
  setProfile: (profile: any) => void
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
  data: Data
}

export type ApiSearchResponse = {
  userData: Data
}

export type userData = {
  username: string
  email: string
  password: string
}
