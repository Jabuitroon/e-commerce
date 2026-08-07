import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string({ message: 'El email es requerido' })
    .email({ message: 'El formato del email no es válido' }),
  password: z
    .string()
    .min(1, { message: 'La contraseña no puede estar vacía' }),
})

export type LoginDTO = z.infer<typeof loginSchema>

export const authHeaderSchema = z.object({
  authorization: z
    .string({ message: 'El encabezado Authorization es requerido' })
    .regex(/^Bearer\s+[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/, {
      message: 'Formato de Token inválido. Debe ser: Bearer <token>',
    }),
})