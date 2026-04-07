import { Router } from 'express'
import { getIaResponse } from '../controllers/ia.controller'

const aiRouter = Router()

aiRouter.post('/chat', getIaResponse)

export default aiRouter
