import { Router } from 'express'
import * as orderController from '../controllers/orders.controller'
// import { requireAdmin } from '../middlewares/requireAdmin';

const router = Router()

// Ajusta por tu middleware de auth JWT real
// import { authenticate } from '../middlewares/authenticate';

//router.use(/* authenticate, */ requireAdmin);

router.get('/orders', orderController.getOrders)
router.get('/orders/:id', orderController.getOrder)
router.patch('/orders/:id/status', orderController.updateOrderStatus)

export default router
