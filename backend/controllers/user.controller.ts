import { Request, Response } from 'express'
import { UserDAO } from '../DAO/UserDao'

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
  } catch (error: any) {
    const statusCode = error.statusCode || 500
    return res.status(statusCode).json({
      error: error.message || 'Error interno del servidor',
    })
  }
}
