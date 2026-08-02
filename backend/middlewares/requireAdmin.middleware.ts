import { Request, Response, NextFunction } from 'express'
import { Role } from '../types/user'
 
/**
 * Debe ejecutarse DESPUÉS de `authentication` (auth.middleware.ts),
 * que es quien setea req.user desde el JWT.
 */
export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!req.user) {
    res.status(401).json({ message: 'No autenticado' })
    return
  }
  if (req.user.usu_rol !== Role.ADMINISTRADOR) {
    res.status(403).json({ message: 'Acceso restringido a administradores' })
    return
  }
  next()
}
