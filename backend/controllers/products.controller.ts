import { Request, Response } from 'express'

import { ProductDAO } from '../DAO/ProductDAO'
import { ProductDto } from '../DTOs/products.dto'

const productDao = new ProductDAO()

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await productDao.getAll()
    return res.status(200).json({ data: products })
  } catch (error) {
    return res.status(500).json({ message: 'Error al mapear keys' })
  }
}

export const getProductById = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { id } = req.params
  console.log('ID recibido:', id) // Agrega este log para verificar el valor de id
  try {
    const product = await productDao.findById(id)
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' })
    }
    return res.status(200).json({ data: product })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error en la consulta a la base de datos' })
  }
}

export const createProduct = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const result = ProductDto.safeParse(req.body)

  if (!result.success) {
    return res.status(400).json({
      error: 'Datos inválidos',
      details: result.error.format(),
    })
  }

  try {
    const product = await productDao.create(result.data)
    if (!product) {
      return res.status(404).json({ message: 'Error al crear el producto' })
    }
    return res
      .status(200)
      .json({ msg: `${product.pro_title} creado`, id: product.pro_id })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error en la consulta a la base de datos' })
  }
}
export const updateProduct = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const updateBoolean = await productDao.update(req.params.id, req.body)
    if (!updateBoolean) {
      return res
        .status(404)
        .json({ message: 'Error al actualizar el producto' })
    }
    return res
      .status(200)
      .json({ msg: 'Producto Actualizado', id: req.params.id })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error en la consulta a la base de datos' })
  }
}

export const deleteProduct = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { id } = req.params
  const force = req.query.force === 'true'

  try {
    // Si el usuario ya confirmó eliminar todo (cascada)
    if (force) {
      const deleted = await productDao.deleteCascade(id)
      if (!deleted)
        return res.status(404).json({ message: 'Producto no encontrado' })
      return res
        .status(200)
        .json({
          msg: 'Producto y sus registros asociados fueron eliminados',
          id,
        })
    }

    // Intento de eliminación normal
    const deleteBoolean = await productDao.delete(id)
    if (!deleteBoolean) {
      return res.status(404).json({ message: 'Error al eliminar el producto' })
    }

    return res.status(200).json({ msg: 'Producto Eliminado', id })
  } catch (error: any) {
    // Captura del error de restricción de clave foránea en MySQL
    if (error?.errno === 1451 || error?.code === 'ER_ROW_IS_REFERENCED_2') {
      const relatedOrders = await productDao.getRelatedOrders(id)

      return res.status(409).json({
        code: 'HAS_DEPENDENCIES',
        message: 'El producto está asociado a órdenes existentes.',
        relatedRecords: relatedOrders,
      })
    }

    return res.status(500).json({
      message: 'Error en la consulta a la base de datos',
      error: error.message || error,
    })
  }
}
