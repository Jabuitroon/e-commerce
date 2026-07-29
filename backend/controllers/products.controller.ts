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
  try {
    const deleteBoolean = await productDao.delete(req.params.id)
    if (!deleteBoolean) {
      return res.status(404).json({ message: 'Error al eliminar el producto' })
    }
    return res
      .status(200)
      .json({ msg: 'Producto Eliminado', id: req.params.id })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error en la consulta a la base de datos' })
  }
}
