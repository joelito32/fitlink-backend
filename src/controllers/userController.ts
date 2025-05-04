import { Response } from "express";
import { updateUserProfile } from "../services/userService";
import { AuthRequest } from "../middlewares/authMiddleware";
import { User } from "../entities/User";
import { AppDataSource } from "../data-source";

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;

        if (!userId) {
            res.status(401).json({ message: 'No autorizado' });
            return;
        }

        const { name, birthdate, bio, profilePic } = req.body;

        const result = await updateUserProfile(userId, {
            name,
            birthdate: birthdate ? new Date(birthdate): undefined,
            bio,
            profilePic,
        });

        if (!result.success) {
            res.status(400).json({ message: result.message });
            return;
        }

        res.status(200).json({ message: result.message });
    } catch (error) {
        console.error('Error al actualizar el perfil:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ message: 'No autorizado' });
            return;
        }

        const repo = AppDataSource.getRepository(User);
        const user = await repo.findOne({
            where: { id: userId },
            select: ['id', 'email', 'username', 'name', 'birthdate', 'bio', 'profilePic', 'createdAt'],
        });

        if (!user) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return;
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

export const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = parseInt(req.params.id);

        if (isNaN(userId)) {
            res.status(400).json({ message: 'ID de usuario no válido' });
            return;
        }

        const repo = AppDataSource.getRepository(User);
        const user = await repo.findOne({
            where: { id: userId },
            select: ['id', 'username', 'name', 'birthdate', 'bio', 'profilePic', 'createdAt'],
        });

        if (!user) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return;
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error al obtener perfil público:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const deleteAccount = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ message: 'No autorizado' });
            return;
        }

        const repo = AppDataSource.getRepository(User);
        const result = await repo.delete({ id: userId });

        if (result.affected === 0) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return;
        }

        res.status(200).json({ message: 'Cuenta eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar cuenta:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};