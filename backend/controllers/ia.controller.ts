import { Request, Response } from 'express'
import { generateResponse } from '../services/ai.service'
// import { findProductData } from '../controllers/products.cotroller'
import { ChatMessage } from '@e-commerce/types/chatbot'

export const getIaResponse = async (
  req: Request,
  res: Response,
): Promise<void> => {
  console.log('getIaResponse body:', req.body)

  const validatePrompt = (prompt: ChatMessage) => {
    if (
      !prompt.content ||
      typeof prompt.content !== 'string' ||
      prompt.content.length < 5
    ) {
      return 'El prompt debe ser un texto válido con al menos 5 caracteres.'
    }
    if (prompt.content.length > 500) {
      return 'El prompt es demasiado largo. Máximo 500 caracteres permitidos.'
    }
    return true
  }

  try {
    const { chatMessages } = req.body
    // const lastMessage = userMessages[userMessages.length - 1]
    // const promptError = validatePrompt(lastMessage)
    // if (!promptError) {
    //   return res.status(400).json({ error: promptError })
    // }

    // if (!userMessages) {
    //   res.write('Pregúntame acerca de lo que vendemos')
    //   return
    // }

    // if (!Array.isArray(userMessages)) {
    //   res.status(400).json({ error: 'Messages inválidos' })
    // }

    res.setHeader('Content-Type', 'text/plain:charset=utf-8')
    res.setHeader('Transfer-Encoding', 'chunked')

    const stream = await generateResponse(chatMessages)

    // Chunks en tiempo real
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || ''
      res.write(content)
    }

    res.end()
  } catch (error) {
    console.error('Error en AI Controller:', error)
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: 'Error en la IA',
      })
    } else {
      res.write('\n[ERROR]')
      res.end()
    }
  }
}
