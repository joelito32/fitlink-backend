import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Follower } from "../entities/Follower";
import { User } from "../entities/User";
import { AuthRequest } from "../middlewares/authMiddleware";

export const followUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const targetId = parseInt(req.params.id);

        if (userId === targetId) {
            res.status(400).json({ message: 'No puedes seguirte a ti mismo' });
            return;
        }

        const userRepo = AppDataSource.getRepository(User);
        const followerRepo = AppDataSource.getRepository(Follower);

        const targetUser = await userRepo.findOneBy({ id: targetId });
        if (!targetUser) {
            res.status(404).json({ message: 'Usuario a seguir no encontrado' });
            return;
        }

        const existingFollow = await followerRepo.findOne({
            where: { follower: { id: userId }, following: { id: targetId } },
        });

        if (existingFollow) {
            res.status(400).json({ message: 'Ya sigues a este usuario' });
            return;
        }

        const newFollow = followerRepo.create({
            follower: { id: userId },
            following: { id: targetId },
        });

        await followerRepo.save(newFollow);
        res.status(201).json({ message: 'Ahora sigues a este usuario' });
    } catch (error) {
        console.error('Error en followUser:', error);
        res.status(500).json({ message: 'Error al seguir usuario' });
    }
};

export const unfollowUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const targetId = parseInt(req.params.id);

        const followerRepo = AppDataSource.getRepository(Follower);

        const existingFollow = await followerRepo.findOne({
            where: { follower: { id: userId }, following: { id: targetId } },
        });

        if (!existingFollow) {
            res.status(400).json({ message: 'No estás siguiendo a este usuario' });
            return;
        }

        await followerRepo.remove(existingFollow);
        res.status(200).json({ message: 'Has dejado de seguir al usuario' });
    } catch (error) {
        console.error('Error en unfollowUser:', error);
        res.status(500).json({ message: 'Error al dejar de seguir usuario' });
    }
};

export const getFollowers = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const repo = AppDataSource.getRepository(Follower);

        const followers = await repo.find({
            where: { following: { id: userId } },
            relations: ['follower'],
        });

        const result = followers.map((f) => f.follower);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error en getFollowers:', error);
        res.status(500).json({ message: 'Error al obtener seguidores' });
    }
};

export const getFollowing = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const repo = AppDataSource.getRepository(Follower);

        const following = await repo.find({
            where: { follower: { id: userId } },
            relations: ['following'],
        });

        const result = following.map((f) => f.following);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error en getFollowing:', error);
        res.status(500).json({ message: 'Error al obtener seguidos' });
    }
};

export const getFollowersCount = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const repo = AppDataSource.getRepository(Follower);

        const count = await repo.count({
            where: { following: { id: userId } },
        });

        res.status(200).json({ followers: count });
    } catch (error) {
        console.error('Error en getFollowersCount:', error);
        res.status(500).json({ message: 'Error al contar seguidores' });
    }
};

export const getFollowingCount = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const repo = AppDataSource.getRepository(Follower);

        const count = await repo.count({
            where: { follower: { id: userId } },
        });

        res.status(200).json({ following: count });
    } catch (error) {
        console.error('Error en getFollowingCount:', error);
        res.status(500).json({ message: 'Error al contar seguidos' });
    }
};