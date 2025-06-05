import { Router } from "express";
import { getAllExercises, getTargets, search } from "../controllers/exerciseController";

const router = Router();

router.get('/', getAllExercises);
router.get('/targets', getTargets);
router.get('/search', search);

export default router;