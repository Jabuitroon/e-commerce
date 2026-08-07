import { Router } from 'express'
import { loginUser } from '../controllers/auth.controller'
import { whitelistBody } from '../middlewares/auth.middleware'

const router = Router()

router.post('/login', whitelistBody(['email', 'password']), (req, res) => {
  loginUser(req, res)
})

export default router
