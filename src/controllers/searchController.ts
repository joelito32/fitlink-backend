import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { Post } from "../entities/Post";
import { Routine } from "../entities/Routine";

export const search = async (req: Request, res: Response): Promise<void> => {
    try {
        const { q, type } = req.query;

        if (!q || typeof q !== 'string') {
            res.status(400).json({ message: 'Falta el parámetro de búsqueda' });
            return;
        }

        const results: any = {};

        if (!type || type === 'user') {
            const userRepo = AppDataSource.getRepository(User);
            results.users = await userRepo
                .createQueryBuilder('user')
                .where('user.username ILIKE :q OR user.name ILIKE :q', { q: `%${q}%` })
                .select(['user.id', 'user.usename', 'user.name', 'user.profilePic'])
                .getMany();
        }

        if (!type || type === 'post') {
            const postRepo = AppDataSource.getRepository(Post);
            results.posts = await postRepo
                .createQueryBuilder('post')
                .leftJoinAndSelect('post.author', 'author')
                .where('post.content ILIKE :q', { q: `%${q}%` })
                .getMany();
        }

        if (!type || type === 'routine') {
            const routineRepo = AppDataSource.getRepository(Routine);
            results.routines = await routineRepo
                .createQueryBuilder('routine')
                .leftJoinAndSelect('routine.owner', 'owner')
                .where('routine.isPublic = true AND (routine.title ILIKE :q OR routine.description ILIKE :q', { q: `%${q}%` })
                .getMany();
        }

        res.status(200).json(results);
    } catch (error) {
        console.error('Error en búsqueda:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};