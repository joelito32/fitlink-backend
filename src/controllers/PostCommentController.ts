import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import {
    findPostById,
    findParentComment,
    createNewComment,
    hasUserLikedComment,
    likeAComment,
    unlikeAComment,
    deleteCommentIfOwner,
    getPostComments,
    getCommentReplies,
    countPostComments,
    countCommentLikes,
    findCommentById,
    countCommentReplies
} from '../services/postCommentService';
import { createNotification } from '../services/notificationService';

export const createComment = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ message: 'No autorizado' });
            return;
        }

        const { postId, content, parentId } = req.body;

        const postIdNum = parseInt(postId, 10);
        if (!postIdNum || isNaN(postIdNum)) {
            res.status(400).json({ message: 'ID de post inválido' });
            return;
        }

        if (!content || typeof content !== 'string' || !content.trim()) {
            res.status(400).json({ message: 'El contenido del comentario no puede estar vacío' });
            return;
        }

        if (content.length > 300) {
            res.status(400).json({ message: 'El comentario no puede tener más de 300 caracteres' });
            return;
        }

        const post = await findPostById(postIdNum);
            if (!post) {
            res.status(404).json({ message: 'Post no encontrado' });
            return;
        }

        let parentComment;
        if (parentId != null) {
            const parentNum = Number(parentId);
            if (!Number.isInteger(parentNum)) {
                res.status(400).json({ message: 'ID de comentario padre inválido' });
                return;
            }
            parentComment = await findParentComment(parentNum);
            if (!parentComment) {
                res.status(404).json({ message: 'Comentario padre no encontrado' });
                return;
            }
            if (parentComment.parent) {
                res.status(400).json({ message: 'Solo se permite un nivel de respuesta' });
                return;
            }
        }

        if (parentComment) {
            if (parentComment.author.id !== userId) {
                await createNotification(
                    parentComment.author.id,
                    userId,
                    'ha respondido a tu comentario'
                );
            }
        } else if (post.author.id !== userId) {
            await createNotification(
                post.author.id,
                userId,
                'ha comentado tu post'
            );
        }

        const newComment = await createNewComment(
            userId,
            post,
            content,
            parentComment?.id
        );

        const savedComment = await findCommentById(newComment.id);

        res.status(201).json({
            message: 'Comentario creado',
            comment: savedComment
        });

    } catch (error) {
        console.error('Error al crear comentario:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};

export const deleteComment = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ message: 'No autorizado' });
            return;
        }

        const commentId = parseInt(req.params.commentId);
        const success = await deleteCommentIfOwner(userId, commentId);

        if (!success) {
            res.status(403).json({ message: 'No autorizado para eliminar este comentario' });
            return;
        }

        res.status(200).json({ message: 'Comentario eliminado' });
    } catch (error) {
        console.error('Error al eliminar comentario:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};

export const likeComment = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ message: 'No autorizado' });
            return;
        }

        const commentId = parseInt(req.params.commentId);
        const alreadyLiked = await hasUserLikedComment(userId, commentId);

        if (alreadyLiked) {
            res.status(400).json({ message: 'Ya diste like a este comentario' });
            return;
        }

        await likeAComment(userId, commentId);
        res.status(201).json({ message: 'Like al comentario registrado' });
    } catch (error) {
        console.error('Error al dar like al comentario:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};

export const unlikeComment = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ message: 'No autorizado' });
            return;
        }

        const commentId = parseInt(req.params.commentId);
        const alreadyLiked = await hasUserLikedComment(userId, commentId);

        if (!alreadyLiked) {
            res.status(400).json({ message: 'No habías dado like a este comentario' });
            return;
        }

        await unlikeAComment(userId, commentId);
        res.status(200).json({ message: 'Like al comentario eliminado' });
    } catch (error) {
        console.error('Error al quitar like al comentario:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};

export const checkCommentLike = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ message: 'No autorizado' });
        return;
        }

        const commentId = parseInt(req.params.commentId);
        const liked = await hasUserLikedComment(userId, commentId);

        res.status(200).json({ liked });
    } catch (error) {
        console.error('Error al comprobar like de comentario:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};

export const getCommentsByPostId = async (req: Request, res: Response): Promise<void> => {
    try {
        const postId = parseInt(req.params.postId);
        const comments = await getPostComments(postId);

        res.status(200).json(comments);
    } catch (error) {
        console.error('Error al obtener comentarios del post:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};

export const getRepliesForComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const commentId = parseInt(req.params.commentId);
        const replies = await getCommentReplies(commentId);

        res.status(200).json(replies);
    } catch (error) {
        console.error('Error al obtener respuestas del comentario:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};

export const getCommentCountForPost = async (req: Request, res: Response): Promise<void> => {
    try {
        const postId = parseInt(req.params.postId);
        const count = await countPostComments(postId);

        res.status(200).json({ count });
    } catch (error) {
        console.error('Error al contar comentarios:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};

export const getLikesCountForComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const commentId = parseInt(req.params.commentId);
        const count = await countCommentLikes(commentId);

        res.status(200).json({ count });
    } catch (error) {
        console.error('Error al contar likes del comentario:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};

export const getRepliesCountForComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const commentId = parseInt(req.params.commentId, 10);
        if (isNaN(commentId)) {
            res.status(400).json({ message: 'ID de comentario inválido' });
            return;
        }
        const count = await countCommentReplies(commentId);
        res.status(200).json({ count });
    } catch (error) {
        console.error('Error al contar respuestas del comentario:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};