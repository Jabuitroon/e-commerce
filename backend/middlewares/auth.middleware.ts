import { Request, Response, NextFunction } from 'express'
import { ZodObject, ZodError } from 'zod'
import jwt from 'jsonwebtoken'

import { JwtRequest } from '../types/user'
import { loginSchema } from 'backend/DTOs/auth.dto'

export const authentication = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    res.status(401).json('No authorization header found')
    return
  }

  const token = authHeader.split(' ')[1] // Token structure is 'Bearer <token>'
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY || 'shhh')
    req.user = decoded as JwtRequest
    next()
  } catch (error) {
    res.status(401).json('Invalid token')
    return
  }
}

// export const generateToken = (
//   userId: string,
//   username: string,
//   userrol: string,
// ) => {
//   return jwt.sign(
//     {
//       usu_id: userId,
//       usu_nombre: username,
//       usu_rol: userrol,
//     },
//     process.env.SECRET_KEY || 'shhh',
//     { expiresIn: '1h' },
//   )
// }

export const whitelistBody = (allowedFields: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.body || typeof req.body !== 'object') {
      res.status(400).json({ error: 'Cuerpo de petición inválido' })
      return
    }

    const sanitizedBody: Record<string, any> = {}

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        sanitizedBody[field] = req.body[field]
      }
    }

    req.body = sanitizedBody
    next()
  }
}
