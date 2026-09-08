import { Router } from 'express';
import { intakeSystemPrompt, generateWithAI } from '../services/ai.js';
import { getPrisma } from '../services/prisma.js';

const router = Router();

router.get('/case/:id', async (req, res) => {
  try {
    const foundCase = await getPrisma().case.findUnique({
      where: { id: req.params.id },
      include: { documents: true, facts: true, evidence: true, docketEvents: true, lawyer: true }
    });

    router.put('/case/:id/facts', async (req, res) => {
      const facts = Array.isArray(req.body.facts) ? req.body.facts : [];
      const normalizedFacts = facts
        .map((fact) => typeof fact === 'string' ? fact.trim() : '')
        .filter(Boolean);

      if (normalizedFacts.length > 50) {
        return res.status(400).json({ ok: false, error: 'A case can contain at most 50 facts.' });
      }

      try {
        const prisma = getPrisma();
        const foundCase = await prisma.case.findUnique({ where: { id: req.params.id } });
        if (!foundCase) return res.status(404).json({ ok: false, error: 'Case not found.' });

        await prisma.fact.deleteMany({ where: { caseId: req.params.id } });
        await prisma.fact.createMany({
          data: normalizedFacts.map((text) => ({ text, createdBy: 'lawyer', caseId: req.params.id }))
        });
        const updatedCase = await prisma.case.findUnique({ where: { id: req.params.id }, include: { facts: true } });
        res.json({ ok: true, facts: updatedCase.facts });
      } catch (error) {
        console.error(error);
        res.status(503).json({ ok: false, error: 'Facts could not be saved.' });
      }
    });

    router.post('/case/:id/brief', async (req, res, next) => {
      try {
        const prisma = getPrisma();
        const foundCase = await prisma.case.findUnique({
          where: { id: req.params.id },
          include: { facts: true, lawyer: true }
        });
        if (!foundCase) return res.status(404).json({ ok: false, error: 'Case not found.' });
        if (!foundCase.facts.length) return res.status(400).json({ ok: false, error: 'Add at least one approved fact before regenerating.' });

        const result = await generateWithAI({
          systemPrompt: intakeSystemPrompt({
            country: foundCase.jurisdiction,
            practiceAreas: [foundCase.practiceArea || 'general practice']
          }),
          userInput: foundCase.facts.map((fact) => `- ${fact.text}`).join('\n')
        });
        const brief = await prisma.document.create({
          data: {
            name: 'AI matter brief',
            type: 'brief',
            content: result.content || result.message || '',
            caseId: foundCase.id
          }
        });
        res.json({ ok: true, result, document: brief });
      } catch (error) {
        next(error);
      }
    });
    if (!foundCase) return res.status(404).json({ ok: false, error: 'Case not found.' });
    res.json({ ok: true, case: foundCase });
  } catch (error) {
    res.status(503).json({ ok: false, error: 'Database is unavailable. Configure DATABASE_URL and start PostgreSQL.' });
  }
});

router.get('/docket', async (_req, res) => {
  res.json({ ok: true, events: [] });
});

export default router;
