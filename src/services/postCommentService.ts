import { AppDataSource } from "../data-source";
import { Post } from "../entities/Post";
import { PostComment } from "../entities/PostComment";
import { PostCommentLike } from "../entities/PostCommentLike";
import { createNotification } from "./notificationService";
import { IsNull } from "typeorm";

export const findPostById = async (postId: number): Promise<Post | null> => {
    return await AppDataSource
        .getRepository(Post)
        .findOne({ 
            where: {id: postId },
            relations: ['author'], 
        });
};

export const findParentComment = async (parentId: number): Promise<PostComment | null> => {
    return await AppDataSource.getRepository(PostComment).findOne({
        where: { id: parentId },
        relations: ['author', 'parent'],
    });
};

export const createNewComment = async (
    userId: number,
    post: Post,
    content: string,
    parentId?: number
): Promise<PostComment> => {
    const repo = AppDataSource.getRepository(PostComment);
    const comment = repo.create({
        content,
        author: { id: userId },
        post,
        parent: parentId ? { id: parentId } : undefined,
    });
    return await repo.save(comment);
};

export const findCommentById = async (commentId: number): Promise<PostComment | null> => {
    return await AppDataSource.getRepository(PostComment).findOne({
        where: { id: commentId },
        relations: ['author', 'parent'],
    });
};

export const hasUserLikedComment = async (userId: number, commentId: number): Promise<boolean> => {
    const repo = AppDataSource.getRepository(PostCommentLike);
    const like = await repo.findOne({
        where: { user: { id: userId }, comment: { id: commentId } },
    });
    return !!like;
};

export const likeAComment = async (userId: number, commentId: number): Promise<void> => {
    const repo = AppDataSource.getRepository(PostCommentLike);
    const like = repo.create({
        user: { id: userId },
        comment: { id: commentId },
    });
    await repo.save(like);

    const comment = await findCommentById(commentId);
    if (comment && comment.author.id !== userId) {
        await createNotification(comment.author.id, userId, 'le ha dado like a tu comentario');
    }
};

export const unlikeAComment = async (userId: number, commentId: number): Promise<void> => {
    const repo = AppDataSource.getRepository(PostCommentLike);
    const like = await repo.findOne({
        where: { user: { id: userId }, comment: { id: commentId } },
    });
    if (like) await repo.remove(like);
};

export const deleteCommentIfOwner = async (userId: number, commentId: number): Promise<boolean> => {
    const repo = AppDataSource.getRepository(PostComment);
    const comment = await repo.findOne({
        where: { id: commentId },
        relations: ['author'],
    });
    if (!comment || comment.author.id !== userId) return false;

    await repo.remove(comment);
    return true;
};

export const getPostComments = async (postId: number): Promise<PostComment[]> => {
    return await AppDataSource.getRepository(PostComment).find({
        where: { post: { id: postId }, parent: IsNull() },
        relations: ['author'],
        order: { createdAt: 'ASC' },
    });
};

export const getCommentReplies = async (commentId: number): Promise<PostComment[]> => {
    return await AppDataSource.getRepository(PostComment).find({
        where: { parent: { id: commentId } },
        relations: ['author'],
        order: { createdAt: 'ASC' },
    });
};

export const countPostComments = async (postId: number): Promise<number> => {
    return await AppDataSource.getRepository(PostComment).count({
        where: { post: { id: postId }, parent: IsNull() },
    });
};

export const countCommentLikes = async (commentId: number): Promise<number> => {
    return await AppDataSource.getRepository(PostCommentLike).count({
        where: { comment: { id: commentId } },
    });
};

export const countCommentReplies = async (commentId: number): Promise<number> => {
    return await AppDataSource
        .getRepository(PostComment)
        .count({
            where: { parent: { id: commentId } }
        });
};