import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { Post } from "../entities/Post";
import { Routine } from "../entities/Routine";

export const searchUsers = async (query: string): Promise<Partial<User>[]> => {
    const userRepo = AppDataSource.getRepository(User);
    return await userRepo
        .createQueryBuilder("user")
        .where("user.username ILIKE :q OR user.name ILIKE :q", { q: `%${query}%` })
        .select(["user.id", "user.username", "user.name", "user.profilePic"])
        .getMany();
};

export const searchPosts = async (query: string): Promise<Post[]> => {
    const postRepo = AppDataSource.getRepository(Post);
    return await postRepo
        .createQueryBuilder("post")
        .leftJoinAndSelect("post.author", "author")
        .where("post.content ILIKE :q", { q: `%${query}%` })
        .getMany();
};

export const searchPublicRoutines = async (query: string): Promise<Routine[]> => {
    const routineRepo = AppDataSource.getRepository(Routine);
    return await routineRepo
        .createQueryBuilder("routine")
        .leftJoinAndSelect("routine.owner", "owner")
        .where("routine.isPublic = true AND (routine.title ILIKE :q OR routine.description ILIKE :q)", { q: `%${query}%` })
        .getMany();
};
