import express from 'express'
import cron from 'node-cron'
import { Request, Response } from 'express'

import cors from 'cors'
import { pool } from './config/db'

import bcrypt from 'bcrypt'
import productsRoutes from './routes/products.routes'
import orderRoutes from './routes/order.routes'
import checkoutRoutes from './routes/checkout.routes'
import stripeWebhookRoutes from './routes/stripeWebhook.routes'
import aiRouter from './routes/ai.routes'
import { expireStaleOrders } from './jobs/expireOrdersJob';
import { generateToken } from './middlewares/auth.middleware'

const app = express()
app.use(
  '/api/webhooks/stripe',
  express.raw({ type: 'application/json' }),
  stripeWebhookRoutes,
)
app.use(express.json())
const port = process.env.PORTT ?? 3000

app.set('trust proxy', 1)

app.use(cors())
app.use(productsRoutes)
app.use('/api/admin', orderRoutes)
app.use('/api', checkoutRoutes)
app.use(aiRouter)

// Corre cada minuto: cancela órdenes pendientes vencidas y libera su stock.
cron.schedule('* * * * *', () => {
  expireStaleOrders().catch((err) =>
    console.error('expireStaleOrders falló:', err),
  )
})

// Promesas en paralelo https://khru.gitbooks.io/typescript/content/promesas.html
app.get('/products', async (req: Request, res: Response): Promise<any> => {
  const SQL_QUERY = 'SELECT * FROM tbl_producto'

  try {
    const [result, err] = await pool.query(SQL_QUERY)
    if (err) throw err
    return res.status(200).json({ data: result })
  } catch (error) {
    return res.status(500).json({ message: 'Error al mapear keys' })
  }
})

app.get('/categories', async (req: Request, res: Response): Promise<any> => {
  const SQL_QUERY = 'SELECT * FROM tbl_categoria'

  try {
    const [result, err] = await pool.query(SQL_QUERY)
    if (err) throw err
    return res.status(200).json({ data: result })
  } catch (error) {
    return res.status(500).json({ message: 'Error al mapear keys' })
  }
})

app.post('/register', async (req: Request, res: Response): Promise<any> => {
  const SQL_QUERY = 'INSERT INTO tbl_usuario set ?'

  const { username, email, password } = req.body
  const hashedPassword = await bcrypt.hash(password, 10)
  try {
    const [result] = await pool.query(SQL_QUERY, {
      usu_nombre: username,
      usu_email: email,
      usu_contrasena: hashedPassword,
    })
    console.log('result: Se creó el usuario', result)
    return res.status(200).json({ msg: 'Add User' })
  } catch (error) {
    return res.status(500).json({ message: 'Error al loguearse' })
  }
})

app.post('/login', async (req: Request, res: Response): Promise<any> => {
  const { username, password } = req.body
  const SQL_QUERY = 'SELECT * FROM tbl_usuario WHERE usu_nombre = ?'
  try {
    const [result] = await pool.query(SQL_QUERY, [username])
    const users = result as any[]
    if (users.length === 0) {
      return res.status(401).json({ msg: 'No existe el usuario' })
    }
    const user = users[0]
    const userId = user.usu_id
    const userHashedPassword = user.usu_contrasena
    const userrol = user.usu_rol
    console.log(userrol)

    const isMatch = await bcrypt.compare(password, userHashedPassword)

    if (isMatch) {
      const token = generateToken(userId, username, userrol)
      return res.status(200).json({ token })
    } else {
      return res.status(401).json({ msg: 'Login Incorrecto' })
    }
  } catch (error) {
    return res.status(500).json({ message: `${error}` })
  }
})

// 1.) ruta perfiles 2.) Verificao que estoy autenticado 3.) devuelvo la info del usuario
// app.get('/profile', authentication, profileHandler)

app.post('/logout', async (req, res): Promise<any> => {})

app.get('/protected', async (req, res): Promise<any> => {})

app.listen(port, () => {
  console.log(`Listening on port http://localhost:${port}`)
})
