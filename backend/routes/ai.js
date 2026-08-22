import { Router } from 'express';
import { draftController, intakeController } from '../controllers/generation.js';

const router = Router();

router.post('/intake', intakeController);
router.post('/civil/writ', draftController('civil writ'));
router.post('/civil/witness', draftController('witness statement'));
router.post('/criminal/bail', draftController('bail application'));
router.post('/criminal/no-case', draftController('no-case submission'));
router.post('/trial/strategy', draftController('trial strategy'));
router.post('/research', draftController('legal research memo'));

export default router;
