import { Request, Response, NextFunction } from 'express'
import { authHeaderSchema } from '../DTOs/auth.dto'
import jwt from 'jsonwebtoken'

import { JwtRequest } from '../types/user'

export const authentication = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      res.status(400).json({ error: 'No authorization header found' })
      return
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtRequest
    req.user = decoded
    next()
  } catch (error: any) {
    if (
      error.name === 'JsonWebTokenError' ||
      error.name === 'TokenExpiredError'
    ) {
      res.status(401).json({ error: 'Token inválido o expirado' })
      return
    }
    res.status(500).json({ error: 'Error de autenticación' })
    return
  }
}

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
