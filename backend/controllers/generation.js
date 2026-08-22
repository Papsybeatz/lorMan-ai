import { draftingPrompt, generateWithAI, intakeSystemPrompt } from '../services/ai.js';
import { prisma } from '../services/prisma.js';

export async function intakeController(req, res, next) {
  try {
    const {
      userInput = '',
      matter,
      practiceArea = 'Civil litigation',
      urgency = 'Standard',
      country = 'Nigeria',
      practiceAreas = [practiceArea],
      lawyer = { name: 'Charles K.', email: 'charles@lorman.local' }
    } = req.body;

    if (!matter || !userInput) {
      return res.status(400).json({ ok: false, error: 'Matter name and facts are required.' });
    }

    const savedLawyer = await prisma.lawyer.upsert({
      where: { email: lawyer.email },
      update: { name: lawyer.name, country, practiceAreas },
      create: { name: lawyer.name, email: lawyer.email, country, practiceAreas }
    });

    const savedCase = await prisma.case.create({
      data: {
        title: matter,
        practiceArea,
        jurisdiction: country,
        lawyerId: savedLawyer.id,
        documents: {
          create: {
            name: 'Initial intake',
            type: 'intake',
            content: JSON.stringify({ facts: userInput, urgency })
          }
        }
      },
      include: { documents: true }
    });

    const result = await generateWithAI({ systemPrompt: intakeSystemPrompt({ country, practiceAreas }), userInput });
    res.status(201).json({ ok: true, case: savedCase, result });
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
