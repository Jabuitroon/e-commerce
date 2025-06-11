import { Request, Response } from 'express'
import { conn } from '../server'

export const getProducts = (req: Request, res: Response) => {
  const SQL_QUERY =
    'select * FROM tbl_producto INNER JOIN tbl_categoria ON tbl_producto.pro_categoria_id = tbl_categoria.cat_id'

  try {
    conn.query(SQL_QUERY, (err, result) => {
      if (err) throw err
      return res.status(200).json({ data: result })
    })
  } catch (error) {
    res.status(500).json({ message: 'Error al mapear keys' })
  }
}

export const createProduct = (req: Request, res: Response) => {
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
  } = req.body

  const prefix = (category || 'GEN').substring(0, 3).toUpperCase()

  try {
    conn.query(SQL_CALL_ID, [prefix], (err, results) => {
      if (err) throw err

      const resultArray = results as [any[], any[]]
      const newId = resultArray[1][0].id

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

      conn.query(SQL_QUERY, producto, (err2) => {
        if (err2) throw err2
        return res.status(200).json({ msg: 'Producto guardado', id: newId })
      })
    })
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar el producto' })
  }
}
export const updateProduct = (req: Request, res: Response) => {
  const SQL_QUERY =
    'UPDATE tbl_producto set ? , pro_update_at = CURRENT_TIMESTAMP() where pro_id = ?'

  const { name, image, symbol, price, stock, ratingstar } = req.body

  try {
    const producto = {
      pro_title: name,
      pro_image: image,
      pro_star_rating: ratingstar,
      pro_price_symbol: symbol,
      pro_price: price,
      pro_stock: stock,
    }

    conn.query(SQL_QUERY, [producto, req.params.id], (err, results) => {
      if (err) throw err
      console.log('Row updated with timestamp:', results)
      return res
        .status(200)
        .json({ msg: 'Producto Actualizado', id: req.params.id })
    })
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el producto' })
  }
}

export const deleteProduct = (req: Request, res: Response) => {
  const SQL_QUERY = 'DELETE FROM tbl_producto WHERE pro_id = ?'

  try {
    conn.query(SQL_QUERY, [req.params.id], (err) => {
      if (err) throw err
      return res
        .status(200)
        .json({ msg: 'Producto Eliminado', id: req.params.id })
    })
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el producto' })
  }
}
