import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { LoginDTO } from '../DTOs/auth.dto'
import { LoginResponse } from '../types/auth'
import { AuthDAO } from '../DAO/AuthDAO'

const authDAO = new AuthDAO()

export class AuthError extends Error {
  statusCode: number
  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
  }
}

export const login = async (credentials: LoginDTO): Promise<LoginResponse> => {
  const user = await authDAO.findByEmail(credentials.email)

  if (!user) {
    throw new AuthError('No existe el usuario', 404)
  }

  const isMatch = await bcrypt.compare(
    credentials.password,
    user.usu_contrasena,
  )

  if (!isMatch) {
    throw new AuthError('Credenciales incorrectas', 401)
  }

  if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRES_IN) {
    throw new AuthError('.env No configured', 500)
  }

  const token = jwt.sign(
    {
      usu_id: user.usu_id,
      email: user.usu_email,
      usu_rol: user.usu_rol,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN as any },
  )

  return { token }
}
