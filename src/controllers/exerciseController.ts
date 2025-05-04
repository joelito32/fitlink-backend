import { Request, Response } from 'express';
import { fetchAllExercises } from '../services/exerciseService';

export const getAllExercises = async (req: Request, res: Response): Promise<void> => {
    try {
        const target = req.query.target?.toString();

        const allExercises = await fetchAllExercises();

        let filtered = allExercises;

        if (target) {
            filtered = allExercises.filter((e: any) => e.target.toLowerCase() === target.toLowerCase());
        }

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

        const targetsSet = new Set<string>();

        allExercises.forEach((e: any) => {
            if (e.target) {
                targetsSet.add(e.target.toLowerCase());
            }
        });

        const targets = Array.from(targetsSet).sort();
        res.status(200).json(targets);
    } catch (error) {
        console.error('Error al obtener targets:', error);
        res.status(500).json({ message: 'Error al obtener grupos musculares' });
    }
};
