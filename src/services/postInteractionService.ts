import { AppDataSource } from "../data-source";
import { Post } from "../entities/Post";
import { PostSaved } from "../entities/PostSaved";
import { PostLike } from "../entities/PostLike";

export const isPostExists = async (postId: number): Promise<Post | null> => {
    return await AppDataSource.getRepository(Post).findOne({
        where: { id: postId },
        relations: ['author'],
    });
};

export const hasUserLikedPost = async (userId: number, postId: number): Promise<boolean> => {
    const repo = AppDataSource.getRepository(PostLike);
    const like = await repo.findOne({
        where: { user: { id: userId }, post: { id: postId } },
    });
    return !!like;
};

export const likePostByUser = async (userId: number, post: Post): Promise<void> => {
    const repo = AppDataSource.getRepository(PostLike);
    const like = repo.create({ user: { id: userId }, post });
    await repo.save(like);
};

export const unlikePostByUser = async (userId: number, postId: number): Promise<boolean> => {
    const repo = AppDataSource.getRepository(PostLike);
    const like = await repo.findOne({
        where: { user: { id: userId }, post: { id: postId } },
    });
    if (!like) return false;

    await repo.remove(like);
    return true;
};

export const hasUserSavedPost = async (userId: number, postId: number): Promise<boolean> => {
    const repo = AppDataSource.getRepository(PostSaved);
    const saved = await repo.findOne({
        where: { user: { id: userId }, post: { id: postId } },
    });
    return !!saved;
};

export const savePostByUser = async (userId: number, post: Post): Promise<void> => {
    const repo = AppDataSource.getRepository(PostSaved);
    const saved = repo.create({ user: { id: userId }, post });
    await repo.save(saved);
};

export const unsavePostByUser = async (userId: number, postId: number): Promise<boolean> => {
    const repo = AppDataSource.getRepository(PostSaved);
    const saved = await repo.findOne({
        where: { user: { id: userId }, post: { id: postId } },
    });
    if (!saved) return false;

    await repo.remove(saved);
    return true;
};

export const getLikedPostsByUser = async (userId: number): Promise<Post[]> => {
    const likes = await AppDataSource.getRepository(PostLike).find({
        where: { user: { id: userId } },
        relations: ['post', 'post.author', 'post.routine', 'post.routine.owner', 'post.routine.exercises'],
        order: { id: 'DESC' },
    });
    return likes.map(l => l.post);
};

export const getSavedPostsByUser = async (userId: number): Promise<Post[]> => {
    const saved = await AppDataSource.getRepository(PostSaved).find({
        where: { user: { id: userId } },
        relations: ['post', 'post.author', 'post.routine','post.routine.owner', 'post.routine.exercises'],
        order: { id: 'DESC' },
    });
    return saved.map(s => s.post);
};

export const getLikesCount = async (postId: number): Promise<number> => {
    return await AppDataSource.getRepository(PostLike).count({
        where: { post: { id: postId } },
    });
};

export const getSavesCount = async (postId: number): Promise<number> => {
    return await AppDataSource.getRepository(PostSaved).count({
        where: { post: { id: postId } },
    });
};