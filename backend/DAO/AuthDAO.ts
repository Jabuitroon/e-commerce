import { pool } from '../config/db'
import { IUserAuthDAO } from '../types/auth'
import { UserAuthRow } from '../types/auth'

export class AuthDAO implements IUserAuthDAO {
  async findByEmail(email: string): Promise<UserAuthRow | null> {
    const SQL_QUERY = 'SELECT * FROM tbl_usuario WHERE usu_email = ?'
    const [rows] = await pool.query<UserAuthRow[]>(SQL_QUERY, [email])

    return rows[0] ?? null
  }
}
