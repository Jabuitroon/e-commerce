import { z } from 'zod'

export const CreateProductDto = z.object({
  // 'pro_title' -> 'varchar' (Convertido a string no vacío)
  name: z.string().min(1, 'El nombre es obligatorio'),

  // 'pro_image' -> 'varchar' (Debe ser una URL válida)
  image: z.string().url('La imagen debe ser una URL válida'),

  // 'pro_price_symbol' -> 'varchar' (ej. '$')
  symbol: z.string().min(1, 'El símbolo de la moneda es obligatorio'),

  // 'pro_price' -> 'varchar' (Se recibe como string según tu tabla)
  price: z.string().min(1, 'El precio es obligatorio'),

  // 'pro_stock' -> 'int' (Número entero mayor o igual a 0)
  stock: z
    .number()
    .int()
    .nonnegative('El stock debe ser un número entero positivo o cero'),

  // 'pro_star_rating' -> 'varchar' (ej. '4.4')
  ratingstar: z.string().min(1, 'La calificación por estrellas es obligatoria'),

  // 'pro_categoria_id' -> 'int' (Número entero identificador)
  idcategory: z
    .number()
    .int()
    .positive('El id de categoría debe ser un número entero positivo'),

  // 'pro_id' -> 'varchar' (Tu ejemplo muestra 'CAT1234' como código alfanumérico)
  category: z.string().min(1, 'El código de categoría es obligatorio'),
})

// Tipo inferido para TypeScript
export type CreateProductInput = z.infer<typeof CreateProductDto>
