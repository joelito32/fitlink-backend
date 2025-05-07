import { AppDataSource } from "../data-source";
import { Follower } from "../entities/Follower";
import { User } from "../entities/User";

const userRepo  = AppDataSource.getRepository(User);
const followerRepo = AppDataSource.getRepository(Follower);

export const isUserExists = async (userId: number): Promise<boolean> => {
    const user = await userRepo.findOneBy({ id: userId });
    return !!user;
};

export const isAlreadyFollowing = async (
    followerId: number,
    followingId: number
): Promise<boolean> => {
    const existing = await followerRepo.findOne({
        where: { follower: { id: followerId }, following: {id: followingId } },
    });
    return !!existing;
};

export const createFollow = async (
    followerId: number,
    followingId: number
): Promise<void> => {
    const newFollow = followerRepo.create({
        follower: { id: followerId },
        following: { id: followingId },
    });
    await followerRepo.save(newFollow);
};

export const removeFollow = async (
    followerId: number,
    followingId: number
): Promise<void> => {
    const follow = await followerRepo.findOne({
        where: { follower: { id: followerId }, following: { id: followingId } },
    });
    if (follow) {
        await followerRepo.remove(follow);
    }
};

export const getFollowersOfUser = async (userId: number) => {
    const followers = await followerRepo.find({
        where: { following: { id: userId } },
        relations: ['follower'],
    });
    return followers.map(f => f.follower);
};

export const getFollowingOfUser = async (userId: number) => {
    const following = await followerRepo.find({
        where: { follower: { id: userId } },
        relations: ['following'],
    });
    return following.map(f => f.following);
};

export const getFollowersCountByUserId = async (userId: number): Promise<number> => {
    return followerRepo.count({
        where: { following: { id: userId } },
    });
};

export const getFollowingCountByUserId = async (userId: number): Promise<number> => {
    return followerRepo.count({
        where: { follower: { id: userId } },
    });
};