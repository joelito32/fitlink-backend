import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { AuthRequest } from "../middlewares/authMiddleware";
import { TrainingLog } from "../entities/TrainingLog";
import { ExercisePerformance } from "../entities/ExercisePerformance";
import { fetchAllExercises } from "../services/exerciseService";

export const getStatistics = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const exerciseIdFilter = req.query.exerciseId?.toString();

        const trainingRepo = AppDataSource.getRepository(TrainingLog);
        const performanceRepo = AppDataSource.getRepository(ExercisePerformance);

        const logs = await trainingRepo.find({
            where: { user: { id: userId } },
            relations: ['performances'],
        });

        const performances = logs.flatMap(log => 
            log.performances.map(p => ({ ...p, date: log.startedAt }))
        );

        const sessionsPerWeek: Record<string, number> = {};
        for (const log of logs) {
            const week = `${log.startedAt.getFullYear()}-W${getWeekNumber(log.startedAt)}`;
            sessionsPerWeek[week] = (sessionsPerWeek[week] || 0) + 1;
        }

        const totalWeightPerWeek: Record<string, number> = {};
        for (const log of logs) {
            const week = `${log.startedAt.getFullYear()}-W${getWeekNumber(log.startedAt)}`;
            totalWeightPerWeek[week] = (totalWeightPerWeek[week] || 0) + log.totalWeight;
        }

        const bestLiftPerExercise: Record<string, number> = {};
        for (const p of performances) {
            const max = Math.max(...p.weights.map(Number));
            bestLiftPerExercise[p.exerciseId] = Math.max(bestLiftPerExercise[p.exerciseId] || 0, max);
        }

        let exerciseProgress: { date: string; maxWeight: number }[] = [];
        if (exerciseIdFilter) {
            const filtered = performances.filter(p => p.exerciseId === exerciseIdFilter);
            exerciseProgress = filtered.map(p => ({
                date: p.date.toISOString().split('T')[0],
                maxWeight: Math.max(...p.weights.map(Number)),
            })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        }

        const exerciseCountByTarget: Record<string, number> = {};
        const allExercises = await fetchAllExercises();

        for (const p of performances) {
            const match = allExercises.find(e = e.id === p.exerciseId);
            if (match && match.target) {
                exerciseCountByTarget[match.target] = (exerciseCountByTarget[match.target] || 0) + 1;
            }
        }

        res.status(200).json({
            sessionsPerWeek,
            totalWeightPerWeek,
            bestLiftPerExercise,
            exerciseProgress,
            muscleGroups: exerciseCountByTarget,
        });
    } catch (error) {
        console.error('Error al calcular estadísticas:', error);
        res.status(500).json({ message: 'Error al calcular estadísticas' });
    }
}

function getWeekNumber(date: Date): number {
    const firstJan = new Date(date.getFullYear(), 0, 1);
    const pastDays = Math.floor((+date - +firstJan) / (1000 * 60 * 60 * 24));
    return Math.ceil((pastDays + firstJan.getDay() + 1) / 7);
}