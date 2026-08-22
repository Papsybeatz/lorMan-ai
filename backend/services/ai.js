import OpenAI from 'openai';
import { intakeSystemPrompt, draftingPrompt } from '../../shared/prompts/index.js';

const client = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export async function generateWithAI({ systemPrompt, userInput }) {
  if (!client) {
    return {
      mode: 'scaffold',
      message: 'AI provider is not configured. Add OPENAI_API_KEY to enable generation.',
      prompt: systemPrompt,
      input: userInput
    };
  }

  const response = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userInput }
    ]
  });

  return { mode: 'openai', content: response.choices[0]?.message?.content || '' };
}

export { intakeSystemPrompt, draftingPrompt };
