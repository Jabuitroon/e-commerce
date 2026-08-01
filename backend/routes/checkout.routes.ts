import { Router, type RequestHandler } from 'express'
import * as checkoutController from '../controllers/checkout.controller'
// import { authenticate } from '../middlewares/authenticate';

const router = Router()
const checkoutHandler: RequestHandler = async (req, res, next) => {
  await checkoutController.checkout(req, res, next)
}

router.post('/checkout', checkoutHandler)

export default router
