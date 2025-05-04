import { Router } from 'express';
import { createRoutine, getRoutines, updateRoutine, deleteRoutine } from '../controllers/routineController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.post('/', createRoutine);
router.get('/', getRoutines);
router.put('/:id', updateRoutine);
router.delete('/:id', deleteRoutine);

export default router;
