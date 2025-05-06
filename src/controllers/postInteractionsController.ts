import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { AuthRequest } from '../middlewares/authMiddleware';
import { Post } from '../entities/Post';
import { PostLike } from '../entities/PostLike';
import { PostSaved } from '../entities/PostSaved';
import { User } from '../entities/User';
import { createNotification } from '../services/notificationService';

export const likePost = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ message: 'No autorizado' });
            return;
        }

        const postId = parseInt(req.params.postId);

        const post = await AppDataSource.getRepository(Post).findOne({ 
            where: { id: postId },
            relations: ['author'], 
        });

        if (!post) {
            res.status(404).json({ message: 'Post no encontrado' });
            return;
        }

        const likeRepo = AppDataSource.getRepository(PostLike);
        const existing = await likeRepo.findOne({
            where: { user: { id: userId }, post: { id: postId } },
        });

        if (existing) {
            res.status(400).json({ message: 'Ya has dado like a este post' });
            return;
        }

        const like = likeRepo.create({ user: { id: userId }, post });
        await likeRepo.save(like);

        if (post.author.id !== userId) {
            await createNotification(post.author.id, userId, 'le ha dado like a tu post');
        }

        res.status(201).json({ message: 'Like registrado' });
    } catch (error) {
        console.error('Error al dar like:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};

export const unlikePost = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const postId = parseInt(req.params.postId);

        const likeRepo = AppDataSource.getRepository(PostLike);
        const existing = await likeRepo.findOne({
            where: { user: { id: userId }, post: { id: postId } },
        });

        if (!existing) {
            res.status(400).json({ message: 'No has dado like a este post' });
            return;
        }

        await likeRepo.remove(existing);
        res.status(200).json({ message: 'Like eliminado' });
    } catch (error) {
        console.error('Error al quitar like:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};

export const checkPostLiked = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const postId = parseInt(req.params.postId);

        const like = await AppDataSource.getRepository(PostLike).findOne({
            where: { user: { id: userId }, post: { id: postId } },
        });

        res.status(200).json({ liked: !!like });
    } catch (error) {
        console.error('Error al comprobar like:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};

export const savePost = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ message: 'No autorizado' });
            return;
        }

        const postId = parseInt(req.params.postId);
        
        const post = await AppDataSource.getRepository(Post).findOne({ 
            where: { id: postId },
            relations: ['author'], 
        });
        
        if (!post) {
            res.status(404).json({ message: 'Post no encontrado' });
            return;
        }

        const repo = AppDataSource.getRepository(PostSaved);
        const existing = await repo.findOne({
            where: { user: { id: userId }, post: { id: postId } },
        });

        if (existing) {
            res.status(400).json({ message: 'Ya has guardado este post' });
            return;
        }

        const saved = repo.create({ user: { id: userId }, post });
        await repo.save(saved);

        if (post.author.id !== userId) {
            await createNotification(post.author.id, userId, 'ha guardado tu post');
        }

        res.status(201).json({ message: 'Post guardado' });
    } catch (error) {
        console.error('Error al guardar post:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};

export const unsavePost = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const postId = parseInt(req.params.postId);

        const repo = AppDataSource.getRepository(PostSaved);
        const existing = await repo.findOne({
            where: { user: { id: userId }, post: { id: postId } },
        });

        if (!existing) {
        res.status(400).json({ message: 'No has guardado este post' });
        return;
        }

        await repo.remove(existing);
        res.status(200).json({ message: 'Guardado eliminado' });
    } catch (error) {
        console.error('Error al quitar guardado:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};

export const checkPostSaved = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const postId = parseInt(req.params.postId);

        const saved = await AppDataSource.getRepository(PostSaved).findOne({
        where: { user: { id: userId }, post: { id: postId } },
        });

        res.status(200).json({ saved: !!saved });
    } catch (error) {
        console.error('Error al comprobar guardado:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};

export const getLikedPosts = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;

        const likes = await AppDataSource.getRepository(PostLike).find({
            where: { user: { id: userId } },
            relations: ['post', 'post.author', 'post.routine'],
            order: { id: 'DESC' },
        });

        const posts = likes.map(l => l.post);
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error al obtener posts con like:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};

export const getSavedPosts = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;

        const saved = await AppDataSource.getRepository(PostSaved).find({
            where: { user: { id: userId } },
            relations: ['post', 'post.author', 'post.routine'],
            order: { id: 'DESC' },
        });

        const posts = saved.map(s => s.post);
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error al obtener posts guardados:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};

export const getLikesCountForPost = async (req: Request, res: Response): Promise<void> => {
    try {
        const postId = parseInt(req.params.postId);
        const count = await AppDataSource.getRepository(PostLike).count({
            where: { post: { id: postId } },
        });

        res.status(200).json({ likes: count });
    } catch (error) {
        console.error('Error al contar likes:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};

export const getSavesCountForPost = async (req: Request, res: Response): Promise<void> => {
    try {
        const postId = parseInt(req.params.postId);
        const count = await AppDataSource.getRepository(PostSaved).count({
            where: { post: { id: postId } },
        });

        res.status(200).json({ saves: count });
    } catch (error) {
        console.error('Error al contar guardados:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};
