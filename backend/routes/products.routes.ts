import { Router } from 'express'

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/products.cotroller'

const router = Router()

// Obtener todos los productos
router.get('/products', (req, res) => {
  getProducts(req, res)
})

// Obtener un producto específico por ID
// El ":id" es lo que permite que req.params.id funcione en tu controlador
router.get('/products/:id', (req, res) => {
  getProductById(req, res)
})
router.post('/products', (req, res) => {
  createProduct(req, res)
})
router.put('/products/:id', (req, res) => {
  updateProduct(req, res)
})
router.delete('/products/:id', (req, res) => {
  deleteProduct(req, res)
})

export default router
