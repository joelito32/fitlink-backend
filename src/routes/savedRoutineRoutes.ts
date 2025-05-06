import { Router } from "express";
import { 
    addSavedRoutine,
    removeSavedRoutine,
    getSavedRoutines
} from "../controllers/SavedRoutineController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.post('/:routineId', addSavedRoutine);
router.delete('/:routineId', removeSavedRoutine);
router.get('/', getSavedRoutines);

export default router;
