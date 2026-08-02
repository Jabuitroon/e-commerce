import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import { IUser } from '../types/user'

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
    req.user = decoded as IUser
    next()
  } catch (error) {
    res.status(401).json('Invalid token')
    return
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
