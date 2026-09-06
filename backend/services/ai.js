import OpenAI from 'openai';
import prompts from '../../shared/prompts/index.js';

const { intakeSystemPrompt, draftingPrompt } = prompts;

const provider = (process.env.AI_PROVIDER || (process.env.GROQ_API_KEY ? 'groq' : 'openai')).toLowerCase();
const apiKey = provider === 'groq' ? process.env.GROQ_API_KEY : process.env.OPENAI_API_KEY;
const client = apiKey
  ? new OpenAI({
      apiKey,
      ...(provider === 'groq' ? { baseURL: 'https://api.groq.com/openai/v1' } : {})
    })
  : null;

export async function generateWithAI({ systemPrompt, userInput }) {
  if (!client) {
    return {
      mode: 'scaffold',
      message: 'AI provider is not configured. Add GROQ_API_KEY or OPENAI_API_KEY to enable generation.',
      prompt: systemPrompt,
      input: userInput
    };
  }

  const response = await client.chat.completions.create({
    model: provider === 'groq'
      ? (process.env.GROQ_MODEL || 'llama-3.3-70b-versatile')
      : (process.env.OPENAI_MODEL || 'gpt-4o-mini'),
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userInput }
    ]
  });

  return { mode: provider, content: response.choices[0]?.message?.content || '' };
}

export { intakeSystemPrompt, draftingPrompt };
