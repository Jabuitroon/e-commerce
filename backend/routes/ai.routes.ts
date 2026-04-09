import { Router } from 'express'
import { getIaResponse } from '../controllers/ia.controller'
import rateLimit from 'express-rate-limit'

const aiRateLimiter = rateLimit({
  // 5 peticiones por minuto
  windowMs: 60 * 1000,
  limit: 5,
  message: { error: 'Demasiadas solicitudes. Por favor, espera un momento.' },
  legacyHeaders: false,
  // Devuelve headers estándar de rate limit
  standardHeaders: 'draft-8',
})

const aiRouter = Router()
aiRouter.use(aiRateLimiter)
// Handler explícito con types para evitar conflictos de sobrecarga
aiRouter.post('/chat', getIaResponse)

export default aiRouter
