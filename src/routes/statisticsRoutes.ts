import { Router } from 'express';
import { getStatistics } from '../controllers/statisticsController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
router.use(authMiddleware);

router.get('/', getStatistics);

export default router;