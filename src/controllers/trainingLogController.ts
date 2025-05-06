import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { TrainingLog } from "../entities/TrainingLog";
import { ExercisePerformance } from "../entities/ExercisePerformance";
import { User } from "../entities/User";
import { AuthRequest } from "../middlewares/authMiddleware";
import { Routine } from "../entities/Routine";

export const createTrainingLog = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const {
            routineId,
            startedAt,
            endedAt,
            exercises, // [{ exerciseId, name, reps, weights, isBodyweight }]
        } = req.body;

        if (!routineId || !startedAt || !endedAt || !Array.isArray(exercises)) {
            res.status(400).json({ message: 'Faltan datos obligatorios' });
            return;
        }

        const routineRepo = AppDataSource.getRepository(Routine);
        const routine = await routineRepo.findOneBy({ id: routineId });

        if (!routine) {
            res.status(404).json({ message: 'Rutina no encontrada' });
            return;
        }

        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOneBy({ id: userId });

        if (!user) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return;
        }

        const start = new Date(startedAt);
        const end = new Date(endedAt);
        const duration = Math.floor((end.getTime() - start.getTime()) / 1000); // en segundos

        const performances: ExercisePerformance[] = [];
        let totalWeight = 0;

        for (const e of exercises) {
            const { exerciseId, name, reps, weights, isBodyweight } = e;

            if (!exerciseId || !name || !Array.isArray(reps) || !Array.isArray(weights)) {
                res.status(400).json({ message: 'Ejercicio inválido' });
                return;
            }

            if (reps.length !== weights.length) {
                res.status(400).json({ message: 'Los arrays reps y weights deben tener la misma longitud' });
                return;
            }

            const perf = new ExercisePerformance();
            perf.exerciseId = exerciseId;
            perf.name = name;
            perf.reps = reps;
            perf.weights = weights;
            perf.isBodyweight = !!isBodyweight;

            // Calcular peso total de este ejercicio
            for (let i = 0; i < reps.length; i++) {
                const rep = reps[i];
                const weight = weights[i];
                totalWeight += (isBodyweight ? 0 : rep * weight); // si es con peso corporal, no suma al total (o puedes usar peso del usuario si lo tienes)
            }

            performances.push(perf);
        }

        let caloriesBurned: number | undefined = undefined;

        if (user.weight) {
            const minutes = duration / 60;
            const MET = 6;
            caloriesBurned = 0.0175 * MET * user.weight * minutes;
        }

        const trainingRepo = AppDataSource.getRepository(TrainingLog);
        const newLog = trainingRepo.create({
            user: { id: userId },
            routine,
            startedAt: start,
            endedAt: end,
            duration,
            totalWeight,
            caloriesBurned,
            performances,
        });

        await trainingRepo.save(newLog);
        res.status(201).json({ message: 'Sesión registrada correctamente', trainingLog: newLog });
    } catch (error) {
        console.error('Error al registrar sesión:', error);
        res.status(500).json({ message: 'Error interno al registrar sesión' });
    }
};

export const getTrainingLogs = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;

        const trainingRepo = AppDataSource.getRepository(TrainingLog);

        const logs = await trainingRepo.find({
            where: { user: { id: userId } },
            relations: ['performances', 'routine'],
            order: { startedAt: 'DESC' },
        });

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

        const trainingRepo = AppDataSource.getRepository(TrainingLog);

        const log = await trainingRepo.findOne({
            where: { id: logId },
            relations: ['user', 'routine', 'performances'],
        });

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