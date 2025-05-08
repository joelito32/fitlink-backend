import { AppDataSource } from "../data-source";
import { TrainingLog } from "../entities/TrainingLog";
import { ExercisePerformance } from "../entities/ExercisePerformance";
import { User } from "../entities/User";
import { Routine } from "../entities/Routine";

export const findRoutineByIdWithOwner = async (routineId: number): Promise<Routine | null> => {
    return await AppDataSource.getRepository(Routine).findOne({
        where: { id: routineId },
        relations: ['owner'],
    });
};

export const findUserById = async (userId: number): Promise<User | null> => {
    return await AppDataSource.getRepository(User).findOneBy({ id: userId });
};

export const validateExercises = (
    exercises: any[]
): { performances: ExercisePerformance[]; totalWeight: number } | null => {
    let totalWeight = 0;
    const performances: ExercisePerformance[] = [];

    for (const e of exercises) {
        const { exerciseId, name, reps, weights, isBodyweight } = e;

        if (!exerciseId || !name || !Array.isArray(reps) || !Array.isArray(weights)) return null;
        if (reps.length !== weights.length) return null;

        const perf = new ExercisePerformance();
        perf.exerciseId = exerciseId;
        perf.name = name;
        perf.reps = reps;
        perf.weights = weights;
        perf.isBodyweight = !!isBodyweight;

        for (let i = 0; i < reps.length; i++) {
            const rep = reps[i];
            const weight = weights[i];
            if (typeof rep !== 'number' || rep <= 0 || typeof weight !== 'number' || weight < 0) return null;
            if (!isBodyweight) totalWeight += rep * weight;
        }

        performances.push(perf);
    }

    return { performances, totalWeight };
};

export const calculateCaloriesBurned = (
    weight: number | null,
    duration: number
): number | undefined => {
    if (!weight) return undefined;
    const minutes = duration / 60;
    const MET = 6;
    return 0.0175 * MET * weight * minutes;
};

export const createTrainingLogForUser = async (
    userId: number,
    routine: Routine,
    startedAt: Date,
    endedAt: Date,
    duration: number,
    totalWeight: number,
    caloriesBurned: number | undefined,
    performances: ExercisePerformance[]
): Promise<TrainingLog> => {
    const repo = AppDataSource.getRepository(TrainingLog);
    const log = repo.create({
        user: { id: userId },
        routine,
        startedAt,
        endedAt,
        duration,
        totalWeight,
        caloriesBurned,
        performances,
    });
    return await repo.save(log);
};

export const getTrainingLogsByUser = async (userId: number): Promise<TrainingLog[]> => {
    return await AppDataSource.getRepository(TrainingLog).find({
        where: { user: { id: userId } },
        relations: ['performances', 'routine'],
        order: { startedAt: 'DESC' },
    });
};

export const getTrainingLogWithRelations = async (
    logId: number
): Promise<TrainingLog | null> => {
    return await AppDataSource.getRepository(TrainingLog).findOne({
        where: { id: logId },
        relations: ['user', 'routine', 'performances'],
    });
};
