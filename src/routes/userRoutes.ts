import { Router } from "express";
import { updateProfile, getCurrentUser, getUserById, deleteAccount } from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";
import multer from "multer";
import path from "path";

const router = Router();
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, path.resolve('uploads'));
    },
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = `profile_${Date.now()}${ext}`;
        cb(null, uniqueName);
    }
});
const upload = multer({ storage });

router.put('/me', authMiddleware, upload.single('profilePic'), updateProfile);
router.get('/me', authMiddleware, getCurrentUser);
router.get('/:id', authMiddleware, getUserById);
router.delete('/me', authMiddleware, deleteAccount);

export default router;