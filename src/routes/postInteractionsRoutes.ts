import { Router } from "express";
import { 
    likePost,
    unlikePost,
    checkPostLiked,
    savePost,
    unsavePost,
    checkPostSaved,
    getLikedPosts,
    getSavedPosts,
    getLikesCountForPost,
    getSavesCountForPost,
} from "../controllers/postInteractionsController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
router.use(authMiddleware);

router.post('/:postId/like', likePost);
router.delete('/:postId/like', unlikePost);
router.get('/:postId/like', checkPostLiked);

router.get('/liked', getLikedPosts);

router.post('/:postId/save', savePost);
router.delete('/:postId/save', unsavePost);
router.get('/:postId/save', checkPostSaved);

router.get('/saved', getSavedPosts);

router.get('/:postId/likes/count', getLikesCountForPost);
router.get('/:postId/saves/count', getSavesCountForPost);

export default router;