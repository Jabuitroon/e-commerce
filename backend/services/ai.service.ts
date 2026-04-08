import 'dotenv/config'
// import { OpenAI } from 'openai'
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

import { Groq } from 'groq-sdk'
const groq = new Groq()

export async function generateResponse(prompt: string) {
  try {
    // console.log('key:', process.env.OPENAI_API_KEY)
    console.log('key:', process.env.GROQ_API_KEY)

    const response = await groq.chat.completions.create({
      model: 'openai/gpt-oss-120b',
      messages: [{ role: 'user', content: prompt }],
      temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
      max_tokens: parseInt(process.env.AI_MAX_TOKENS || '1200'),
      // max_completion_tokens: 8192,
      top_p: parseFloat(process.env.AI_TOP_P || '0.9'),
      // n: 1,
      stream: false,
      reasoning_effort: 'medium',
      stop: null,
    })

    const text = response.choices?.[0]?.message?.content || ''

    return text
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
