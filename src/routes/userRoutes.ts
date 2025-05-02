import { Router } from "express";
import { updateProfile, getCurrentUser, getUserById, deleteAccount } from "../controllers/userController";
import { authMiddleware } from "../middlewares.ts/authMiddleware";

const router = Router();

router.put('/profile', authMiddleware, updateProfile);
router.get('/me', authMiddleware, getCurrentUser);
router.get('/:id', authMiddleware, getUserById);
router.delete('/delete', authMiddleware, deleteAccount);

export default router;