import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import { IUser, Role } from '../types/user'
interface JwtRequest extends Request {
  user?: {
    usu_id: number
    usu_nombre: string
    usu_rol: Role
  }
}

export const authentication = (
  req: JwtRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json('No authorization header found')
  }

  const token = authHeader.split(' ')[1] // Token structure is 'Bearer <token>'
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY || 'shhh')
    req.user = decoded as IUser
    next()
  } catch (error) {
    return res.status(401).json('Invalid token')
  }
}

export const generateToken = (
  userId: string,
  username: string,
  userrol: string,
) => {
  return jwt.sign(
    {
      usu_id: userId,
      usu_nombre: username,
      usu_rol: userrol,
    },
    process.env.SECRET_KEY || 'shhh',
    { expiresIn: '1h' },
  )
}
