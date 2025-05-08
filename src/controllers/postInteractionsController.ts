import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { 
    isPostExists,
    hasUserLikedPost,
    likePostByUser,
    unlikePostByUser,
    hasUserSavedPost,
    savePostByUser,
    unsavePostByUser,
    getLikedPostsByUser,
    getSavedPostsByUser,
    getLikesCount,
    getSavesCount,
} from '../services/postInteractionService';
import { createNotification } from '../services/notificationService';

export const likePost = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const postId = parseInt(req.params.postId);

        if (!userId) {
            res.status(401).json({ message: 'No autorizado' });
            return;
        }

        if (isNaN(postId)) {
            res.status(400).json({ message: 'ID de post inválido' });
            return;
        }

        const post = await isPostExists(postId);
        if (!post) {
            res.status(404).json({ message: 'Post no encontrado' });
            return;
        }

        const alreadyLiked = await hasUserLikedPost(userId, postId);
        if (alreadyLiked) {
            res.status(400).json({ message: 'Ya has dado like a este post' });
            return;
        }

        await likePostByUser(userId, post);

        if (post.author.id !== userId) {
            await createNotification(post.author.id, userId, 'le ha dado like a tu post');
        }

        res.status(201).json({ message: 'Like registrado' });
    } catch (error) {
        console.error('Error en likePost:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};

export const unlikePost = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const postId = parseInt(req.params.postId);

        if (!userId) {
            res.status(401).json({ message: 'No autorizado' });
            return;
        }
        
        if (isNaN(postId)) {
            res.status(400).json({ message: 'ID de post inválido' });
            return;
        }

        const removed = await unlikePostByUser(userId, postId);
        if (!removed) {
            res.status(400).json({ message: 'No has dado like a este post' });
            return;
        }

        res.status(200).json({ message: 'Like eliminado' });
    } catch (error) {
        console.error('Error en unlikePost:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};

export const checkPostLiked = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const postId = parseInt(req.params.postId);

        if (!userId) {
            res.status(401).json({ message: 'No autorizado' });
            return;
        }

        if (isNaN(postId)) {
            res.status(400).json({ message: 'ID de post inválido' });
            return;
        }

        const liked = await hasUserLikedPost(userId, postId);
        res.status(200).json({ liked });
    } catch (error) {
        console.error('Error en checkPostLiked:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};

export const savePost = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const postId = parseInt(req.params.postId);

        if (!userId) {
            res.status(401).json({ message: 'No autorizado' });
            return;
        }

        if (isNaN(postId)) {
            res.status(400).json({ message: 'ID de post inválido' });
            return;
        }

        const post = await isPostExists(postId);
        if (!post) {
            res.status(404).json({ message: 'Post no encontrado' });
            return;
        }

        const alreadySaved = await hasUserSavedPost(userId, postId);
        if (alreadySaved) {
            res.status(400).json({ message: 'Ya has guardado este post' });
            return;
        }

        await savePostByUser(userId, post);

        if (post.author.id !== userId) {
            await createNotification(post.author.id, userId, 'ha guardado tu post');
        }

        res.status(201).json({ message: 'Post guardado' });
    } catch (error) {
        console.error('Error en savePost:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};

export const unsavePost = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const postId = parseInt(req.params.postId);

        if (!userId) {
            res.status(401).json({ message: 'No autorizado' });
            return;
        }

        if (isNaN(postId)) {
            res.status(400).json({ message: 'ID de post inválido' });
            return;
        }

        const removed = await unsavePostByUser(userId, postId);
        if (!removed) {
            res.status(400).json({ message: 'No has guardado este post' });
            return;
        }

        res.status(200).json({ message: 'Guardado eliminado' });
    } catch (error) {
        console.error('Error en unsavePost:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};

export const checkPostSaved = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const postId = parseInt(req.params.postId);

        if (!userId) {
            res.status(401).json({ message: 'No autorizado' });
            return;
        }

        if (isNaN(postId)) {
            res.status(400).json({ message: 'ID de post inválido' });
            return;
        }

        const saved = await hasUserSavedPost(userId, postId);
        res.status(200).json({ saved });
    } catch (error) {
        console.error('Error en checkPostSaved:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};

export const getLikedPosts = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ message: 'No autorizado' });
            return;
        }

        const posts = await getLikedPostsByUser(userId);
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error en getLikedPosts:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};

export const getSavedPosts = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ message: 'No autorizado' });
            return;
        }
        
        const posts = await getSavedPostsByUser(userId);
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error en getSavedPosts:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};

export const getLikesCountForPost = async (req: Request, res: Response): Promise<void> => {
    try {
        const postId = parseInt(req.params.postId);
        if (isNaN(postId)) {
            res.status(400).json({ message: 'ID de post inválido' });
            return;
        }

        const likes = await getLikesCount(postId);
        res.status(200).json({ likes });
    } catch (error) {
        console.error('Error en getLikesCountForPost:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};

export const getSavesCountForPost = async (req: Request, res: Response): Promise<void> => {
    try {
        const postId = parseInt(req.params.postId);
        if (isNaN(postId)) {
            res.status(400).json({ message: 'ID de post inválido' });
            return;
        }

        const saves = await getSavesCount(postId);
        res.status(200).json({ saves });
    } catch (error) {
        console.error('Error en getSavesCountForPost:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};