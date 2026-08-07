export interface IUserDAO {
  findById(id: number): Promise<Perfil | null>
  // findAll(): Promise<JwtRequest[]>
  // create(user: JwtRequest): Promise<number>
}

export interface JwtRequest {
  usu_id: number
  email: string
  usu_rol: Role
}

import { RowDataPacket } from 'mysql2/promise'

export interface Perfil {
  id_usuario: number
  nombre: string
  email: string
  rol: Role
}

export enum Role {
  ADMINISTRADOR = 'administrador',
  CLIENTE = 'cliente',
}

export interface UserRow extends RowDataPacket, Perfil {}
