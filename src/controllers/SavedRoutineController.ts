import { Response } from 'express';
import { AppDataSource } from '../data-source';
import { AuthRequest } from '../middlewares/authMiddleware';
import { Routine } from '../entities/Routine';
import { SavedRoutine } from '../entities/SavedRoutine';

export const addSavedRoutine = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const routineId = parseInt(req.params.routineId);

        const routineRepo = AppDataSource.getRepository(Routine);
        const savedRepo = AppDataSource.getRepository(SavedRoutine);

        const routine = await routineRepo.findOneBy({ id: routineId });
        if (!routine || !routine.isPublic) {
            res.status(404).json({ message: 'Rutina no encontrada o no pública' });
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
            routine,
        });

        await savedRepo.save(saved);
        res.status(201).json({ message: 'Rutina guardada' });
    } catch (error) {
        console.error('Error al guardar rutina:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};

export const removeSavedRoutine = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const routineId = parseInt(req.params.routineId);

        const savedRepo = AppDataSource.getRepository(SavedRoutine);
        const existing = await savedRepo.findOne({
            where: { user: { id: userId }, routine: { id: routineId } },
        });

        if (!existing) {
            res.status(400).json({ message: 'No habías guardado esta rutina' });
            return;
        }

        await savedRepo.remove(existing);
        res.status(200).json({ message: 'Rutina desguardada' });
    } catch (error) {
        console.error('Error al quitar rutina guardada:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};

export const getSavedRoutines = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;

        const saved = await AppDataSource.getRepository(SavedRoutine).find({
            where: { user: { id: userId } },
            relations: ['routine', 'routine.owner'],
            order: { id: 'DESC' },
        });

        const routines = saved.map(s => s.routine);
        res.status(200).json(routines);
    } catch (error) {
        console.error('Error al obtener rutinas guardadas:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};