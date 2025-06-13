import { Router } from "express";
import { 
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    getFollowersCount,
    getFollowingCount,
    checkIfFollowing
} from "../controllers/followerController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.post('/follow/:id', followUser);
router.delete('/unfollow/:id', unfollowUser);

router.get('/followers/:id', getFollowers);
router.get('/following/:id', getFollowing);
router.get('/followers/count/:id', getFollowersCount);
router.get('/following/count/:id', getFollowingCount);

router.get('/is-following/:id', checkIfFollowing);

export default router;