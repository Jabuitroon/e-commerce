import { Request, Response } from 'express'
import { generateResponse } from '../services/ai.service'
import { findProductData } from '../controllers/products.cotroller'

export const getIaResponse = async (req: Request, res: Response) => {
  console.log('getIaResponse body:', req.body)
  try {
    const { userMessage } = req.body

    const result = await generateResponse(userMessage)

    res.json({ response: result })
  } catch (error) {
    console.error('Error en AI Controller:', error)
    const message = (error as any)?.message || 'Error en la comunicación con OpenAI'
    const details = process.env.NODE_ENV === 'production' ? undefined : { stack: (error as any)?.stack, raw: String(error) }
    res.status(500).json({ message, details })
  }
}
