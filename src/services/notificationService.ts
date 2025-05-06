import { AppDataSource } from "../data-source";
import { Notification } from "../entities/Notification";

export const createNotification = async (
    recipientId: number,
    senderId: number,
    message: string,
): Promise<void> => {
    if (recipientId === senderId) return;

    try {
        const notificationRepo = AppDataSource.getRepository(Notification);
        const notification = notificationRepo.create({
            recipient: { id: recipientId },
            sender: { id: senderId },
            message,
        });

        await notificationRepo.save(notification);
    } catch (error) {
        console.error('Error al crear notificación:', error);
    }
};