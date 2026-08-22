import { Router } from 'express';
import { prisma } from '../services/prisma.js';

const router = Router();

router.get('/case/:id', async (req, res) => {
  try {
    const foundCase = await prisma.case.findUnique({
      where: { id: req.params.id },
      include: { documents: true, evidence: true, docketEvents: true, lawyer: true }
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
