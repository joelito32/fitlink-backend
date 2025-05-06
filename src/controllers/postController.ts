import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { AuthRequest } from "../middlewares/authMiddleware";
import { Post } from "../entities/Post";
import { Routine } from "../entities/Routine";
import { detectMentions } from "../services/mentionService";

export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ message: 'No autorizado' });
            return;
        }

        const { content, routineId } = req.body;
        if (!content || typeof content !== 'string') {
            res.status(400).json({ message: 'Contenido del post requerido' });
            return;
        }

        const postRepo = AppDataSource.getRepository(Post);
        const routineRepo = AppDataSource.getRepository(Routine);

        let routine = undefined;
        if (routineId) {
            routine = await routineRepo.findOneBy({ id: routineId });
            if (!routine) {
                res.status(404).json({ message: 'Rutina no encontrada' });
                return;
            }
        }

        const newPost = postRepo.create({
            content,
            author: { id: userId },
            routine,
        });

        await postRepo.save(newPost);

        await detectMentions(content, userId, true, newPost.id);

        res.status(201).json({ message: 'Post creado correctamente', post: newPost });
    } catch (error) {
        console.error('Error al crear post:', error);
        res.status(500).json({ message: 'Error al crear el post' });
    }
};

export const deletePost = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const postId = parseInt(req.params.id);

        const postRepo = AppDataSource.getRepository(Post);
        const post = await postRepo.findOne({
            where: { id: postId },
            relations: ['author'],
        });

        if (!post || post.author.id !== userId) {
            res.status(403).json({ message: 'No tienes permiso para borrar este post' });
            return;
        }

        await postRepo.remove(post);
        res.status(200).json({ message: 'Post borrado correctamente' });
    } catch (error) {
        console.error('Error al borrar post:', error);
        res.status(500).json({ message: 'Error al borrar el post' });
    }
};

export const getUserPosts = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = parseInt(req.params.userId);
        const postRepo = AppDataSource.getRepository(Post);

        const posts = await postRepo.find({
            where: { author: { id: userId } },
            order: { createdAt: 'DESC' },
            relations: ['author', 'routine'],
        });

        res.status(200).json(posts);
    } catch (error) {
        console.error('Error al obtener posts del usuario:', error);
        res.status(500).json({ message: 'Error interno al obtener posts' });
    }
};

export const getAllPosts = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;

        const raw = await AppDataSource
            .getRepository(Post)
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.author', 'author')
            .leftJoinAndSelect('post.routine', 'routine')
            .where(qb => {
                const subquery = qb
                    .subQuery()
                    .select('follow.followingId')
                    .from('follower', 'follow')
                    .where('follow.followerId = :userId')
                    .getQuery();
                return 'post.authorId IN ' + subquery;
            })
            .setParameter('userId', userId)
            .orderBy('post.createdAt', 'DESC')
            .getMany();

        res.status(200).json(raw);
    } catch (error) {
        console.error('Error al obtener el feed de posts:', error);
        res.status(500).json({ message: 'Error interno al cargar el feed' });
    }
};

export const getPostById = async (req: Request, res: Response): Promise<void> => {
    try {
        const postId = parseInt(req.params.id);
        const postRepo = AppDataSource.getRepository(Post);

        const post = await postRepo.findOne({
            where: { id: postId },
            relations: ['author', 'routine'],
        });

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