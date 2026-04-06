import { Router } from 'express'
import { Request, Response } from 'express'
import { generateResponse } from '../services/ai.service'
import { getProducts } from '../controllers/products.cotroller'
import { conn } from '../server'

export const aiRouter = Router()

aiRouter.post('/chat', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userMessage } = req.body

    if (!userMessage) {
      res.status(400).json({ message: 'Pregúntame sobre lo que vendemos' })
      return
    }

    // Generate AI response with context
    const result = await generateResponse(userMessage)

    res.status(200).json({ message: result })
  } catch (error) {
    console.error('AI Chat error:', error)
    res.status(500).json({ message: 'Error processing AI chat' })
  }
})
