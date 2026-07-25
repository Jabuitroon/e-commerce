import { pool } from '../config/db'
import { IProductDAO, Product } from '../../types/products'
import { CreateProductInput } from 'backend/DTOs/products.dto'

export class ProductDAO implements IProductDAO {
  async getAll(): Promise<Product[]> {
    const SQL_QUERY =
      'select * FROM tbl_producto INNER JOIN tbl_categoria ON tbl_producto.pro_categoria_id = tbl_categoria.cat_id'
    const [result, err] = await pool.query(SQL_QUERY)
    if (err) throw err
    return result as Product[]
  }

  async findById(id: string): Promise<Product | null> {
    const SQL_QUERY = `
      SELECT * FROM tbl_producto 
      INNER JOIN tbl_categoria ON tbl_producto.pro_categoria_id = tbl_categoria.cat_id 
      WHERE tbl_producto.pro_id = ?
    `

    const [rows, err] = await pool.query(SQL_QUERY, [id])
    if (err) throw err
    const result = rows as Product[]
    return result.length > 0 ? result[0] : null
  }

  async create(product: CreateProductInput): Promise<Product | null> {
    const SQL_QUERY = 'INSERT INTO tbl_producto set ?'
    const SQL_CALL_ID =
      'CALL generar_id_personalizado(?, @new_id); SELECT @new_id as id;'

    const {
      name,
      image,
      symbol,
      price,
      stock,
      ratingstar,
      idcategory,
      category,
    } = product

    const prefix = (category || 'GEN').substring(0, 3).toUpperCase()

    const [errPrefix, results] = await pool.query(SQL_CALL_ID, [prefix])
    if (errPrefix) throw errPrefix

    const resultArray = results as [any[], any[]]
    const newId = results[1][0].id

    const convertId = Number(idcategory)

    const producto = {
      pro_id: newId,
      pro_title: name,
      pro_image: image,
      pro_star_rating: ratingstar,
      pro_price_symbol: symbol,
      pro_price: price,
      pro_categoria_id: convertId,
      pro_stock: stock,
    }

    const [result, errCreate] = await pool.query(SQL_QUERY, producto)
    if (errCreate) throw errCreate
    return result.length > 0 ? result[0] : null
  }
}
