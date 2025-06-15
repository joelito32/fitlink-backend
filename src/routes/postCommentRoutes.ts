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
    getRepliesCountForComment
} from "../controllers/PostCommentController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
router.use(authMiddleware);

router.post('/', createComment);
router.delete('/:commentId', deleteComment);

router.post('/:commentId/like', likeComment);
router.delete('/:commentId/like', unlikeComment);

router.get('/:commentId/like', checkCommentLike);

router.get('/post/:postId', getCommentsByPostId);

router.get('/:commentId/replies', getRepliesForComment);

router.get('/post/:postId/count', getCommentCountForPost);
router.get('/:commentId/likes/count', getLikesCountForComment);
router.get('/:commentId/replies/count', getRepliesCountForComment);

export default router;