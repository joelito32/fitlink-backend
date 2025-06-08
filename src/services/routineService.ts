import { AppDataSource } from '../data-source';
import { Routine } from '../entities/Routine';
import { ExerciseLog } from '../entities/ExerciseLog';
import { fetchExerciseById } from './exerciseService';

export const validateAndBuildExercises = async (
    exercises: any[]
): Promise<ExerciseLog[] | null> => {
    const validated: ExerciseLog[] = [];

    for (const e of exercises) {
        const { exerciseId, sets, reps } = e;
        if (!exerciseId || sets <= 0 || reps <= 0) return null;

        const apiExercise = await fetchExerciseById(exerciseId);
        if (!apiExercise || !apiExercise.name) return null;

        const log = new ExerciseLog();
        log.exerciseId = exerciseId;
        log.name = apiExercise.name;
        log.sets = sets;
        log.reps = reps;

        validated.push(log);
    }

    return validated;
};

export const createRoutineForUser = async (
    userId: number,
    title: string,
    description: string,
    exercises: ExerciseLog[]
): Promise<Routine> => {
    const repo = AppDataSource.getRepository(Routine);
    const routine = repo.create({
        title,
        description,
        owner: { id: userId },
        exercises,
    });

    return await repo.save(routine);
};

export const getUserRoutines = async (userId: number): Promise<Routine[]> => {
    return await AppDataSource.getRepository(Routine).find({
        where: { owner: { id: userId } },
        relations: ['exercises'],
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
    exercises: ExerciseLog[]
): Promise<Routine> => {
    routine.title = title.trim();
    routine.description = description?.trim() || '';
    routine.exercises = exercises;
    return await AppDataSource.getRepository(Routine).save(routine);
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
