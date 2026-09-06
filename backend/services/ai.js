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

console.log('[AI Init]', {
  provider,
  apiKeyPresent: Boolean(apiKey),
  model: provider === 'groq'
    ? (process.env.GROQ_MODEL || 'llama-3.3-70b-versatile')
    : (process.env.OPENAI_MODEL || 'gpt-4o-mini')
});

export async function generateWithAI({ systemPrompt, userInput }) {
  if (!client) {
    console.log('[AI] provider not configured');
    return {
      mode: 'scaffold',
      message: 'AI provider is not configured. Add GROQ_API_KEY or OPENAI_API_KEY to enable generation.',
      prompt: systemPrompt,
      input: userInput
    };
  }

  const model = provider === 'groq'
    ? (process.env.GROQ_MODEL || 'llama-3.3-70b-versatile')
    : (process.env.OPENAI_MODEL || 'gpt-4o-mini');

  try {
    const response = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userInput }
      ]
    });

    console.log(`[AI] provider=${provider}, model=${model}, success=true`);
    return { mode: provider, content: response.choices[0]?.message?.content || '' };
  } catch (error) {
    const status = error?.status ?? 'unknown';
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[AI] provider=${provider}, model=${model}, status=${status}, message=${message}`);

    return {
      mode: 'scaffold',
      message: 'AI generation is temporarily unavailable. The case was saved and can be retried.',
      prompt: systemPrompt,
      input: userInput
    };
  }
}

export { intakeSystemPrompt, draftingPrompt };
