import { Router } from 'express';
import { getStatistics, getExerciseImprovementStats } from '../controllers/statisticsController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
router.use(authMiddleware);

router.get('/', getStatistics);
router.get('/improvement', getExerciseImprovementStats)

export default router;