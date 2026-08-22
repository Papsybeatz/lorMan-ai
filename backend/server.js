import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import aiRoutes from './routes/ai.js';
import caseRoutes from './routes/cases.js';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json({ limit: '2mb' }));

app.get('/health', (_req, res) => res.json({ ok: true, service: 'lorman-api' }));
app.use('/api', aiRoutes);
app.use('/api', caseRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ ok: false, error: 'Request could not be completed.' });
});

app.listen(port, () => console.log(`lorMan API listening on ${port}`));
