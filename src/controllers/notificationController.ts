import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import {
    getUserNotifications,
    markUserNotificationsAsRead
} from '../services/notificationService';

export const getNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ message: 'No autorizado' });
            return;
        }

        const notifications = await getUserNotifications(userId);
        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error al obtener notificaciones:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};

export const markAllAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ message: 'No autorizado' });
            return;
        }

        await markUserNotificationsAsRead(userId);
        res.status(200).json({ message: 'Notificaciones marcadas como leídas' });
    } catch (error) {
        console.error('Error al marcar como leídas:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};
