import { Router, type RequestHandler } from 'express'
import * as checkoutController from '../controllers/checkout.controller'
import { authentication } from '../middlewares/auth.middleware'
 
const router = Router()
const checkoutHandler: RequestHandler = async (req, res, next) => {
  await checkoutController.checkout(req, res, next)
}
 
router.post('/checkout', authentication, checkoutHandler)
 
export default router