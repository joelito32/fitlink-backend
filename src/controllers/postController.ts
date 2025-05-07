import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import {
    createNewPost,
    deletePostByUser,
    getPostsByUserId,
    getFeedPostsByUserId,
    getPostWithAuthorAndRoutine,
    isRoutineExists,
} from "../services/postService";
import { detectMentions } from "../services/mentionService";

export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ message: 'No autorizado' });
            return;
        }

        const { content, routineId } = req.body;

        if (!content && !routineId) {
            res.status(400).json({ message: 'El post debe tener contenido o una rutina asociada' });
            return;
        }

        if (content && typeof content !== 'string') {
            res.status(400).json({ message: 'Contenido del post inválido' });
            return;
        }

        if (content && content.length > 500) {
            res.status(400).json({ message: 'El contenido no puede superar los 500 caracteres' });
            return;
        }

        let routine = undefined;
        if (routineId) {
            routine = await isRoutineExists(routineId);
            if (!routine) {
                res.status(404).json({ message: 'Rutina no encontrada' });
                return;
            }
        }

        const post = await createNewPost(userId, content, routine);
        await detectMentions(content, userId, true, post.id);

        res.status(201).json({ message: 'Post creado correctamente', post });
    } catch (error) {
        console.error('Error al crear post:', error);
        res.status(500).json({ message: 'Error al crear el post' });
    }
};

export const deletePost = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ message: 'No autorizado' });
            return;
        }
        const postId = parseInt(req.params.id);

        const success = await deletePostByUser(userId, postId);
        if (!success) {
            res.status(403).json({ message: 'No tienes permiso para borrar este post' });
            return;
        }

        res.status(200).json({ message: 'Post borrado correctamente' });
    } catch (error) {
        console.error('Error al borrar post:', error);
        res.status(500).json({ message: 'Error al borrar el post' });
    }
};

export const getUserPosts = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = parseInt(req.params.userId);
        const posts = await getPostsByUserId(userId);
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error al obtener posts del usuario:', error);
        res.status(500).json({ message: 'Error interno al obtener posts' });
    }
};

export const getAllPosts = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ message: 'No autorizado' });
            return;
        }
        const posts = await getFeedPostsByUserId(userId);
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error al obtener el feed de posts:', error);
        res.status(500).json({ message: 'Error interno al cargar el feed' });
    }
};

export const getPostById = async (req: Request, res: Response): Promise<void> => {
    try {
        const postId = parseInt(req.params.id);
        const post = await getPostWithAuthorAndRoutine(postId);

        if (!post) {
            res.status(404).json({ message: 'Post no encontrado' });
            return;
        }

        res.status(200).json(post);
    } catch (error) {
        console.error('Error al obtener el post:', error);
        res.status(500).json({ message: 'Error interno al obtener post' });
    }
};
