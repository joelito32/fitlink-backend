import { AppDataSource } from "../data-source";
import { Post } from "../entities/Post";
import { Routine } from "../entities/Routine";

export const isRoutineExists = async (routineId: number): Promise<Routine | null> => {
    return await AppDataSource.getRepository(Routine).findOneBy({ id: routineId });
};

export const createNewPost = async (
    userId: number,
    content: string,
    routine?: Routine
): Promise<Post> => {
    const postRepo = AppDataSource.getRepository(Post);
    const newPost = postRepo.create({
        content,
        author: { id: userId },
        routine,
    });
    const saved = await postRepo.save(newPost);

    const fullPost = await postRepo.findOne({
        where: { id: saved.id },
        relations: ['author', 'routine', 'routine.exercises'],
    });

    if (!fullPost) throw new Error('No se pudo recuperar el post completo');

    return fullPost;
};

export const deletePostByUser = async (userId: number, postId: number): Promise<boolean> => {
    const postRepo = AppDataSource.getRepository(Post);
    const post = await postRepo.findOne({
        where: { id: postId },
        relations: ['author'],
    });

    if (!post || post.author.id !== userId) {
        return false;
    }

    await postRepo.remove(post);
    return true;
};

export const getPostsByUserId = async (userId: number): Promise<Post[]> => {
    return await AppDataSource.getRepository(Post).find({
        where: { author: { id: userId } },
        order: { createdAt: 'DESC' },
        relations: ['author', 'routine', 'routine.exercises', 'routine.owner'],
    });
};

export const getFeedPostsByUserId = async (userId: number): Promise<Post[]> => {
    return await AppDataSource.getRepository(Post)
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.author', 'author')
        .leftJoinAndSelect('post.routine', 'routine')
        .leftJoinAndSelect('routine.owner', 'routineOwner')
        .leftJoinAndSelect('routine.exercises', 'exercises')
        .where(qb => {
            const subquery = qb
                .subQuery()
                .select('f.followingId')
                .from('follower', 'f')
                .where('f.followerId = :userId')
                .getQuery();
            return 'post.authorId IN ' + subquery;
        })
        .setParameter('userId', userId)
        .orderBy('post.createdAt', 'DESC')
        .getMany();
};

export const getPostWithAuthorAndRoutine = async (postId: number): Promise<Post | null> => {
    return await AppDataSource.getRepository(Post).findOne({
        where: { id: postId },
        relations: ['author', 'routine', 'routine.exercises'],
    });
};
