import { Router } from "express";
import { search } from "../controllers/searchController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
router.use(authMiddleware);

router.get('/', search);

export default router;