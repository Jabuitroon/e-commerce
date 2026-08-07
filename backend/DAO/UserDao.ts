import { pool } from '../config/db'

import { IUserDAO, Perfil, UserRow } from '../types/user'

export class UserDAO implements IUserDAO {
  async findById(idUsuario: number): Promise<Perfil | null> {
    const [rows] = await pool.query<UserRow[]>(
      `SELECT usu_id AS id_usuario, usu_nombre AS nombre, usu_email AS email, usu_rol AS rol FROM tbl_usuario WHERE usu_id = ?`,
      [idUsuario],
    )

    const user = rows[0]
    if (!user) return null

    return {
      id_usuario: user.id_usuario,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
    }
  }
}
