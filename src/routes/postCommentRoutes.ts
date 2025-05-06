import { Router } from "express";
import { 
    createComment,
    deleteComment,
    likeComment,
    unlikeComment,
    checkCommentLike,
    getCommentsByPostId,
    getRepliesForComment,
    getCommentCountForPost,
    getLikesCountForComment,
} from "../controllers/PostCommentController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
router.use(authMiddleware);

router.post('/', createComment);
router.delete('/:commentId', deleteComment);

router.post('/like/:commentId', likeComment);
router.delete('/like/:commentId', unlikeComment);
router.get('/like/:commentId', checkCommentLike);

router.get('/post/:postId', getCommentsByPostId);

router.get('/replies/:commentId', getRepliesForComment);

router.get('/count/:postId', getCommentCountForPost);
router.get('/likes-count/:commentId', getLikesCountForComment);

export default router;