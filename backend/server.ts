import express from 'express'
import { Request, Response } from 'express'

import mysql from 'mysql2'
import cors from 'cors'
import jwt from 'jsonwebtoken'

import bcrypt from 'bcrypt'
import validateToken from './middlewares/validate-token'
import { profileHandler } from './controllers/auth.controller'
import productsRoutes from './routes/products.routes'

const host = 'localhost'
const user = 'root'
const password = 'r00t'
const database = 'tiendaapp'

export const conn = mysql.createConnection({
  host,
  user,
  password,
  database,
  multipleStatements: true,
})

conn.connect((error) => {
  if (error) throw error
  console.log('Conexión exitosa')
})

const app = express()
app.use(express.json())
const port = process.env.PORTT ?? 3000

app.use(cors())
app.use(productsRoutes)

// Promesas en paralelo https://khru.gitbooks.io/typescript/content/promesas.html
app.get('/products', async (req: Request, res: Response): Promise<any> => {
  const SQL_QUERY = 'SELECT * FROM tbl_producto'

  try {
    conn.query(SQL_QUERY, (err, result) => {
      if (err) throw err
      return res.status(200).json({ data: result })
    })
  } catch (error) {
    return res.status(500).json({ message: 'Error al mapear keys' })
  }
})

app.get('/categories', async (req: Request, res: Response): Promise<any> => {
  const SQL_QUERY = 'SELECT * FROM tbl_categoria'

  try {
    conn.query(SQL_QUERY, (err, result) => {
      if (err) throw err
      return res.status(200).json({ data: result })
    })
  } catch (error) {
    return res.status(500).json({ message: 'Error al mapear keys' })
  }
})

app.post('/register', async (req: Request, res: Response): Promise<any> => {
  const SQL_QUERY = 'INSERT INTO tbl_usuario set ?'

  const { username, email, password } = req.body
  const hashedPassword = await bcrypt.hash(password, 10)
  try {
    conn.query(
      SQL_QUERY,
      {
        usu_nombre: username,
        usu_email: email,
        usu_contrasena: hashedPassword,
      },
      (err, result) => {
        if (err) throw err
        return res.status(200).json({ msg: 'Add User' })
      }
    )
  } catch (error) {
    return res.status(500).json({ message: 'Error al loguearse' })
  }
})

app.post('/login', async (req: Request, res: Response): Promise<any> => {
  const { username, password } = req.body
  const SQL_QUERY =
    'SELECT * FROM tbl_usuario WHERE usu_nombre =' + conn.escape(username)
  try {
    conn.query(SQL_QUERY, (err, result) => {
      let array: any = []
      if (err) throw err
      array = result
      if (array.length == 0) {
        return res.status(200).json({ msg: 'No existe el usuario' })
      }
      if (array.length > 0) {
        const userId = array[0].usu_id
        const userHashedPassword = array[0].usu_contrasena
        const userrol = array[0].usu_rol
        console.log(userrol)

        bcrypt.compare(password, userHashedPassword).then((result) => {
          if (result) {
            const token = jwt.sign(
              {
                usu_id: userId,
                usu_nombre: username,
                usu_rol: userrol,
              },
              process.env.SECRET_KEY || 'shhh'
            )
            return res.status(200).json({ token })
          } else {
            return res.status(200).json({ msg: 'Login Incorrecto' })
          }
        })
      }
    })
  } catch (error) {
    return res.status(500).json({ message: 'Error al loguearse' })
  }
})

// 1.) ruta perfiles 2.) Verificao que estoy autenticado 3.) devuelvo la info del usuario
app.get('/profile', validateToken, profileHandler)

app.post('/logout', async (req, res): Promise<any> => {})

app.get('/protected', async (req, res): Promise<any> => {})

app.listen(port, () => {
  console.log(`Listening on port http://localhost:${port}`)
})
