import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { 
    findRoutineWithOwner,
    hasUserSavedRoutine,
    saveRoutineForUser,
    removeSavedRoutineForUser,
    getSavedRoutinesForUser
} from "../services/savedRoutineService";

export const addSavedRoutine = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ message: 'No autorizado' });
            return;
        }

        const routineId = parseInt(req.params.routineId);
        if (isNaN(routineId)) {
            res.status(400).json({ message: 'ID de rutina inválido' });
            return;
        }

        const routine = await findRoutineWithOwner(routineId);
        if (!routine || !routine.isPublic) {
            res.status(404).json({ message: 'Rutina no encontrada o no pública' });
            return;
        }

        if (routine.owner.id === userId) {
            res.status(400).json({ message: 'No puedes guardar tu propia rutina' });
            return;
        }

        const alreadySaved = await hasUserSavedRoutine(userId, routineId);
        if (alreadySaved) {
            res.status(400).json({ message: 'Ya has guardado esta rutina' });
            return;
        }

        await saveRoutineForUser(userId, routine);
        res.status(201).json({ message: 'Rutina guardada' });
    } catch (error) {
        console.error('Error al guardar rutina:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};

export const removeSavedRoutine = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ message: 'No autorizado' });
            return;
        }

        const routineId = parseInt(req.params.routineId);
        if (isNaN(routineId)) {
            res.status(400).json({ message: 'ID de rutina inválido' });
            return;
        }

        const removed = await removeSavedRoutineForUser(userId, routineId);
        if (!removed) {
            res.status(400).json({ message: 'No habías guardado esta rutina' });
            return;
        }

        res.status(200).json({ message: 'Rutina desguardada' });
    } catch (error) {
        console.error('Error al quitar rutina guardada:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};

export const getSavedRoutines = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ message: 'No autorizado' });
            return;
        }

        const routines = await getSavedRoutinesForUser(userId);
        res.status(200).json(routines);
    } catch (error) {
        console.error('Error al obtener rutinas guardadas:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};