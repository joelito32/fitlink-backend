import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import {
    getNotifications,
    markAllAsRead,
} from '../controllers/notificationController';

const router = Router();

router.use(authMiddleware);

router.get('/', getNotifications);
router.patch('/read-all', markAllAsRead);

export default router;
