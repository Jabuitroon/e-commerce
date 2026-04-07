import 'dotenv/config';
import { createOpenAI } from '@ai-sdk/openai';

export const aiClient = createOpenAI({
  apiKey: process.env.AI_GATEWAY_API_KEY,
  baseURL: 'https://gateway.vercel.ai/v1',
});