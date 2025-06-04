import { Request, Response } from 'express'
import { conn } from '../server'

export const getProduct = (req: Request, res: Response) => {
  res.send('Obteniendo el producto que necesitas')
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

      // ⚠️ Type assertion to let TypeScript know we're working with a known structure
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
  res.send('Actualizando producto')
}

export const deleteProduct = (req: Request, res: Response) => {
  res.send('Eliminando producto')
}
