import { AppDataSource } from '../data-source';
import { TrainingLog } from '../entities/TrainingLog';
import { WeightLog } from '../entities/WeightLog';
import { ExercisePerformance } from '../entities/ExercisePerformance';
import { fetchAllExercises } from './exerciseService';

export const getWeekNumber = (date: Date): number => {
    const firstJan = new Date(date.getFullYear(), 0, 1);
    const pastDays = Math.floor((+date - +firstJan) / (1000 * 60 * 60 * 24));
    return Math.ceil((pastDays + firstJan.getDay() + 1) / 7);
};

export const getUserTrainingLogs = async (userId: number) => {
    return await AppDataSource.getRepository(TrainingLog).find({
        where: { user: { id: userId } },
        relations: ['performances', 'routine'],
    });
};

export const getUserWeightLogs = async (userId: number) => {
    return await AppDataSource.getRepository(WeightLog).find({
        where: { user: { id: userId } },
        order: { date: 'ASC' },
    });
};

export const extractStatisticsFromLogs = async (userId: number, logs: TrainingLog[], exerciseIdFilter?: string) => {
    const performances = logs.flatMap(log =>
        log.performances.map(p => ({ ...p, date: log.startedAt }))
    );

    const sessionsPerWeek: Record<string, number> = {};
    const totalWeightPerWeek: Record<string, number> = {};
    const bestLiftPerExercise: Record<string, number> = {};
    const now = new Date();
    const thisWeek = getWeekNumber(now);
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    const daysTrained: string[] = [];
    let totalTimeWeek = 0;
    let totalTimeMonth = 0;
    let totalCaloriesWeek = 0;
    let totalCaloriesMonth = 0;

    for (const log of logs) {
        const dateStr = log.startedAt.toISOString().split('T')[0];
        daysTrained.push(dateStr);

        const week = `${log.startedAt.getFullYear()}-W${getWeekNumber(log.startedAt)}`;
            sessionsPerWeek[week] = (sessionsPerWeek[week] || 0) + 1;
        totalWeightPerWeek[week] = (totalWeightPerWeek[week] || 0) + log.totalWeight;

        const logWeek = getWeekNumber(log.startedAt);
        const logMonth = log.startedAt.getMonth();
        const logYear = log.startedAt.getFullYear();

        if (logYear === thisYear && logWeek === thisWeek) {
            totalTimeWeek += log.duration;
            if (log.caloriesBurned) totalCaloriesWeek += log.caloriesBurned;
        }

        if (logYear === thisYear && logMonth === thisMonth) {
            totalTimeMonth += log.duration;
            if (log.caloriesBurned) totalCaloriesMonth += log.caloriesBurned;
        }
    }

    for (const p of performances) {
        const max = p.weights.length > 0 ? Math.max(...p.weights.map(Number)) : 0;
        bestLiftPerExercise[p.exerciseId] = Math.max(bestLiftPerExercise[p.exerciseId] || 0, max);
    }

    let exerciseProgress: { date: string; maxWeight: number }[] = [];
    if (exerciseIdFilter) {
        const filtered = performances.filter(p => p.exerciseId === exerciseIdFilter);
        exerciseProgress = filtered.map(p => ({
            date: p.date.toISOString().split('T')[0],
            maxWeight: p.weights.length > 0 ? Math.max(...p.weights.map(Number)) : 0,
        })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    const allExercises = await fetchAllExercises();
    const exerciseCountByTarget: Record<string, number> = {};
    for (const p of performances) {
        const match = allExercises.find((e: any) => e.id === p.exerciseId);
        if (match && match.target) {
            exerciseCountByTarget[match.target] = (exerciseCountByTarget[match.target] || 0) + 1;
        }
    }

    const routineUsage: Record<number, { title: string; count: number }> = {};
    for (const log of logs) {
        const id = log.routine?.id;
        const title = log.routine?.title || 'Sin título';
        if (id) {
            if (!routineUsage[id]) {
                routineUsage[id] = { title, count: 0 };
            }
            routineUsage[id].count++;
        }
    }

    const mostUsedRoutines = Object.values(routineUsage).sort((a, b) => b.count - a.count);

    const exerciseFrequency: Record<string, { name: string; count: number }> = {};
    for (const p of performances) {
        if (!exerciseFrequency[p.exerciseId]) {
            exerciseFrequency[p.exerciseId] = { name: p.name, count: 0 };
        }
        exerciseFrequency[p.exerciseId].count++;
    }   

    const mostFrequentExercises = Object.values(exerciseFrequency).sort((a, b) => b.count - a.count);

    return {
        sessionsPerWeek,
        totalWeightPerWeek,
        bestLiftPerExercise,
        exerciseProgress,
        muscleGroups: exerciseCountByTarget,
        daysTrained,
        totalTimeWeek,
        totalTimeMonth,
        totalCaloriesWeek,
        totalCaloriesMonth,
        mostUsedRoutines,
        mostFrequentExercises
    };
};

export const formatWeightHistory = (weightLogs: WeightLog[]) => {
    return weightLogs.map(log => ({
        date: log.date.toISOString().split('T')[0],
        value: log.value,
    }));
};

export const getExerciseImprovement = async (userId: number, showAll: boolean) => {
    const repo = AppDataSource.getRepository(ExercisePerformance);

    const performances = await repo
        .createQueryBuilder('performance')
        .leftJoin('performance.trainingLog', 'trainingLog')
        .leftJoin('trainingLog.user', 'user')
        .where('user.id = :userId', { userId })
        .orderBy('performance.id', 'ASC')
        .getMany();

    const grouped: Record<string, { name: string; entries: { date: string; weight: number }[] }> = {};

    for (const perf of performances) {
        const weight = perf.isBodyweight
            ? perf.trainingLog.user.weight ?? 0
            : Math.max(...perf.weights);

        if (!grouped[perf.exerciseId]) {
            grouped[perf.exerciseId] = {
                name: perf.name,
                entries: [],
            };
        }

        if (!perf.trainingLog || !perf.trainingLog.startedAt) continue;

        grouped[perf.exerciseId].entries.push({
            date: perf.trainingLog.startedAt.toISOString().split('T')[0],
            weight,
        });
    }

    const results = Object.entries(grouped).map(([exerciseId, data]) => {
        const weights = data.entries.map(e => e.weight);
        const first = weights[0];
        const last = weights[weights.length - 1];
        const improvement = first > 0 ? ((last - first) / first) * 100 : 0;

        return {
            exerciseId,
            name: data.name,
            firstWeight: first,
            lastWeight: last,
            improvement: parseFloat(improvement.toFixed(2)),
            progress: data.entries,
        };
    });

    if (!showAll) {
        return results
            .sort((a, b) => b.improvement - a.improvement)
            .slice(0, 5)
            .map(({ exerciseId, name, improvement }) => ({
                exerciseId,
                name,
                improvement,
            }));
    }

    return results;
};
