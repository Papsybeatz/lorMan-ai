import { Router } from 'express';

const router = Router();

router.get('/case/:id', async (req, res) => {
  res.json({
    id: req.params.id,
    title: 'Case workspace',
    status: 'active',
    documents: [],
    evidence: [],
    docketEvents: []
  });
});

router.get('/docket', async (_req, res) => {
  res.json({ ok: true, events: [] });
});

export default router;
