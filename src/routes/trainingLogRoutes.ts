import { Router } from "express";
import { 
    createTrainingLog,
    getTrainingLogById,
    getTrainingLogs,
} from "../controllers/trainingLogController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
router.use(authMiddleware);

router.post('/', createTrainingLog);
router.get('/', getTrainingLogs);
router.get('/:id', getTrainingLogById);

export default router;