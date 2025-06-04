import { Router } from 'express'

import {
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/products.cotroller'

const router = Router()

router.get('/products/:id', getProduct)
router.post('/products', createProduct)
router.put('/products/:id', updateProduct)
router.delete('/products/:id', deleteProduct)

export default router