import { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { IUser, Role } from '../types/user'

interface JwtRequest extends Request {
  user?: {
    usu_id: number
    usu_nombre: string
    usu_rol: Role
  }
}

export const registerUser = async (req: Request, res: Response) => {
  console.log('Register route hit')
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
      },
    )
  } catch (error) {
    return res.status(500).json({ message: 'Error al loguearse' })
  }
}

export function authorizeRoles(allowedRoles: Role[]) {
  return (req: JwtRequest, res: Response, next: NextFunction) => {
    const user = req.user

    if (user && !allowedRoles.includes(user.usu_rol)) {
      return res.status(403).json({
        message: `Forbidden, you are a ${user.usu_rol} and this service is only available for ${allowedRoles}`,
      })
    }
    next()
  }
}

// export const profileHandler = (req: JwtRequest, res: Response) => {
//   const user = req.user

//   if (!user) {
//     res.status(401).json({ error: 'Usuario no autenticado' })
//   }

//   if (user.usu_rol === Role.administrador) {
//     res.json({
//       message: 'Perfil de administrador',
//       user: {
//         id: user.usu_id,
//         name: user.usu_nombre,
//         role: user.usu_rol,
//         privilegios: [
//           'crear usuarios',
//           'eliminar clientes',
//           'ver reportes',
//           'gestionar sistema',
//         ],
//       },
//     })
//   }

//   if (user.usu_rol === Role.cliente) {
//     res.json({
//       message: 'Perfil de cliente',
//       user: {
//         id: user.usu_id,
//         name: user.usu_nombre,
//         role: user.usu_rol,
//         privilegios: ['ver productos', 'realizar compras', 'ver carrito'],
//       },
//     })
//   }

//   // Rol desconocido
//   res.status(403).json({ error: 'Rol de usuario no permitido' })
// }
