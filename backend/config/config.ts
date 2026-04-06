import { createOpenAI } from '@ai-sdk/openai';

export const aiClient = createOpenAI({
  apiKey: process.env.AI_GATEWAY_API_KEY,
  baseURL: 'https://gateway.verdcel.ai/v1',
});