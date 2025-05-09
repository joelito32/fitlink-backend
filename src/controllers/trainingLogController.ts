import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import {
    findRoutineByIdWithOwner,
    findUserById,
    validateExercises,
    calculateCaloriesBurned,
    createTrainingLogForUser,
    getTrainingLogsByUser,
    getTrainingLogWithRelations,
} from "../services/trainingLogService";

export const createTrainingLog = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ message: 'No autorizado' });
            return;
        }

        const { routineId, startedAt, endedAt, exercises } = req.body;

        if (!routineId || !startedAt || !endedAt || !Array.isArray(exercises)) {
            res.status(400).json({ message: 'Faltan datos obligatorios' });
            return;
        }

        const routine = await findRoutineByIdWithOwner(routineId);
        if (!routine || (!routine.isPublic && routine.owner.id !== userId)) {
            res.status(403).json({ message: 'No tienes acceso a esta rutina' });
            return;
        }

        const user = await findUserById(userId);
        if (!user) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return;
        }

        const start = new Date(startedAt);
        const end = new Date(endedAt);
        const duration = Math.floor((end.getTime() - start.getTime()) / 1000);

        if (exercises.length === 0) {
            res.status(400).json({ message: 'Debes registrar al menos un ejercicio' });
            return;
        }

        const result = validateExercises(exercises);
        if (!result) {
            res.status(400).json({ message: 'Ejercicio inválido' });
            return;
        }

        const { performances, totalWeight } = result;
        const caloriesBurned = calculateCaloriesBurned(user.weight || null, duration);

        const newLog = await createTrainingLogForUser(
            userId,
            routine,
            start,
            end,
            duration,
            totalWeight,
            caloriesBurned,
            performances
        );

        res.status(201).json({ message: 'Sesión registrada correctamente', trainingLog: newLog });
    } catch (error) {
        console.error('Error al registrar sesión:', error);
        res.status(500).json({ message: 'Error interno al registrar sesión' });
    }
};

export const getTrainingLogs = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ message: 'No autorizado' });
            return;
        }

        const logs = await getTrainingLogsByUser(userId);
        res.status(200).json(logs);
    } catch (error) {
        console.error('Error al obtener sesiones:', error);
        res.status(500).json({ message: 'Error interno al obtener sesiones' });
    }
};

export const getTrainingLogById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const logId = parseInt(req.params.id);

        if (isNaN(logId)) {
            res.status(400).json({ message: 'ID inválido' });
            return;
        }

        const log = await getTrainingLogWithRelations(logId);
        if (!log) {
            res.status(404).json({ message: 'Sesión no encontrada' });
            return;
        }

        if (log.user.id !== userId) {
            res.status(403).json({ message: 'No tienes permiso para ver esta sesión' });
            return;
        }

        res.status(200).json(log);
    } catch (error) {
        console.error('Error al obtener sesión:', error);
        res.status(500).json({ message: 'Error interno al obtener sesión' });
    }
};
