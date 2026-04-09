import 'dotenv/config'
import { ChatMessage } from '@e-commerce/types/chatbot'
// import { OpenAI } from 'openai'
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

import { Groq } from 'groq-sdk'
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function generateResponse(chat: ChatMessage[]) {
  try {
    // console.log('key:', process.env.OPENAI_API_KEY)
    console.log('key:', process.env.GROQ_API_KEY)

    const response = await groq.chat.completions.create({
      model: 'openai/gpt-oss-120b',
      messages: [
        {
          role: 'system',
          // content:
          //   'You are DonPTG. You are a marketing expert. You will find ways to persuade users to make purchases. You must help users find their favorite products in our online store.',
          content: 'You are an expert in traditional natural medicine. You must help the user find medicine for their symptoms.'
        },
        ...chat,
      ],
      // Controla la creatividad de la respuesta de 0 a 1
      temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),

      // Máximo tokens para la respuesta (sin contar el prompt). Se ajusta según los límites del modelo.
      max_tokens: parseInt(process.env.AI_MAX_TOKENS || '1200'),

      // Máximo tokens para la respuesta completa (incluyendo el prompt). Se ajusta según el tamaño de tu prompt.
      // max_completion_tokens: 8192,

      // Diversidad de la respuesta. A menor valor el modelo se enfoca en las opciones más probables, a mayor valor respuestas más variadas.
      top_p: parseFloat(process.env.AI_TOP_P || '0.9'),

      // Número de respuestas a generar
      n: 1,

      // A mayor valor más determinista y lenta respuesta
      reasoning_effort: 'medium',
      stream: true,
      stop: null,
    })

    return response
  } catch (err) {
    console.error('Error en generateResponse:', err)
    throw err
  }
}

// export async function generateRecommendation(
//   userQuery: string,
//   productContext: string,
//   mode: 'free' | 'pro' = 'pro',
// ) {
//   const modelName =
//     mode === 'free' ? 'google/gemini-1.5-flash' : 'openai/gpt-4o-mini'

//   const model = aiClient(modelName)

//   const result = await generateObject({
//     model,
//     schema: {
//       message: 'string',
//       products: [
//         {
//           id: 'number',
//           name: 'string',
//           price: 'number',
//           reason: 'string',
//         },
//       ],
//     },
//     system: `Eres un asistente de ventas experto. Contexto de productos: ${productContext}`,
//     prompt: userQuery,
//   })

//   return result.object
// }
