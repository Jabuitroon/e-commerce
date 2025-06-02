import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const validateToken = (req: Request, res: Response, next: NextFunction) => {
  const headerToken = req.headers['authorization']

  if (headerToken != undefined && headerToken.startsWith('Bearer')) {
    const bearerToken = headerToken.slice(7)
    try {
      const decoded = jwt.verify(bearerToken, process.env.SECRET_KEY || 'shhh')
      req.user = decoded
      
      next()
    } catch (error) {
      res.status(400).json({ msj: 'Token no válido' })
    }
  } else {
    res.status(400).json({
      error: 'Acceso denegado prro',
    })
  }
}

export default validateToken
