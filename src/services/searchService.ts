import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { Post } from "../entities/Post";
import { Routine } from "../entities/Routine";
import { hasUserLikedPost, hasUserSavedPost } from "./postInteractionService";

export const searchUsers = async (query: string): Promise<Partial<User>[]> => {
    const userRepo = AppDataSource.getRepository(User);
    return await userRepo
        .createQueryBuilder("user")
        .where("user.username ILIKE :q OR user.name ILIKE :q", { q: `%${query}%` })
        .select(["user.id", "user.username", "user.name", "user.profilePic"])
        .getMany();
};

export const searchPosts = async (query: string, viewerId: number): Promise<(Post & { isLiked: boolean; isSaved: boolean })[]> => {
    const postRepo = AppDataSource.getRepository(Post);
    const posts = await postRepo
        .createQueryBuilder("post")
        .leftJoinAndSelect("post.author", "author")
        .leftJoinAndSelect("post.routine", "routine")
        .leftJoinAndSelect("routine.exercises", "exercises")
        .where("post.content ILIKE :q", { q: `%${query}%` })
        .select([
            "post",
            "author",
            "author.id", "author.username", "author.name", "author.profilePic",
            "routine.id", "routine.title", "routine.description", "routine.isPublic", "routine.updatedAt",
            "exercises.id", "exercises.name"
        ])
        .getMany();
    return await Promise.all(
        posts.map(async post => ({
            ...post,
            isLiked: await hasUserLikedPost(viewerId, post.id),
            isSaved: await hasUserSavedPost(viewerId, post.id),
        }))
    );
};

export const searchPublicRoutines = async (query: string): Promise<Routine[]> => {
    const routineRepo = AppDataSource.getRepository(Routine);
    return await routineRepo
        .createQueryBuilder("routine")
        .leftJoinAndSelect("routine.owner", "owner")
        .leftJoinAndSelect("routine.exercises", "exercise")
        .where("routine.isPublic = true")
        .andWhere("routine.title ILIKE :q OR routine.description ILIKE :q", { q: `%${query}%` })
        .andWhere("owner.id IS NOT NULL")
        .select([
            "routine",
            "owner",
            "owner.id", "owner.username",
            "exercise.id", "exercise.name"
        ])
        .getMany();
};
