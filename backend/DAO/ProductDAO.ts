import { pool } from '../config/db'
import { IProductDAO, Product } from '../types/products'
import { ProductInput } from '../DTOs/products.dto'

export class ProductDAO implements IProductDAO {
  async getAll(): Promise<Product[]> {
    const SQL_QUERY =
      'select * FROM tbl_producto INNER JOIN tbl_categoria ON tbl_producto.pro_categoria_id = tbl_categoria.cat_id'
    const [result] = await pool.query(SQL_QUERY)
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

  async create(product: ProductInput): Promise<Product | null> {
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

    const [results] = await pool.query(SQL_CALL_ID, [prefix])
    // MySQL te devolverá un arreglo donde cada posición corresponde a una de las sentencias separadas por punto y coma.
    // [
    //   {
    //     "fieldCount": 0,
    //     "affectedRows": 0,
    //     "insertId": 0,
    //     "info": "",
    //     "serverStatus": 10,
    //     "warningStatus": 0
    //   },
    //   [
    //     {
    //       "id": "ADM001"
    //     }
    //   ]
    // ]
    const newId = (results as any[])[1][0].id
    const convertId = Number(idcategory)

    const mapProduct = {
      pro_id: newId,
      pro_title: name,
      pro_image: image,
      pro_star_rating: ratingstar,
      pro_price_symbol: symbol,
      pro_price: price,
      pro_categoria_id: convertId,
      pro_stock: stock,
    }

    const [insertResult] = await pool.query(SQL_QUERY, mapProduct)
    if ((insertResult as any).affectedRows > 0) {
      return mapProduct as unknown as Product
    }
    return null
  }
  async update(id: string, product: ProductInput): Promise<boolean> {
    const SQL_QUERY =
      'UPDATE tbl_producto set ? , pro_update_at = CURRENT_TIMESTAMP() where pro_id = ?'
    const { name, image, symbol, price, stock, ratingstar, idcategory } =
      product

    const mapProduct = {
      pro_title: name,
      pro_image: image,
      pro_star_rating: ratingstar,
      pro_price_symbol: symbol,
      pro_price: price,
      pro_categoria_id: idcategory,
      pro_stock: stock,
    }

    const [updateResult] = await pool.query(SQL_QUERY, [mapProduct, id])
    return (updateResult as any).affectedRows > 0
  }

  async delete(id: string): Promise<boolean> {
    const SQL_QUERY = 'DELETE FROM tbl_producto WHERE pro_id = ?'
    const [deleteResult] = await pool.query(SQL_QUERY, [id])
    return (deleteResult as any).affectedRows > 0
  }
}
