import { Router } from "express";
import { getAllExercises, getTargets } from "../controllers/exerciseController";

const router = Router();

router.get('/', getAllExercises);
router.get('/targets', getTargets);

export default router;