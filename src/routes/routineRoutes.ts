import { Router } from 'express';
import { 
    createRoutine, 
    getRoutines, 
    updateRoutine, 
    deleteRoutine,
    getPublicRoutinesFromFollowedUsers,
} from '../controllers/routineController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.post('/', createRoutine);
router.get('/', getRoutines);
router.get('/feed', getPublicRoutinesFromFollowedUsers);
router.put('/:id', updateRoutine);
router.delete('/:id', deleteRoutine);

export default router;
