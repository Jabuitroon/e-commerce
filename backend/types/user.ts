export interface IUser {
  usu_id: number
  usu_nombre: string
  usu_rol: Role
}
 
export enum Role {
  ADMINISTRADOR = 'administrador',
  CLIENTE = 'cliente',
}
 
export interface IUserDao {
  findById(id: number): Promise<IUser | null>
  findAll(): Promise<IUser[]>
  create(user: IUser): Promise<number>
}