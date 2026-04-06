import { Request, Response } from 'express'
import { generateResponse } from '../services/ai.service'
import { findProductData } from '../controllers/products.cotroller'

export const getProductSummary = async (req: Request, res: Response) => {
  try {
    const { userMessage } = req.body

    // Call service
    const result = await generateResponse(userMessage)

    result.pipeTextStreamToResponse(res);
  } catch (error: any) {
    console.error('Error en AI Controller:', error)
    res.status(500).json({ message: 'Error interno al procesar IA' })
  }
}
