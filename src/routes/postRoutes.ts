import { Router } from "express";
import { 
    createPost,
    deletePost,
    getUserPosts,
    getAllPosts,
    getPostById,
} from "../controllers/postController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
router.use(authMiddleware);

router.post('/', createPost);
router.delete('/:id', deletePost);
router.get('/', getAllPosts);
router.get('/user/:userId', getUserPosts);
router.get('/:id', getPostById);

export default router;