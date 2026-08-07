export interface JwtRequest {
  usu_id: number
  email: string
  usu_rol: Role
}

export enum Role {
  ADMINISTRADOR = 'administrador',
  CLIENTE = 'cliente',
}

export interface IUserDao {
  findById(id: number): Promise<JwtRequest | null>
  findAll(): Promise<JwtRequest[]>
  create(user: JwtRequest): Promise<number>
}

import { RowDataPacket } from 'mysql2/promise'

export type Rol = 'admin' | 'cliente' | 'vendedor' // Ajusta según tus roles

export interface Perfil {
  id_usuario: number
  nombre: string
  email: string
  rol: Rol
}

export interface UserRow extends RowDataPacket, Perfil {}
