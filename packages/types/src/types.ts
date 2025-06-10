export interface Product {
  pro_id: string
  pro_title: string
  pro_image: string
  pro_star_rating: string
  pro_global_ratings?: string
  pro_bought_in_past_month?: string
  pro_price_symbol: string
  pro_price: string
  pro_is_prime?: string
  pro_is_best_seller?: string
  pro_is_sponsored?: string
  pro_sale?: string
  pro_stock: string
  cat_nombre: string
}

export interface ProductInCart extends Product {
  count: string
}
  // pro_is_climate_pledge_friendly?: string