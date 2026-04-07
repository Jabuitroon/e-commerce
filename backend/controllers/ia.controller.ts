import { Request, Response } from 'express'
import { generateResponse } from '../services/ai.service'
import { findProductData } from '../controllers/products.cotroller'

export const getIaResponse = async (req: Request, res: Response) => {
  try {
    const { userMessage } = req.body

    const result = await generateResponse(userMessage)

    res.json({
      reply: result,
    })
  } catch (error: any) {
    console.error('Error en AI Controller:', error)
    // Solo enviamos error si el stream no ha empezado a escribir
    if (!res.headersSent) {
      res.status(500).json({ message: 'Error interno al procesar IA' })
    }
  }
}
