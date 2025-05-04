import { Router } from "express";
import { 
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    getFollowersCount,
    getFollowingCount,
} from "../controllers/followerController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.post('/follow/:id', followUser);
router.post('/unfollow/:id', unfollowUser);

router.get('/followers', getFollowers);
router.get('/following', getFollowing);

router.get('/followers/count', getFollowersCount);
router.get('/following/count', getFollowingCount);

export default router;