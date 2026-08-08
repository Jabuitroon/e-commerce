import { Router } from 'express'
import * as orderController from '../controllers/orders.controller'
import { requireAdmin } from '../middlewares/requireAdmin.middleware'
import { authentication } from '../middlewares/auth.middleware'
 
const router = Router()
// Actúa como un filtro global para este router. Todas las rutas definidas después de esta línea heredan automáticamente ambos middlewares.
router.use(authentication, requireAdmin)

router.get('/orders/export',orderController.exportOrdersCSV)
router.get('/orders', orderController.getOrders)
router.get('/orders/:id', orderController.getOrder)
router.patch('/orders/:id/status', orderController.updateOrderStatus)
 
export default router
