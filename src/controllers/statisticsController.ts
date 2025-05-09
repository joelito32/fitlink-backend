import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import {
    getUserTrainingLogs,
    getUserWeightLogs,
    extractStatisticsFromLogs,
    formatWeightHistory,
    getExerciseImprovement
} from '../services/statisticsService';

export const getStatistics = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ message: 'No autorizado' });
            return;
        }

        const exerciseIdFilter = req.query.exerciseId?.toString();
        if (exerciseIdFilter && typeof exerciseIdFilter !== 'string') {
            res.status(400).json({ message: 'Parámetro exerciseId inválido' });
            return;
        }

        const logs = await getUserTrainingLogs(userId);
        const stats = await extractStatisticsFromLogs(userId, logs, exerciseIdFilter);
        const weightLogs = await getUserWeightLogs(userId);
        const weightHistory = formatWeightHistory(weightLogs);

        res.status(200).json({
            ...stats,
            weightHistory,
        });
    } catch (error) {
        console.error('Error al calcular estadísticas:', error);
        res.status(500).json({ message: 'Error interno al calcular estadísticas' });
    }
};

export const getExerciseImprovementStats = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ message: 'No autorizado' });
            return;
        }
        
        const showAll = req.query.all === 'true';

        const results = await getExerciseImprovement(userId, showAll);
        res.status(200).json(results);
    } catch (error) {
        console.error('Error en estadísticas de mejora de ejercicios:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};
