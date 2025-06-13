import { AppDataSource } from '../data-source';
import { Routine } from '../entities/Routine';
import { fetchExerciseById } from './exerciseService';
import { Exercise } from '../entities/Exercise';

export const validateAndBuildExercises = async (
    exercises: any[]
): Promise<Exercise[] | null> => {
    const repo = AppDataSource.getRepository(Exercise);
    const validated: Exercise[] = [];

    for (const e of exercises) {
        const found = await repo.findOneBy({ id: e.id || e.exerciseId });
        if (!found) return null;
        validated.push(found);
    }

    return validated;
};

export const createRoutineForUser = async (
    userId: number,
    title: string,
    description: string,
    exercises: Exercise[],
    isPublic: boolean,
): Promise<Routine> => {
    const repo = AppDataSource.getRepository(Routine);
    const routine = repo.create({
        title,
        description,
        owner: { id: userId },
        exercises,
        isPublic,
    });
    const saved = await repo.save(routine);
    const complete = await repo.findOne({
        where: { id: saved.id },
        relations: ['owner', 'exercises']
    });
    if (!complete) throw new Error('No se pudo recuperar la rutina guardada');
    return complete;
};

export const getUserRoutines = async (userId: number): Promise<Routine[]> => {
    return await AppDataSource.getRepository(Routine).find({
        where: { owner: { id: userId } },
        relations: ['exercises', 'owner'],
        order: { createdAt: 'DESC' },
    });
};

export const findRoutineById = async (
    routineId: number
): Promise<Routine | null> => {
    return await AppDataSource.getRepository(Routine).findOne({
        where: { id: routineId },
        relations: ['owner', 'exercises'],
    });
};

export const updateRoutineData = async (
    routine: Routine,
    title: string,
    description: string,
    exercises: Exercise[],
    isPublic: boolean,
): Promise<Routine> => {
    routine.title = title.trim();
    routine.description = description?.trim() || '';
    routine.exercises = exercises;
    routine.isPublic = isPublic;
    await AppDataSource.getRepository(Routine).save(routine);
    const updated = await AppDataSource.getRepository(Routine).findOne({
        where: { id: routine.id },
        relations: ['owner', 'exercises']
    });

    if (!updated) throw new Error("No se pudo recuperar la rutina actualizada");

    return updated;
};

export const deleteRoutineById = async (routine: Routine): Promise<void> => {
    await AppDataSource.getRepository(Routine).remove(routine);
};

export const getPublicRoutinesFromFollowing = async (
    userId: number
): Promise<Routine[]> => {
    return await AppDataSource.getRepository(Routine)
        .createQueryBuilder('routine')
        .leftJoinAndSelect('routine.owner', 'owner')
        .where((qb) => {
            const sub = qb
                .subQuery()
                .select('f.followingId')
                .from('follower', 'f')
                .where('f.followerId = :userId')
                .getQuery();
            return 'routine.ownerId IN ' + sub;
        })
        .andWhere('routine.isPublic = true')
        .setParameter('userId', userId)
        .orderBy('routine.id', 'DESC')
        .getMany();
};

export const toggleRoutineVisibility = async (
    userId: number,
    routineId: number,
    isPublic: boolean
): Promise<boolean> => {
    const repo = AppDataSource.getRepository(Routine);
    const routine = await repo.findOne({
        where: { id: routineId },
        relations: ['owner'],
    });

    if (!routine || routine.owner.id !== userId) return false;

    routine.isPublic = isPublic;
    await repo.save(routine);
    return true;
};
