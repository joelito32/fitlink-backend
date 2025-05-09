import { Request, Response } from 'express';
import { fetchAllExercises, filterExercisesByTarget, getSortedTargets } from '../services/exerciseService';

export const getAllExercises = async (req: Request, res: Response): Promise<void> => {
    try {
        const target = req.query.target?.toString();
        const allExercises = await fetchAllExercises();
        const filtered = filterExercisesByTarget(allExercises, target);
        filtered.sort((a: any, b: any) => a.id.localeCompare(b.id));
        res.status(200).json(filtered);
    } catch (error) {
        console.error('Error al obtener ejercicios:', error);
        res.status(500).json({ message: 'Error al obtener ejercicios' });
    }
};

export const getTargets = async (req: Request, res: Response): Promise<void> => {
    try {
        const allExercises = await fetchAllExercises();
        const targets = getSortedTargets(allExercises);
        res.status(200).json(targets);
    } catch (error) {
        console.error('Error al obtener targets:', error);
        res.status(500).json({ message: 'Error al obtener grupos musculares' });
    }
};
