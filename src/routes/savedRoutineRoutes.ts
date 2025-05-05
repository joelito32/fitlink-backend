import { Router } from "express";
import { 
    addSavedRoutine,
    removeSavedRoutine,
    getSavedRoutines
} from "../controllers/SavedRoutineController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.post('/routines/save/:id', addSavedRoutine);
router.delete('/routines/save/:id', removeSavedRoutine);
router.get('/routines/saved', getSavedRoutines);

export default router;
