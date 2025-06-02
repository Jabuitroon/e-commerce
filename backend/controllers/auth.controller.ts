import { Request, Response } from 'express'

interface AuthenticatedRequest extends Request {
  user: {
    usu_id: number
    usu_nombre: string
    usu_rol: 'administrador' | 'cliente'
  }
}

export const profileHandler = (req: AuthenticatedRequest, res: Response) => {
  const user = req.user

  if (!user) {
    res.status(401).json({ error: 'Usuario no autenticado' })
  }

  if (user.usu_rol === 'administrador') {
    res.json({
      message: 'Perfil de administrador',
      user: {
        id: user.usu_id,
        name: user.usu_nombre,
        role: user.usu_rol,
        privilegios: [
          'crear usuarios',
          'eliminar clientes',
          'ver reportes',
          'gestionar sistema',
        ],
      },
    })
  }

  if (user.usu_rol === 'cliente') {
    res.json({
      message: 'Perfil de cliente',
      user: {
        id: user.usu_id,
        name: user.usu_nombre,
        role: user.usu_rol,
        privilegios: ['ver productos', 'realizar compras', 'ver carrito'],
      },
    })
  }

  // Rol desconocido
  res.status(403).json({ error: 'Rol de usuario no permitido' })
}
