import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { 
    isUserExists,
    isAlreadyFollowing,
    createFollow,
    removeFollow,
    getFollowersOfUser,
    getFollowingOfUser,
    getFollowersCountByUserId,
    getFollowingCountByUserId
} from "../services/followerService";
import { createNotification } from "../services/notificationService";

export const followUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ message: 'No autorizado' });
            return;
        }
        const targetId = parseInt(req.params.id);

        if (userId === targetId) {
            res.status(400).json({ message: 'No puedes seguirte a ti mismo' });
            return;
        }

        const exists = await isUserExists(targetId);
        if (!exists) {
            res.status(404).json({ message: 'Usuario a seguir no encontrado' });
            return;
        }

        const already = await isAlreadyFollowing(userId, targetId);
        if (already) {
            res.status(400).json({ message: 'Ya sigues a este usuario' });
            return;
        }

        await createFollow(userId, targetId);
        await createNotification(targetId, userId, 'te ha empezado a seguir');

        res.status(201).json({ message: 'Ahora sigues a este usuario' });
    } catch (error) {
        console.error('Error en followUser:', error);
        res.status(500).json({ message: 'Error al seguir usuario' });
    }
};

export const unfollowUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ message: 'No autorizado' });
            return;
        }
        const targetId = parseInt(req.params.id);

        const already = await isAlreadyFollowing(userId, targetId);
        if (!already) {
            res.status(400).json({ message: 'No estás siguiendo a este usuario' });
            return;
        }

        await removeFollow(userId, targetId);
        res.status(200).json({ message: 'Has dejado de seguir al usuario' });
    } catch (error) {
        console.error('Error en unfollowUser:', error);
        res.status(500).json({ message: 'Error al dejar de seguir usuario' });
    }
};

export const getFollowers = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const targetId = parseInt(req.params.id);
        if (!targetId) {
            res.status(401).json({ message: 'No autorizado' });
            return;
        }
        const followers = await getFollowersOfUser(targetId);
        res.status(200).json(followers);
    } catch (error) {
        console.error('Error en getFollowers:', error);
        res.status(500).json({ message: 'Error al obtener seguidores' });
    }
};

export const getFollowing = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const targetId = parseInt(req.params.id);
        if (!targetId) {
            res.status(401).json({ message: 'No autorizado' });
            return;
        }
        const following = await getFollowingOfUser(targetId);
        res.status(200).json(following);
    } catch (error) {
        console.error('Error en getFollowing:', error);
        res.status(500).json({ message: 'Error al obtener seguidos' });
    }
};

export const getFollowersCount = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const targetId = parseInt(req.params.id);
        if (!targetId) {
            res.status(401).json({ message: 'No autorizado' });
            return;
        }
        const count = await getFollowersCountByUserId(targetId);
        res.status(200).json({ followers: count });
    } catch (error) {
        console.error('Error en getFollowersCount:', error);
        res.status(500).json({ message: 'Error al contar seguidores' });
    }
};

export const getFollowingCount = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const targetId = parseInt(req.params.id);
        if (!targetId) {
            res.status(401).json({ message: 'No autorizado' });
            return;
        }
        const count = await getFollowingCountByUserId(targetId);
        res.status(200).json({ following: count });
    } catch (error) {
        console.error('Error en getFollowingCount:', error);
        res.status(500).json({ message: 'Error al contar seguidos' });
    }
};

export const checkIfFollowing = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ message: 'No autorizado' });
            return;
        }

        const targetId = parseInt(req.params.id);
        const already = await isAlreadyFollowing(userId, targetId);
        res.status(200).json({ isFollowing: already });
    } catch (error) {
        console.error('Error en checkIfFollowing:', error);
        res.status(500).json({ message: 'Error al verificar seguimiento' });
    }
};