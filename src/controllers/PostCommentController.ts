import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { AuthRequest } from '../middlewares/authMiddleware';
import { Post } from '../entities/Post';
import { PostComment } from '../entities/PostComment';
import { PostCommentLike } from '../entities/PostCommentLike';
import { detectMentions } from '../services/mentionService';
import { IsNull } from 'typeorm';

export const createComment = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ message: 'No autorizado' });
            return;
        }

        const { postId, content, parentId } = req.body;

        if (!content || typeof content !== 'string') {
            res.status(400).json({ message: 'Contenido del comentario requerido' });
            return;
        }

        const postRepo = AppDataSource.getRepository(Post);
        const post = await postRepo.findOneBy({ id: postId });
        if (!post) {
            res.status(404).json({ message: 'Post no encontrado' });
            return;
        }

        const commentRepo = AppDataSource.getRepository(PostComment);
        const comment = commentRepo.create({
            content,
            author: { id: userId },
            post,
            parent: parentId ? { id: parentId } : undefined,
        });

        await commentRepo.save(comment);
        await detectMentions(content, userId, false, undefined, comment.id);

        res.status(201).json({ message: 'Comentario creado', comment });
    } catch (error) {
        console.error('Error al crear comentario:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};

export const deleteComment = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const commentId = parseInt(req.params.commentId);

        const repo = AppDataSource.getRepository(PostComment);
        const comment = await repo.findOne({
            where: { id: commentId },
            relations: ['author'],
        });

        if (!comment || comment.author.id !== userId) {
            res.status(403).json({ message: 'No autorizado para eliminar este comentario' });
            return;
        }

        await repo.remove(comment);
        res.status(200).json({ message: 'Comentario eliminado' });
    } catch (error) {
        console.error('Error al eliminar comentario:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};

export const likeComment = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const commentId = parseInt(req.params.commentId);

        const repo = AppDataSource.getRepository(PostCommentLike);
        const existing = await repo.findOne({
            where: { user: { id: userId }, comment: { id: commentId } },
        });

        if (existing) {
            res.status(400).json({ message: 'Ya diste like a este comentario' });
            return;
        }

        const like = repo.create({
            user: { id: userId },
            comment: { id: commentId },
        });

        await repo.save(like);
        res.status(201).json({ message: 'Like al comentario registrado' });
    } catch (error) {
        console.error('Error al dar like al comentario:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};

export const unlikeComment = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const commentId = parseInt(req.params.commentId);

        const repo = AppDataSource.getRepository(PostCommentLike);
        const like = await repo.findOne({
            where: { user: { id: userId }, comment: { id: commentId } },
        });

        if (!like) {
            res.status(400).json({ message: 'No habías dado like a este comentario' });
            return;
        }

        await repo.remove(like);
        res.status(200).json({ message: 'Like al comentario eliminado' });
    } catch (error) {
        console.error('Error al quitar like al comentario:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};

export const checkCommentLike = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const commentId = parseInt(req.params.commentId);

        const like = await AppDataSource.getRepository(PostCommentLike).findOne({
            where: { user: { id: userId }, comment: { id: commentId } },
        });

        res.status(200).json({ liked: !!like });
    } catch (error) {
        console.error('Error al comprobar like de comentario:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};

export const getCommentsByPostId = async (req: Request, res: Response): Promise<void> => {
    try {
        const postId = parseInt(req.params.postId);
        const repo = AppDataSource.getRepository(PostComment);

        const comments = await repo.find({
            where: { post: { id: postId }, parent: IsNull() },
            relations: ['author'],
            order: { createdAt: 'ASC' },
        });

        res.status(200).json(comments);
    } catch (error) {
        console.error('Error al obtener comentarios del post:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};

export const getRepliesForComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const commentId = parseInt(req.params.commentId);
        const repo = AppDataSource.getRepository(PostComment);

        const replies = await repo.find({
            where: { parent: { id: commentId } },
            relations: ['author'],
            order: { createdAt: 'ASC' },
        });

        res.status(200).json(replies);
    } catch (error) {
        console.error('Error al obtener respuestas del comentario:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};

export const getCommentCountForPost = async (req: Request, res: Response): Promise<void> => {
    try {
        const postId = parseInt(req.params.postId);
        const repo = AppDataSource.getRepository(PostComment);
        const count = await repo.count({
            where: { post: { id: postId }, parent: IsNull() },
        });

        res.status(200).json({ count });
    } catch (error) {
        console.error('Error al contar comentarios:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};

export const getLikesCountForComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const commentId = parseInt(req.params.commentId);
        const repo = AppDataSource.getRepository(PostCommentLike);
        const count = await repo.count({
        where: { comment: { id: commentId } },
        });

        res.status(200).json({ count });
    } catch (error) {
        console.error('Error al contar likes del comentario:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};
