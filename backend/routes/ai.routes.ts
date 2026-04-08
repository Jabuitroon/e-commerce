import { Router } from 'express'
import { getIaResponse } from '../controllers/ia.controller'

const aiRouter = Router()

// Handler explícito con types para evitar conflictos de sobrecarga
aiRouter.post('/chat', getIaResponse)

export default aiRouter
