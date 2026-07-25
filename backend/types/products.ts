import { CreateProductInput } from 'backend/DTOs/products.dto'

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

export interface IProductDAO {
  getAll(): Promise<Product[]>
  findById(id: string): Promise<Product | null>
  create(product: CreateProductInput): Promise<Product | null>
  // updateProduct(id: number, product: Product): Promise<boolean>;
  // delete(id: number): Promise<boolean>;
}
