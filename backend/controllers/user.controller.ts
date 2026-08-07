import { Request, Response } from 'express'
import { UserDAO } from '../DAO/UserDao'
import { AuthError } from '../services/auth.service'

const userDao = new UserDAO()

export const getProfile = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const userId = req.user?.usu_id

    if (!userId) {
      return res.status(401).json({ error: 'No autorizado' })
    }

    const profile = await userDao.findById(userId)
    return res.status(200).json(profile)
  } catch (error) {
    if (error instanceof AuthError) {
      return res.status(error.statusCode).json({ message: error.message })
    }
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}
