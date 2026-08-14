import 'dotenv/config'
import { createOpenAI } from '@ai-sdk/openai'

export const aiClient = createOpenAI({
  apiKey: process.env.AI_GATEWAY_API_KEY,
  baseURL: process.env.AI_GATEWAY_BASE_URL,
})
