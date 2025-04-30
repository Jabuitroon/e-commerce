export type Data = Array<Record<string, string>>

export type nameCategory = 'prime' | 'home' | 'sale' | 'all' | 'light' | 'alternative'

export interface Filters {
  category: nameCategory
  minPrices: number
}

export interface Product {
  title: string
  image: string
  url: string
  asin: string
  star_rating: string
  global_ratings?: string
  bought_in_past_month?: string
  price_symbol: string
  price: string
  is_prime?: string
  is_climate_pledge_friendly?: string
  is_best_seller?: string
  is_sponsored?: string
  is_limited_time_deal?: string
  originalPrice?: string
  sale?: string
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
