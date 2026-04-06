import { aiClient } from '../config/config'
import { streamText, generateObject } from 'ai'

export async function generateResponse(prompt: string) {
  const model = aiClient('zai/glm-4.6v-flash')

  const text = streamText({
    model,
    prompt,
    temperature: 0.7,
  })

  return text
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
