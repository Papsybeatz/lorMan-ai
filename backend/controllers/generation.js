import { draftingPrompt, generateWithAI, intakeSystemPrompt } from '../services/ai.js';

export async function intakeController(req, res, next) {
  try {
    const { userInput = '', country, practiceAreas } = req.body;
    const result = await generateWithAI({ systemPrompt: intakeSystemPrompt({ country, practiceAreas }), userInput });
    res.json({ ok: true, result });
  } catch (error) {
    next(error);
  }
}

export function draftController(documentType) {
  return async (req, res, next) => {
    try {
      const { userInput = '', country } = req.body;
      const result = await generateWithAI({ systemPrompt: draftingPrompt({ country, documentType }), userInput });
      res.json({ ok: true, result, documentType });
    } catch (error) {
      next(error);
    }
  };
}
