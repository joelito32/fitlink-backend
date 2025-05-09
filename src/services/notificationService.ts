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

export const getUserNotifications = async (userId: number): Promise<Notification[]> => {
    return await AppDataSource.getRepository(Notification).find({
        where: { recipient: { id: userId } },
        relations: ['sender'],
        order: { createdAt: 'DESC' },
    });
};

export const markUserNotificationsAsRead = async (userId: number): Promise<void> => {
    await AppDataSource.getRepository(Notification)
        .createQueryBuilder()
        .update()
        .set({ read: true })
        .where('recipientId = :userId', { userId })
        .execute();
};
