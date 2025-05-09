import { Router } from "express";
import { updateProfile, getCurrentUser, getUserById, deleteAccount } from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.put('/me', authMiddleware, updateProfile);
router.get('/me', authMiddleware, getCurrentUser);
router.get('/:id', authMiddleware, getUserById);
router.delete('/me', authMiddleware, deleteAccount);

export default router;