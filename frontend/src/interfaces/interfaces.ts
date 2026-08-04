export interface Product {
  pro_id: string
  pro_title: string
  pro_image: string
  pro_star_rating: string
  pro_global_ratings?: string
  pro_bought_in_past_month?: string
  pro_update_at: string
  pro_price_symbol: string
  pro_price: string
  pro_is_prime?: string
  pro_is_best_seller?: string
  pro_is_sponsored?: string
  pro_sale?: string
  pro_stock: string
  cat_id: string
  cat_nombre: string
}

export interface ProductInCart extends Product {
  count: string
}

export interface ProductInCart extends Product {
  count: string
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface RelatedOrder {
  odt_id: number
  odt_id_orden: number
  odt_cantidad: number
  odt_precio_unitario: number
}

export interface ErrorDependenciesResponse {
  code: string
  message: string
  relatedRecords: RelatedOrder[]
}

export interface ModalState {
  isOpen: boolean
  productId: string | null
  records: RelatedOrder[]
}
