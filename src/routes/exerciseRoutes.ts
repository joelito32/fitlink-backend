import { Router } from "express";
import { getAllExercises, getTargets, search, getExerciseById } from "../controllers/exerciseController";

const router = Router();

router.get('/', getAllExercises);
router.get('/targets', getTargets);
router.get('/search', search);
router.get('/:id', getExerciseById);

export default router;