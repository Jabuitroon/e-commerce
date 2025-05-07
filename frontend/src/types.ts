import { FieldValues } from 'react-hook-form'

export type Data = Array<Record<string, string>>

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

export interface Product {
  pro_id: string
  pro_title: string
  pro_image: string
  pro_url: string
  pro_star_rating: string
  pro_global_ratings?: string
  pro_bought_in_past_month?: string
  pro_price_symbol: string
  pro_price: string
  pro_is_prime?: string
  pro_is_climate_pledge_friendly?: string
  pro_is_best_seller?: string
  pro_is_sponsored?: string
  pro_is_limited_time_deal?: string
  pro_originalPrice?: string
  pro_sale?: string
}

export interface ProductInCart extends Product {
  count: string
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
