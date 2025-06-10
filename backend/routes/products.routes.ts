import { Router } from 'express'

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/products.cotroller'

const router = Router()

router.get('/products', getProducts)
router.post('/products', createProduct)
router.put('/products/:id', updateProduct)
router.delete('/products/:id', deleteProduct)

export default router