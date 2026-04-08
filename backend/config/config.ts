import * as dotenv from 'dotenv';
import { resolve } from 'path';
dotenv.config({ path: resolve(__dirname, '../.env') });

import { createOpenAI } from '@ai-sdk/openai';

export const aiClient = createOpenAI({
  apiKey: process.env.AI_GATEWAY_API_KEY,
  baseURL: process.env.AI_GATEWAY_BASE_URL || 'https://gateway.vercel.ai/v1',
});