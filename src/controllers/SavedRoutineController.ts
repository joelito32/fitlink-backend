import { Response } from "express";
import { AppDataSource } from "../data-source";
import { SavedRoutine } from "../entities/SavedRoutine";
import { Routine } from "../entities/Routine";
import { AuthRequest } from "../middlewares/authMiddleware";

export const addSavedRoutine = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const routineId = parseInt(req.params.id);

        const routineRepo = AppDataSource.getRepository(Routine);
        const savedRepo = AppDataSource.getRepository(SavedRoutine);

        const routine = await routineRepo.findOne({
            where: { id: routineId },
            relations: ['owner'],
        });

        if (!routine) {
            res.status(404).json({ message: 'Rutina no encontrada' });
            return;
        }

        if (routine.owner.id === userId) {
            res.status(400).json({ message: 'No puedes guardar tu propia rutina' });
            return;
        }

        const existing = await savedRepo.findOne({
            where: { user: { id: userId }, routine: { id: routineId } },
        });

        if (existing) {
            res.status(400).json({ message: 'Ya has guardado esta rutina' });
            return;
        }

        const saved = savedRepo.create({
            user: { id: userId },
            routine: { id: routineId },
        });

        await savedRepo.save(saved);
        res.status(201).json({ message: 'Rutina guardada correctamente' });
    } catch (error) {
        console.error('Error al guardar rutina:', error);
        res.status(500).json({ message: 'Error al guardar rutina' });
    }
};

export const removeSavedRoutine = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const routineId = parseInt(req.params.id);

        const savedRepo = AppDataSource.getRepository(SavedRoutine);

        const saved = await savedRepo.findOne({
            where: { user: { id: userId }, routine: { id: routineId } },
        });

        if (!saved) {
            res.status(404).json({ message: 'Esta rutina no está guardada' });
            return;
        }

        await savedRepo.remove(saved);
        res.status(200).json({ message: 'Rutina desguardada correctamente' });
    } catch (error) {
        console.error('Error al desguardar rutina:', error);
        res.status(500).json({ message: 'Error al desguardar rutina' });
    }
};

export const getSavedRoutines = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;

        const savedRepo = AppDataSource.getRepository(SavedRoutine);

        const saved = await savedRepo.find({
            where: { user: { id: userId } },
            relations: ['routine', 'routine.exercises', 'routine.owner'],
            order: { savedAt: 'DESC' },
        });

        const result = saved.map((s) => s.routine);

        res.status(200).json(result);
    } catch (error) {
        console.error('Error al obtener rutinas guardadas:', error);
        res.status(500).json({ message: 'Error al obtener rutinas guardadas' });
    }
};