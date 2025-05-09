import { Router } from 'express';
import { 
    createRoutine, 
    getRoutines, 
    updateRoutine, 
    deleteRoutine,
    getPublicRoutinesFromFollowedUsers,
    setRoutineVisibility,
} from '../controllers/routineController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.post('/', createRoutine);
router.get('/', getRoutines);
router.get('/feed/following', getPublicRoutinesFromFollowedUsers);
router.put('/:id', updateRoutine);
router.delete('/:id', deleteRoutine);
router.patch('/:id/visibility', setRoutineVisibility);

export default router;
