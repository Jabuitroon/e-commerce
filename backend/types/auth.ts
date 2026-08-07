import { RowDataPacket } from 'mysql2/promise'
import { Rol } from './user'

export interface UserAuthRow extends RowDataPacket {
  usu_id: number
  usu_nombre: string
  usu_email: string
  usu_contrasena: string
  usu_rol: Rol
}

export interface LoginResponse {
  token: string
}

export interface IUserAuthDAO {
  findByEmail(email: string): Promise<UserAuthRow | null>
}
