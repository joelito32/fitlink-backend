import { Response } from 'express';
import { AppDataSource } from '../data-source';
import { AuthRequest } from '../middlewares/authMiddleware';
import { Notification } from '../entities/Notification';

export const getNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;

        const notifications = await AppDataSource.getRepository(Notification).find({
            where: { recipient: { id: userId } },
            relations: ['sender'],
            order: { createdAt: 'DESC' },
        });

        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error al obtener notificaciones:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};

export const markAllAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;

        await AppDataSource.getRepository(Notification)
        .createQueryBuilder()
        .update()
        .set({ read: true })
        .where('recipientId = :userId', { userId })
        .execute();

        res.status(200).json({ message: 'Notificaciones marcadas como leídas' });
    } catch (error) {
        console.error('Error al marcar como leídas:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};
