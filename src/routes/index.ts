import { Router } from "express";

import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import followerRoutes from './followerRoutes';
import exerciseRoutes from './exerciseRoutes';
import routineRoutes from './routineRoutes';
import savedRoutineRoutes from './savedRoutineRoutes';
import trainingLogRoutes from './trainingLogRoutes';
import statisticsRoutes from './statisticsRoutes';
import postRoutes from './postRoutes';
import postInteractionsRoutes from './postInteractionsRoutes';
import postCommentRoutes from './postCommentRoutes';
import notificationRoutes from './notificationRoutes';
import searchRoutes from './searchRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/followers', followerRoutes);
router.use('/exercises', exerciseRoutes);
router.use('/routines', routineRoutes);
router.use('/saved-routines', savedRoutineRoutes);
router.use('/training-logs', trainingLogRoutes);
router.use('/statistics', statisticsRoutes);
router.use('/posts', postRoutes);
router.use('/interactions', postInteractionsRoutes);
router.use('/comments', postCommentRoutes);
router.use('/notifications', notificationRoutes);
router.use('/search', searchRoutes);

export default router;