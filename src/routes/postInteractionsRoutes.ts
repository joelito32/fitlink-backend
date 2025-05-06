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

router.post('/like/:postId', likePost);
router.delete('/like/:postId', unlikePost);
router.get('/like/:postId', checkPostLiked);
router.get('/liked', getLikedPosts);

router.post('/save/:postId', savePost);
router.delete('/save/:postId', unsavePost);
router.get('/save/:postId', checkPostSaved);
router.get('/saved', getSavedPosts);

router.get('/likes-count/:postId', getLikesCountForPost);
router.get('/saves-count/:postId', getSavesCountForPost);

export default router;