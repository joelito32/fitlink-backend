import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { Mention } from '../entities/Mention';
import { Post } from '../entities/Post';
import { PostComment } from '../entities/PostComment';

export const detectMentions = async (
    text: string,
    createdById: number,
    isPost: boolean,
    postId?: number,
    commentId?: number
): Promise<void> => {
    try {
        const mentionRepo = AppDataSource.getRepository(Mention);
        const userRepo = AppDataSource.getRepository(User);

        const usernames = [...new Set((text.match(/@(\w+)/g) || []).map(u => u.slice(1)))];
        if (usernames.length === 0) return;

        const users = await userRepo
            .createQueryBuilder('user')
            .where('user.username IN (:...usernames)', { usernames })
            .getMany();

        for (const mentionedUser of users) {
          if (mentionedUser.id === createdById) continue; // evitar auto-menciones

            const exists = await mentionRepo.findOne({
                where: {
                    mentionedUser: { id: mentionedUser.id },
                    createdBy: { id: createdById },
                    sourcePost: postId ? { id: postId } : undefined,
                    sourceComment: commentId ? { id: commentId } : undefined,
                },
            });

          if (exists) continue; // evitar menciones duplicadas

            const mention = mentionRepo.create({
                mentionedUser,
                createdBy: { id: createdById },
                sourcePost: postId ? { id: postId } : undefined,
                sourceComment: commentId ? { id: commentId } : undefined,
                type: isPost ? 'post' : 'comment',
            });

            await mentionRepo.save(mention);
        }
    } catch (error) {
        console.error('Error al detectar menciones:', error);
    }
};  
